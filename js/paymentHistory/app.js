import { parseCSV } from "./csvParser.js";
import { buildLetter } from "./templateEngine.js";
import { exportPDF } from "./pdfExporter.js";

document
    .getElementById("csvFile")
    .addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const records = await parseCSV(file);
        console.log("Records:", records);
        generatePreview(records);
    });

function generatePreview(records) {
    console.log("generatePreview called");
    const html =
        buildLetter(records);
    console.log(html);
    document
        .getElementById("previewPaymentHistoryContainer")
        .innerHTML = html;
}

document
    .getElementById("downloadPdfBtn")
    .addEventListener("click", exportPDF);