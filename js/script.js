function showLayout(layoutName) {
    document
        .querySelectorAll(".layout-panel")
        .forEach(panel => panel.style.display = "none");

    document
        .getElementById("layout" + layoutName)
        .style.display = "block";
}

const layoutSelector = document.getElementById("layoutSelector");

layoutSelector.addEventListener("change", function() {
    showLayout(this.value);
});

// Show initial layout
showLayout(layoutSelector.value);
