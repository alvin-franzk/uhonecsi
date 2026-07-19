const reasonDropdown = document.getElementById("reasonDropdown");
const retentionCancellation = document.getElementById("retentionCancellation");
const data = {};

const selectedPlans = {
    cancel: new Set(),
    keep: new Set()
};

Promise.all([
    fetch("data/plans.json").then(r => r.json()),
    fetch("data/cancellationData.json").then(r => r.json())
])
    .then(([plans, cancellationData]) => {

        data.plans = plans;
        data.cancellationData = cancellationData;

        populateReasons();
        populateProductTypes();
        generateCheckboxes();
        generateCancellationText();

    })
    .catch(error => {
        console.error(error);
    });

function generateCancellationText() {
    const retentionCancellation =
        document.getElementById("retentionCancellation");

    retentionCancellation.textContent =
        data.cancellationData?.[reasonDropdown.value]
            ?.retentionScript || "";
}

function generateCheckboxes() {
    const planListA =
        document.getElementById("planListA");

    const planListB =
        document.getElementById("planListB");

    const searchText =
        document
            .getElementById("cancelSearch")
            .value
            .toLowerCase();

    const selectedType =
        document
            .getElementById("cancelTypeFilter")
            .value;

    planListA.innerHTML = "";
    planListB.innerHTML = "";

    data.plans
        .filter(plan => {

            const typeMatch =
                selectedType === "All" ||
                plan.productType === selectedType;

            const searchMatch =
                plan.name
                    .toLowerCase()
                    .includes(searchText)
                ||
                plan.shortName
                    .toLowerCase()
                    .includes(searchText);

            return typeMatch && searchMatch;

        })
        .forEach(plan => {

            const cancelChecked =
                selectedPlans.cancel.has(plan.id);

            const keepChecked =
                selectedPlans.keep.has(plan.id);

            const disableA =
                selectedPlans.keep.has(plan.id);

            const disableB =
                selectedPlans.cancel.has(plan.id);


            planListA.insertAdjacentHTML(
                "beforeend",
                `
                <div class="form-check">
                <input
                class="form-check-input paired-checkbox"
                type="checkbox"
                value="${plan.id}"
                id="a${plan.id}"
                ${cancelChecked ? "checked" : ""}
                ${disableA ? "disabled" : ""}>
                <label
                class="form-check-label"
                for="a${plan.id}">
                ${plan.name}
                </label>
                </div>
                `
            );

            planListB.insertAdjacentHTML(
                "beforeend",
                `
                <div class="form-check">
                <input
                class="form-check-input paired-checkbox"
                type="checkbox"
                value="${plan.id}"
                id="b${plan.id}"
                ${keepChecked ? "checked" : ""}
                ${disableB ? "disabled" : ""}>
                <label
                class="form-check-label"
                for="b${plan.id}">
                ${plan.name}
                </label>
                </div>
                `
            );
        });
}

function populateProductTypes() {
    const filter =
        document.getElementById("cancelTypeFilter");

    const types = [
        ...new Set(
            data.plans.map(plan => plan.productType)
        )
    ].sort();

    types.forEach(type => {

        filter.insertAdjacentHTML(
            "beforeend",
            `<option value="${type}">${type}</option>`
        );
    });
}

function populateReasons() {
    const reasonDropdown =
        document.getElementById("reasonDropdown");

    reasonDropdown.innerHTML =
        `<option value="">Select a reason...</option>`;

    Object.entries(data.cancellationData)
        .forEach(([key, reason]) => {

            reasonDropdown.insertAdjacentHTML(
                "beforeend",
                `
                <option value="${key}">
                    ${reason.title}
                </option>
                `
            );
        });
}

reasonDropdown.addEventListener("change", generateCancellationText);

document
    .getElementById("cancelSearch")
    .addEventListener("input", generateCheckboxes);

document
    .getElementById("cancelTypeFilter")
    .addEventListener("change", generateCheckboxes);

document.addEventListener("change", function (e) {
    if (!e.target.classList.contains("paired-checkbox")) {
        return;
    }

    const planId = e.target.value;

    // Save state
    if (e.target.id.startsWith("a")) {
        if (e.target.checked) {
            selectedPlans.cancel.add(planId);
        } else {
            selectedPlans.cancel.delete(planId);
        }

    } else {
        if (e.target.checked) {
            selectedPlans.keep.add(planId);
        } else {
            selectedPlans.keep.delete(planId);
        }
    }

    // Disable matching checkbox
    const matchingBoxes = document.querySelectorAll(
        `.paired-checkbox[value="${planId}"]`
    );

    matchingBoxes.forEach(other => {
        if (other !== e.target) {
            other.disabled = e.target.checked;
        }
    });
});

document
    .getElementById("clearPlansBtn")
    .addEventListener("click", function () {

        selectedPlans.cancel.clear();
        selectedPlans.keep.clear();

        document.getElementById("cancelSearch").value = "";
        document.getElementById("cancelTypeFilter").value = "All";
        document.getElementById("reasonDropdown").value = "";
        document.getElementById("withdrawalCheckbox").checked = false;

        generateCheckboxes();
        generateCancellationText();
    });
