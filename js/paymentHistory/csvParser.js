document
    .getElementById("csvFile")
    .addEventListener("change", handleFile);

function handleFile(event) {

    const file = event.target.files[0];

    Papa.parse(file, {

        header: true,
        skipEmptyLines: true,

        complete(results) {

            console.log(results.data);

            generatePreview(results.data);
        }

    });
}