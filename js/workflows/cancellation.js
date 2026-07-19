const csiCancellation = document.getElementById("csiCancellation");
const data = {};

Promise.all([
    fetch("data/plans.json").then(r => r.json()),
    fetch("data/cancellationData.json").then(r => r.json())
])
    .then(([plans, cancellationData]) => {

        data.plans = plans;
        data.cancellationData = cancellationData;

        data.planMap =
            Object.fromEntries(
                plans.map(plan => [
                    plan.id,
                    plan
                ])
            );

        populateReasons();
        populateProductTypes();
        generateCheckboxes();
        refreshCancellationOutputs();
    })
    .catch(error => {
        console.error(error);
    });

function generateRetentionText() {
    retentionCancellation.textContent =
        data.cancellationData?.[
            reasonDropdown.value
        ]?.retentionScript || "";
}

function populateReasons() {
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

function generateDisclaimerText() {

    const disclaimerCancellation =
        document.getElementById(
            "disclaimerCancellation"
        );

    const formattedCancellationDate =
        formatDate(cancellationDate.value);

    const today = getTodayDate();

    const isWithdrawal =
        withdrawalCheckbox.checked;

    const cancelledCount =
        selectedPlans.cancel.size;

    const isRefundable =
        isRefundableDate(
            cancellationDate.value
        );

    let disclaimer = "";

    if (isWithdrawal) {

        const subject =
            cancelledCount > 1
                ? "the policies will be"
                : "the policy will be";

        const tense =
            cancelledCount > 1
                ? "they were never in effect"
                : "it was never in effect";

        disclaimer =
            `DISCLAIMER: Moving forward, ${subject} null and void as ${tense}. We are sorry to lose your business. If you would like your coverage reinstated within 48 hours from the withdrawal date, please call the same phone number.
An email notification will be sent today, and a letter confirming this withdrawal will be mailed within 7-10 business days. Refunds will be processed within 8-10 business days and returned to the payment method currently on file.`;
        disclaimer +=
            `\nMoving forward, no further payments will be taken out.`
    } else {
        let coverageText;
        if (cancellationDate.value < today) {
            coverageText =
                `DISCLAIMER: Your coverage effectively ended on ${formattedCancellationDate}.`;
        } else if (cancellationDate.value === today) {
            coverageText =
                `DISCLAIMER: Your coverage will effectively end tonight at 11:59 PM on ${formattedCancellationDate}.`;
        } else {
            coverageText =
                `DISCLAIMER: Your coverage will end at 11:59 PM on ${formattedCancellationDate}.`;
        }
        disclaimer =
            `${coverageText}
If your plan includes prescription coverage, please contact your pharmacy as soon as possible to update your information.
We are sorry to lose your business. If you would like your coverage reinstated within 48 hours from the cancellation date, please call the same phone number.
An email notification will be sent today, and a letter confirming this cancellation will be mailed within 7-10 business days.`;
        disclaimer +=
            `\nMoving forward, no further payments will be taken out.`
        if (isRefundable || isWithdrawal) {
            disclaimer +=
                `\n\nRefunds will be processed within 8-10 business days and returned to the payment method currently on file.`;
        }
    }
    disclaimerCancellation.textContent =
        disclaimer;
}

function generateCSIText() {
    const formattedCancellationDate = formatDate(cancellationDate.value);
    const today = getTodayDate();
    const isRefundable = isRefundableDate(cancellationDate.value);
    const reason =
        data.cancellationData?.[reasonDropdown.value]
            ?.title || "";

    const cancelledPolicies =
        Array.from(selectedPlans.cancel)
            .map(getPlanName)
            .join(", ") || "N/A";
    const keptPolicies =
        Array.from(selectedPlans.keep)
            .map(getPlanName)
            .join(", ") || "N/A";

    const isWithdrawal = withdrawalCheckbox.checked;

    const requestType =
        isWithdrawal
            ? "withdraw"
            : "cancel";

    const actionType =
        isWithdrawal
            ? "withdrawal"
            : "cancellation";

    const policyLabel =
        isWithdrawal
            ? "Policy Withdrawn"
            : "Policy Cancelled";

    const effectiveLabel =
        isWithdrawal
            ? "Withdrawal Effective"
            : "Cancellation Effective";

    let coverageLine;

    if (isWithdrawal) {
        coverageLine =
            `Advised sub the policy will be treated as never having been in effect.`;
    } else if (cancellationDate.value < today) {
        coverageLine =
            `Advised sub the coverage effectively ended on ${formattedCancellationDate}.`;
    } else {
        coverageLine =
            `Advised sub the coverage will end at 11:59 PM the night of ${formattedCancellationDate}.`;
    }
    let csiText =
        `Sub ci to ${requestType} their plan due to ${reason}.
CIC Verified
Rep tried to retain the plan--however, sub wanted to just proceed with the ${actionType}.
${coverageLine}
Email will be sent out today and confirmation letter will be mailed within 7-10 BD.`;
    if (isRefundable || isWithdrawal) {
        csiText +=
            ` Refunds will be processed within 8-10 BD.`;
    }
    csiText +=
        `
\n${policyLabel}: ${cancelledPolicies}
${effectiveLabel}: ${formattedCancellationDate}
Sub will keep: ${keptPolicies}

No other inquiry`;

    csiCancellation.value = csiText;
}

function refreshCancellationOutputs() {
    generateRetentionText();
    generateDisclaimerText();
    generateCSIText();
}

function resetCancellationForm() {
    selectedPlans.cancel.clear();
    selectedPlans.keep.clear();

    document.getElementById("cancelSearch").value = "";
    document.getElementById("cancelTypeFilter").value = "All";
    document.getElementById("reasonDropdown").value = "";
    document.getElementById("withdrawalCheckbox").checked = false;
    document.getElementById("cancellationDate").value =
        getLastDayOfMonth();

    generateCheckboxes();
    refreshCancellationOutputs();
}

cancelSearch.addEventListener("input", generateCheckboxes);

cancelTypeFilter.addEventListener("change", generateCheckboxes);

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
    generateDisclaimerText();
    generateCSIText();
});

document.getElementById("cancellationDate").value =
    getLastDayOfMonth();

// reason Dropdown changes will update cancellation textareas
reasonDropdown.addEventListener("change", refreshCancellationOutputs);

// withdrawal checkbox changes will update cancellation textareas
withdrawalCheckbox.addEventListener("change", refreshCancellationOutputs);

// Reset Button
clearPlansBtn.addEventListener(
    "click",
    function () {
        resetCancellationForm();
        const originalText =
            this.textContent;
        this.textContent = "Cleared!";
        setTimeout(() => {
            this.textContent = originalText;
        }, 1500);
    }
);

cancellationDate.addEventListener(
    "change",
    function () {
        generateDisclaimerText();
        generateCSIText();
    }
);

// Copy to Clipboard Logic
copyCSIBtn.addEventListener(
    "click",
    async function () {
        try {
            await navigator.clipboard.writeText(
                csiCancellation.value
            );
            const originalText =
                this.textContent;
            this.textContent = "Copied!";
            setTimeout(() => {
                this.textContent = originalText;
            }, 1500);
        } catch (error) {
            console.error(
                "Failed to copy CSI",
                error
            );
        }
    }
);