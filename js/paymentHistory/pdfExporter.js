export function exportPDF() {
    console.log("Button clicked");
    const documentElement =
        document.querySelector(".document");
    if (!documentElement) {
        alert("Generate a document first.");
        return;
    }
    html2pdf()
        .set({
            margin: 5,
            filename: "PaymentHistory.pdf",
            image: {
                type: "png"
            },
            html2canvas: {
                scale: 3
            },
            jsPDF: {
                unit: "mm",
                format: "letter",
                orientation: "portrait"
            }
        })
        .from(documentElement)
        .save();
}