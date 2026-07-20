const billingRequestType =
    document.getElementById(
        "billingRequestType"
    );

const paymentMethod =
    document.getElementById(
        "paymentMethod"
    );

const paymentSection =
    document.getElementById(
        "paymentSection"
    );

const paymentMethodContainer =
    document.getElementById(
        "paymentMethodContainer"
    );

const cardSection =
    document.getElementById(
        "cardSection"
    );

const bankSection =
    document.getElementById(
        "bankSection"
    );

const detailsCardHeader =
    document.getElementById(
        "detailsCardHeader"
    );

const memberNameLabel =
    document.getElementById(
        "memberNameLabel"
    );

const paidThroughDate =
    document.getElementById(
        "paidThroughDate"
    );

const draftDate =
    document.getElementById(
        "draftDate"
    );
const paymentCardSection =
    document.getElementById(
        "paymentCardSection"
    );

const paymentBankSection =
    document.getElementById(
        "paymentBankSection"
    );

const oneTimeCardSection =
    document.getElementById(
        "oneTimeCardSection"
    );

const oneTimeBankSection =
    document.getElementById(
        "oneTimeBankSection"
    );


// DEFAULTS
paidThroughDate.value =
    getLastDayOfMonth();

draftDate.value = 2;


// layout function
function updateBillingLayout() {

    const requestType =
        billingRequestType.value;

    // reset visibility

    paymentSection.style.display =
        "none";

    paymentMethodContainer.style.display =
        "none";

    hideAllDetailSections();

    switch (requestType) {

        case "paymentOnly":
        case "oneTimePayment":

            detailsCardHeader.textContent =
                "Payment Details";

            paymentSection.style.display =
                "block";

            paymentMethodContainer.style.display =
                "block";

            updatePaymentMethodLayout();

            break;


        case "updateCard":

            detailsCardHeader.textContent =
                "Card Information";

            memberNameLabel.textContent =
                "Cardholder Name";

            paymentCardSection.style.display =
                "block";

            break;


        case "updateBank":

            detailsCardHeader.textContent =
                "Bank Information";

            memberNameLabel.textContent =
                "Account Holder Name";

            
oneTimeBankSection.style.display =
    "block";


            break;


        case "paymentAndCard":

            detailsCardHeader.textContent =
                "Payment + Card Update";

            memberNameLabel.textContent =
                "Cardholder Name";

            paymentSection.style.display =
                "block";

            paymentCardSection.style.display =
                "block";

            break;


        case "paymentAndBank":

            detailsCardHeader.textContent =
                "Payment + Bank Update";

            memberNameLabel.textContent =
                "Account Holder Name";

            paymentSection.style.display =
                "block";


            oneTimeBankSection.style.display =
                "block";


            break;

    }

}

function updatePaymentMethodLayout() {

    hideAllDetailSections();

    if (
        billingRequestType.value ===
        "paymentOnly"
    ) {

        if (
            paymentMethod.value ===
            "card"
        ) {

            memberNameLabel.textContent =
                "Cardholder Name";

            paymentCardSection.style.display =
                "block";

        } else {

            memberNameLabel.textContent =
                "Account Holder Name";

            paymentBankSection.style.display =
                "block";

        }

        return;
    }

    if (
        billingRequestType.value ===
        "oneTimePayment"
    ) {

        if (
            paymentMethod.value ===
            "card"
        ) {

            memberNameLabel.textContent =
                "Cardholder Name";

            oneTimeCardSection.style.display =
                "block";

        } else {

            memberNameLabel.textContent =
                "Account Holder Name";

            oneTimeBankSection.style.display =
                "block";

        }

    }

}

// helper
function hideAllDetailSections() {

    paymentCardSection.style.display =
        "none";

    paymentBankSection.style.display =
        "none";

    oneTimeCardSection.style.display =
        "none";

    oneTimeBankSection.style.display =
        "none";

}

// event listeners
billingRequestType.addEventListener(
    "change",
    updateBillingLayout
);

paymentMethod.addEventListener(
    "change",
    updatePaymentMethodLayout
);

updateBillingLayout();