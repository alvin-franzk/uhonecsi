let emailTemplateData;

fetch("data/emailTemplates.json")
    .then(response => response.json())
    .then(data => {
        emailTemplateData = data;
        const subjectDropdown =
            document.getElementById("emailSubject");
        data.templates.forEach(template => {
            subjectDropdown.insertAdjacentHTML(
                "beforeend",
                `
                <option value="${template.id}">
                    ${template.subject}
                </option>
                `
            );
        });
    });

function updateTemplate() {

    const memberNameEmail =
        document.getElementById("memberNameEmail").value;
    const memberPlanEmail =
        document.getElementById("memberPlanEmail").value;
    const selectedTemplateId =
        document.getElementById("emailSubject").value;


    const template =
        emailTemplateData.templates.find(
            t => t.id === selectedTemplateId
        );
    if (!template) {
        document.getElementById("emailTemplate").value = "";
        return;
    }
    const emailBody = template.body
        .replaceAll(
            "{memberName}",
            memberNameEmail || "{Member Name}"
        )
        .replaceAll(
            "{planName}",
            memberPlanEmail || "{Plan Name}"
        );

    document.getElementById("emailSubjectLine").value =
        template.emailSubjectLine;

    document.getElementById("emailTemplate").value =
        emailBody;
}

document
    .getElementById("emailSubject")
    .addEventListener("change", updateTemplate);

document
    .getElementById("memberNameEmail")
    .addEventListener("input", updateTemplate);
document
    .getElementById("memberPlanEmail")
    .addEventListener("input", updateTemplate);

document
    .getElementById("copyEmailBtn")
    .addEventListener("click", async () => {

        const content =
            document.getElementById("emailTemplate").value;
        await navigator.clipboard.writeText(content);
        showCopyToast("Email copied");
    });