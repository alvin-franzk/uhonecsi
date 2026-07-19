// Used by cancellationDate
function getLastDayOfMonth() {
    const today = new Date();

    return new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
    ).toISOString().split("T")[0];
}

// Used by cancellationDate
function formatDate(dateString) {
    if (!dateString) {
        return "";
    }
    const [year, month, day] =
        dateString.split("-");

    return `${month}/${day}/${year}`;
}

// Used by generateDisclaimerText and generateCSIText
function getTodayDate() {

    return new Date()
        .toISOString()
        .split("T")[0];

}

// Used by generateDisclaimerText and generateCSIText
function isRefundableDate(
    cancellationDateInput
) {
    const today =
        new Date()
            .toISOString()
            .split("T")[0];

    return cancellationDateInput <= today;
}

// Used by generateCSIText / Plan Lookup Map
function getPlanName(id) {
    return (
        data.planMap[id]?.name ||
        id
    );
}
