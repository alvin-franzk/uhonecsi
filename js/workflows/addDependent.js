const selectedAddDepPlans = new Set();

Promise.all([
    fetch("data/plans.json").then(r => r.json())
])
    .then(([plans]) => {

        data.plans = plans;

        data.planMap =
            Object.fromEntries(
                plans.map(plan => [
                    plan.id,
                    plan
                ])
            );

        populateProductTypes(addDepTypeFilter);
        generateAddDepPlans();
    })
    .catch(error => {
        console.error(error);
    });

function generateAddDepPlans() {
    const planList =
        document.getElementById("addDepPlanListA");

    const searchText =
        document
            .getElementById("addDepSearch")
            .value
            .toLowerCase();

    const selectedType =
        document
            .getElementById("addDepTypeFilter")
            .value;

    planList.innerHTML = "";

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
                (plan.keywords || []).some(keyword =>
                    keyword
                        .toLowerCase()
                        .includes(searchText)
                );

            return typeMatch && searchMatch;
        })
        .forEach(plan => {
            planList.insertAdjacentHTML(
                "beforeend",
                `
                <div class="form-check">
                    <input
                        class="form-check-input adddep-checkbox"
                        type="checkbox"
                        value="${plan.id}"
                        id="dep${plan.id}"
                        ${selectedAddDepPlans.has(plan.id) ? "checked" : ""}>
                    <label
                        class="form-check-label"
                        for="dep${plan.id}">
                        ${plan.name}
                    </label>
                </div>
                `
            );
        });
}

addDepSearch.addEventListener(
    "input",
    generateAddDepPlans
);

addDepTypeFilter.addEventListener(
    "change",
    generateAddDepPlans
);

document.addEventListener("change", function (e) {
    if (!e.target.classList.contains("adddep-checkbox")) {
        return;
    }

    const planId = e.target.value;

    if (e.target.checked) {
        selectedAddDepPlans.add(planId);
    } else {
        selectedAddDepPlans.delete(planId);
    }

    console.log([...selectedAddDepPlans]);
});