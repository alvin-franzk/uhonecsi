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

// DEFAULTS
paidThroughDate.value =
    getLastDayOfMonth();

draftDate.value = 2;

cardSection.style.display =
    "block";

// layout function
function updateBillingLayout() {

    const requestType =
        billingRequestType.value;

    // reset visibility

    paymentSection.style.display =
        "none";

    paymentMethodContainer.style.display =
        "none";

    cardSection.style.display =
        "none";

    bankSection.style.display =
        "none";

    switch (requestType) {

        case "paymentOnly":

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

            cardSection.style.display =
                "block";

            break;


        case "updateBank":

            detailsCardHeader.textContent =
                "Bank Information";

            memberNameLabel.textContent =
                "Account Holder Name";

            bankSection.style.display =
                "block";

            break;


        case "paymentAndCard":

            detailsCardHeader.textContent =
                "Payment + Card Update";

            memberNameLabel.textContent =
                "Cardholder Name";

            paymentSection.style.display =
                "block";

            cardSection.style.display =
                "block";

            break;


        case "paymentAndBank":

            detailsCardHeader.textContent =
                "Payment + Bank Update";

            memberNameLabel.textContent =
                "Account Holder Name";

            paymentSection.style.display =
                "block";

            bankSection.style.display =
                "block";

            break;

    }

}

// otp only
function updatePaymentMethodLayout() {

    if (
        billingRequestType.value !==
        "paymentOnly"
    ) {
        return;
    }

    if (
        paymentMethod.value ===
        "card"
    ) {

        memberNameLabel.textContent =
            "Cardholder Name";

        cardSection.style.display =
            "block";

        bankSection.style.display =
            "none";

    } else {

        memberNameLabel.textContent =
            "Account Holder Name";

        cardSection.style.display =
            "none";

        bankSection.style.display =
            "block";

    }

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