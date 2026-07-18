const darkBtn = document.getElementById("darkModeBtn");

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    darkBtn.innerHTML = "☀️ Light Mode";
}

darkBtn.addEventListener("click", function() {

    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");

    localStorage.setItem("theme", isDark ? "dark" : "light");

    this.innerHTML = isDark
        ? "☀️ Light Mode"
        : "🌙 Dark Mode";
});


const selector = document.getElementById("layoutSelector");
const container = document.getElementById("dynamicContainer");

function renderLayout(layout) {

    switch(layout) {

        case "row":
            container.innerHTML = `
                <div class="d-flex gap-2">
                    <div class="card layout-item flex-fill">
                        <div class="card-body text-center">
                            Item 1
                        </div>
                    </div>

                    <div class="card layout-item flex-fill">
                        <div class="card-body text-center">
                            Item 2
                        </div>
                    </div>

                    <div class="card layout-item flex-fill">
                        <div class="card-body text-center">
                            Item 3
                        </div>
                    </div>
                </div>
            `;
            break;

        case "column":
            container.innerHTML = `
                <div class="d-grid gap-2">

                    <div class="card">
                        <div class="card-body text-center">
                            Item 1
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-body text-center">
                            Item 2
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-body text-center">
                            Item 3
                        </div>
                    </div>

                </div>
            `;
            break;

        case "single":
            container.innerHTML = `
                <div class="card">
                    <div class="card-body text-center">
                        Single Item
                    </div>
                </div>
            `;
            break;
    }

}

selector.addEventListener("change", function() {
    renderLayout(this.value);
});

renderLayout(selector.value);
