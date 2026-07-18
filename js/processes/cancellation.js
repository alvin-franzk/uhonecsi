const reasonDropdown = document.getElementById("reasonDropdown");
const disclaimerCancellation = document.getElementById("disclaimerCancellation");

const templates = {
    GroupPlan: "That’s great you have coverage through work. One thing to remember is that employer insurance usually ends if you change jobs. This policy stays with you no matter where you work— Would you like to keep the coverage, or is this cancellation final?",

    IndivPlan: "It’s smart to look at alternatives. Just keep in mind, this policy is designed to work alongside other coverage to help with costs your new plan may not cover. Would you like me to connect you with our sales team to compare options? Or should we proceed with the cancellation?",

    Cost: "I understand the cost can feel heavy. Rather than losing coverage completely, we can connect you with a broker to explore ways to adjust your plan so it’s more manageable— Would you like to keep the coverage, or is this cancellation final?",

    Benefits: "I understand if the benefits don’t feel like a fit. I can connect you with our sales team who can review your options and see if there’s a plan that better meets your needs— Would you like to keep the coverage, or is this cancellation final?",

    Other: "This is actually a great supplementary health plan that provides extra protection for unexpected medical costs. Before we proceed, can I confirm— is this cancellation final, or would you like to keep the coverage?",
};

function generateCancellationText() {
    disclaimerCancellation.textContent =
        templates[reasonDropdown.value] || "";
}

reasonDropdown.addEventListener("change", generateCancellationText);

document.querySelectorAll(".paired-checkbox").forEach(box => {

    box.addEventListener("change", function () {

        const matchingBoxes = document.querySelectorAll(
            `.paired-checkbox[value="${this.value}"]`
        );

        matchingBoxes.forEach(other => {

            if (other !== this) {

                other.disabled = this.checked;

                if (!this.checked) {
                    other.disabled = false;
                }

            }

        });

    });

});