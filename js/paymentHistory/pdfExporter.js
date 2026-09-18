export async function exportPDF(data) {
    const {
        PDFDocument,
        StandardFonts
    } = PDFLib;

    const pdfDoc = await PDFDocument.create();

    /*
     * -------------------------
     * LOAD HEADER IMAGE
     * -------------------------
     */

    const headerBytes = await fetch(
        "./js/paymentHistory/assets/header_logo.jpg"
    ).then(response => {
        if (!response.ok) {
            throw new Error(
                `Failed to load header image: ${response.status}`
            );
        }

        return response.arrayBuffer();
    });

    const headerImage = await pdfDoc.embedJpg(
        headerBytes
    );

    /*
     * -------------------------
     * CREATE FIRST PAGE
     * -------------------------
     */

    let { page, y } = createPage(
        pdfDoc,
        headerImage
    );

    drawHeader(page, headerImage);

    const font = await pdfDoc.embedFont(
        StandardFonts.Helvetica
    );

    const bold = await pdfDoc.embedFont(
        StandardFonts.HelveticaBold
    );

    // Date
    page.drawText(
        new Date().toLocaleDateString(),
        {
            x: 50,
            y,
            size: 11,
            font
        }
    );

    y -= 40;

    // Member name
    page.drawText(
        data.memberName,
        {
            x: 50,
            y,
            size: 11,
            font
        }
    );

    y -= 18;

    // Member address
    page.drawText(
        data.memberAddress,
        {
            x: 50,
            y,
            size: 11,
            font
        }
    );

    y -= 40;

    // Subject
    page.drawText(
        "Subject: Payment History",
        {
            x: 50,
            y,
            size: 11,
            font: bold
        }
    );

    y -= 25;

    // Plan ID
    page.drawText(
        `Re: ${data.planId}`,
        {
            x: 50,
            y,
            size: 11,
            font
        }
    );

    y -= 25;

    // Plan Name
    page.drawText(
        `Plan Name: ${data.planName}`,
        {
            x: 50,
            y,
            size: 11,
            font
        }
    );

    y -= 40;

    // Greeting
    page.drawText(
        `Dear ${data.memberName}:`,
        {
            x: 50,
            y,
            size: 11,
            font
        }
    );

    y -= 30;

    // Letter body
    page.drawText(
        "This letter is in response to your recent request.",
        {
            x: 50,
            y,
            size: 11,
            font
        }
    );

    y -= 18;

    page.drawText(
        `Below is the payment history from ${data.earliest.toLocaleDateString()} to ${data.latest.toLocaleDateString()} of your plan.`,
        {
            x: 50,
            y,
            size: 11,
            font
        }
    );

    y -= 35;

    /*
     * Draw the table.
     *
     * drawTable() now returns BOTH:
     * - the page where the table ended
     * - the final Y position
     */
    const tableResult = drawTable(
        pdfDoc,
        page,
        y,
        data.records,
        font,
        bold,
        headerImage
    );

    page = tableResult.page;
    y = tableResult.y;

    y -= 25;

    /*
     * Make sure there is enough room for the closing text.
     * Otherwise, put it on a new page.
     */
    const closingSectionHeight = 140;

    if (y < closingSectionHeight) {
        const newPage = createPage(
            pdfDoc,
            headerImage
        );

        page = newPage.page;
        y = newPage.y;
    }

    page.drawText(
        "If you have questions, you can visit www.uhcmemberhub.com or call 1-800-657-8205.",
        {
            x: 50,
            y,
            size: 11,
            font
        }
    );

    y -= 45;

    page.drawText(
        "Sincerely,",
        {
            x: 50,
            y,
            size: 11,
            font
        }
    );

    y -= 25;

    page.drawText(
        "Your Golden Rule Insurance Team",
        {
            x: 50,
            y,
            size: 11,
            font
        }
    );


    // Footer only appears on final page
    drawFooter(page, font);


    const pdfBytes = await pdfDoc.save();

    download(pdfBytes);
}

function createPage(pdfDoc, headerImage) {
    const page = pdfDoc.addPage([612, 792]);

    const headerBottomY = drawHeader(
        page,
        headerImage
    );

    return {
        page,

        // Start content 25 points below header
        y: headerBottomY - 25
    };
}

function drawHeader(page, headerImage) {
    const pageWidth = page.getWidth();
    const pageHeight = page.getHeight();

    const maxWidth = pageWidth - 100;
    const maxHeight = 70;

    const scale = Math.min(
        maxWidth / headerImage.width,
        maxHeight / headerImage.height
    );

    const width = headerImage.width * scale;
    const height = headerImage.height * scale;

    const headerY =
        pageHeight - height - 30;

    page.drawImage(headerImage, {
        x: 50,
        y: headerY,
        width,
        height
    });

    // Return where the header ends
    return headerY;
}

function drawFooter(page, font) {
    const fontSize = 8;
    const lineHeight = 11;

    const pageWidth = page.getWidth();

    const lines = [
        "Golden Rule Insurance Company Constituent Services PO Box 31343, Salt Lake City, UT 84131",
        "Phone: 1-800-657-8205, Website: uhcmemberhub.com"
    ];

    let y = 35;

    lines.forEach(line => {
        const textWidth =
            font.widthOfTextAtSize(line, fontSize);

        const x =
            (pageWidth - textWidth) / 2;

        page.drawText(line, {
            x,
            y,
            size: fontSize,
            font
        });

        y -= lineHeight;
    });
}


function drawTable(
    pdfDoc,
    page,
    startY,
    records,
    font,
    bold,
    headerImage
) {
    const rowHeight = 20;

    const tableX = 50;

    const col1 = 90;   // Date
    const col2 = 240;  // Method
    const col3 = 90;   // Amount
    const col4 = 80;   // Status

    const tableWidth =
        col1 + col2 + col3 + col4;

    /*
     * Bottom margin.
     *
     * Once the table reaches this point,
     * a new page will automatically be created.
     */
    const bottomMargin = 50;

    let y = startY;


    /*
     * -------------------------
     * TABLE HEADER FUNCTION
     * -------------------------
     *
     * This lets us redraw the exact same header
     * every time we create a new page.
     */
    function drawTableHeader() {
        // Header border
        page.drawRectangle({
            x: tableX,
            y: y - 5,
            width: tableWidth,
            height: rowHeight,
            borderWidth: 1,
            borderColor: PDFLib.rgb(0, 0, 0)
        });

        // Vertical separators
        page.drawLine({
            start: {
                x: tableX + col1,
                y: y - 5
            },
            end: {
                x: tableX + col1,
                y: y + 15
            },
            thickness: 1
        });

        page.drawLine({
            start: {
                x: tableX + col1 + col2,
                y: y - 5
            },
            end: {
                x: tableX + col1 + col2,
                y: y + 15
            },
            thickness: 1
        });

        page.drawLine({
            start: {
                x: tableX + col1 + col2 + col3,
                y: y - 5
            },
            end: {
                x: tableX + col1 + col2 + col3,
                y: y + 15
            },
            thickness: 1
        });

        // Header text
        page.drawText(
            "Date",
            {
                x: tableX + 5,
                y,
                size: 10,
                font: bold
            }
        );

        page.drawText(
            "Method",
            {
                x: tableX + col1 + 5,
                y,
                size: 10,
                font: bold
            }
        );

        page.drawText(
            "Amount",
            {
                x: tableX + col1 + col2 + 5,
                y,
                size: 10,
                font: bold
            }
        );

        page.drawText(
            "Status",
            {
                x: tableX + col1 + col2 + col3 + 5,
                y,
                size: 10,
                font: bold
            }
        );

        y -= rowHeight;
    }


    /*
     * -------------------------
     * TABLE ROW FUNCTION
     * -------------------------
     */
    function drawRow(record) {
        // Row border
        page.drawRectangle({
            x: tableX,
            y: y - 5,
            width: tableWidth,
            height: rowHeight,
            borderWidth: 1,
            borderColor: PDFLib.rgb(0, 0, 0)
        });

        // Vertical separator 1
        page.drawLine({
            start: {
                x: tableX + col1,
                y: y - 5
            },
            end: {
                x: tableX + col1,
                y: y + 15
            },
            thickness: 1
        });

        // Vertical separator 2
        page.drawLine({
            start: {
                x: tableX + col1 + col2,
                y: y - 5
            },
            end: {
                x: tableX + col1 + col2,
                y: y + 15
            },
            thickness: 1
        });

        // Vertical separator 3
        page.drawLine({
            start: {
                x: tableX + col1 + col2 + col3,
                y: y - 5
            },
            end: {
                x: tableX + col1 + col2 + col3,
                y: y + 15
            },
            thickness: 1
        });

        // Date
        page.drawText(
            String(record.Date || ""),
            {
                x: tableX + 5,
                y,
                size: 10,
                font
            }
        );

        // Payment Method
        page.drawText(
            String(record.Method || ""),
            {
                x: tableX + col1 + 5,
                y,
                size: 10,
                font
            }
        );

        // Amount
        page.drawText(
            `$${record.Amount ?? ""}`,
            {
                x: tableX + col1 + col2 + 5,
                y,
                size: 10,
                font
            }
        );

        // Status
        page.drawText(
            String(record.Status || ""),
            {
                x: tableX + col1 + col2 + col3 + 5,
                y,
                size: 10,
                font
            }
        );

        y -= rowHeight;
    }


    /*
     * Draw the initial header on Page 1.
     */
    drawTableHeader();


    /*
     * -------------------------
     * DRAW ALL RECORDS
     * -------------------------
     */
    records.forEach(record => {

        /*
         * Check BEFORE drawing the next row.
         *
         * If the row would run into the bottom
         * margin, create a new page.
         */
        if (y - rowHeight < bottomMargin) {

            const newPage = createPage(
                pdfDoc,
                headerImage
            );

            page = newPage.page;
            y = newPage.y;

            // Repeat table header
            drawTableHeader();
        }

        drawRow(record);
    });


    /*
     * Return BOTH values because the table
     * may now be on Page 2, Page 3, etc.
     */
    return {
        page,
        y
    };
}

function download(bytes) {

    const blob =
        new Blob(
            [bytes],
            {
                type:
                    "application/pdf"
            }
        );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        "PaymentHistory.pdf";

    a.click();

    URL.revokeObjectURL(url);

}