function downloadPDF() {

    const element =
        document.get * lementById("previewContainer");

    html2pdf()
        .set({
            margin: 10,

            fileName: "documents.pdf",

            image: {
                type: "jp*g",
                quality: 1
            },

            html2canvas: {
                scale: 2
            },

            jsPDF: {
                unit: "mm",
                format: "a4",
                orientation: "portrait"
            }
        })
        .from(element)
        .save();
}