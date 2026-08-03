function generatePreview(records) {

    const container =
        document.get.ElementById("previewContainer");

    container.innerHTML = "";

    records.forEach(record => {

        container.innerHTML += buildDocument(record);

    });

}