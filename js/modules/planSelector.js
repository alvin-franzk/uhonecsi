const selectedPlans = {
    cancel: new Set(),
    keep: new Set()
};

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

    const selectedType = cancelTypeFilter.value;

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

            const cancelChecked = selectedPlans.cancel.has(plan.id);
            const keepChecked = selectedPlans.keep.has(plan.id);
            const disableA = selectedPlans.keep.has(plan.id);
            const disableB = selectedPlans.cancel.has(plan.id);

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
    const types = [
        ...new Set(
            data.plans.map(plan => plan.productType)
        )
    ].sort();

    types.forEach(type => {

        cancelTypeFilter.insertAdjacentHTML(
            "beforeend",
            `<option value="${type}">${type}</option>`
        );
    });
}