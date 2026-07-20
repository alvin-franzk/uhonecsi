const dayOfCancellation = document.getElementById("dayOfCancellation");
const monthDays = document.getElementById("monthDays");

const monthlyPremium = document.getElementById("monthlyPremium");
const premiumPerDay = document.getElementById("premiumPerDay");
const daysUncovered = document.getElementById("daysUncovered");
const proratedAmount = document.getElementById("proratedAmount");

function getMonthLength() {
    const today = new Date();
    return new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
    ).getDate();
}

function calculateRefund() {
    const premium = Number(monthlyPremium.value) || 0;
    const daysInMonth = Number(monthDays.value) || 31;
    const cancelDay = Number(dayOfCancellation.value) || 1;
    const uncovered = daysInMonth - cancelDay;
    const perDay = premium / daysInMonth;
    const prorated = uncovered * perDay;

    daysUncovered.value = uncovered;
    premiumPerDay.value = perDay.toFixed(2);
    proratedAmount.value = prorated.toFixed(2);

}

monthDays.value = getMonthLength();
dayOfCancellation.max = monthDays.value;
dayOfCancellation.value = Math.min(
    new Date().getDate(),
    Number(monthDays.value)
);

monthDays.addEventListener("input", function () {
    this.value = Math.min(
        31,
        Math.max(28, Number(this.value))
    );

    dayOfCancellation.max = this.value;
    if (
        Number(dayOfCancellation.value) >
        Number(this.value)
    ) {
        dayOfCancellation.value =
            this.value;
    }
});

dayOfCancellation.addEventListener(
    "input",
    function () {
        this.value = Math.min(
            Number(this.max),
            Math.max(1, Number(this.value))
        );
    }
);

monthlyPremium.addEventListener("input", calculateRefund);
monthDays.addEventListener("input", calculateRefund);
dayOfCancellation.addEventListener("input", calculateRefund);

calculateRefund();