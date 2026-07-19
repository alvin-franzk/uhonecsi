const layoutSelector =
    document.getElementById("layoutSelector");

fetch("data/layouts.json")
    .then(response => response.json())
    .then(layouts => {
        populateLayouts(layouts);
        layoutSelector.addEventListener(
            "change",
            function () {
                showLayout(this.value);
            }
        );
        showLayout(layoutSelector.value);
    })
    .catch(error => {
        console.error(
            "Failed to load layouts:",
            error
        );
    });

function populateLayouts(layouts) {
    layoutSelector.innerHTML = "";
    layouts
        .filter(layout => layout.enabled)
        .forEach(layout => {
            const panel =
                document.getElementById(
                    getLayoutId(layout.id)
                );
            if (!panel) {

                console.warn(
                    `Missing panel: ${getLayoutId(layout.id)}`
                );
                return;
            }
            layoutSelector.insertAdjacentHTML(
                "beforeend",
                `
                <option value="${layout.id}">
                    ${layout.title}
                </option>
                `
            );
        });
}

function showLayout(layoutId) {
    document
        .querySelectorAll(".layout-panel")
        .forEach(panel => {
            panel.style.display = "none";
        });
    const layout =
        document.getElementById(
            getLayoutId(layoutId)
        );
    if (!layout) {
        console.warn(
            `Layout not implemented yet: ${layoutId}`
        );
        return;
    }
    layout.style.display = "block";
}


function getLayoutId(layoutId) {
    return `layout${layoutId}`;
}

