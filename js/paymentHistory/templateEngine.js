import { getDateRange } from "./csvParser.js";

export function buildPaymentTable(records) {
    return records
        .map(record => `
            <tr>
                <td>${record.Date}</td>
                <td>${record.Method}</td>
                <td>$${record.Amount}</td>
                <td>${record.Status}</td>
            </tr>
        `)
        .join("");
}

export function getLetterData(records) {
    const memberName =
        document.getElementById("paymentHistoryName").value;
    const memberAddress =
        document.getElementById("paymentHistoryAddress").value;
    const planId =
        document.getElementById("paymentHistoryPlanID").value;
    const planName =
        document.getElementById("paymentHistoryPlanName").value;
    const { earliest, latest } =
        getDateRange(records);
    return {
        memberName,
        memberAddress,
        planId,
        planName,
        earliest,
        latest,
        records
    };
}

export function buildLetter(records) {

    const data = getLetterData(records);

    const tableRows =
        buildPaymentTable(data.records);

    return `
        <div class="document">

            <!-- HEADER -->
            <div class="document-header">
                <img src="./js/paymentHistory/assets/header_logo.jpg">
            </div>

            <p>
                ${new Date().toLocaleDateString()}
            </p>

            <p>
                ${data.memberName}<br>
                ${data.memberAddress}
            </p>

            <p>
                <strong>Subject:</strong>
                Payment History
            </p>

            <p>
                <strong>Re:</strong>
                ${data.planId}
            </p>

            <p>
                <strong>Plan Name:</strong>
                ${data.planName}
            </p>

            <p>
                Dear ${data.memberName}:
            </p>

            <p>
                This letter is in response to your recent request.
                Below is the payment history from
                ${data.earliest.toLocaleDateString()}
                to
                ${data.latest.toLocaleDateString()}
                of your plan.
            </p>

            <table>

                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Method</th>
                        <th>Amount</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                    ${tableRows}
                </tbody>

            </table>

            <div class="closing">

                <p>
                    If you have questions, you can visit
                    www.uhcmemberhub.com
                    or call 1-800-657-8205.
                </p>

                <p>
                    Sincerely,
                </p>

                <p>
                    Your Golden Rule Insurance Team
                </p>

            </div>

            <!-- FOOTER -->
            <div class="document-footer">
                <div>
                    Golden Rule Insurance Company Constituent Services
                    PO Box 31343, Salt Lake City, UT 84131
                </div>

                <div>
                    Phone: 1-800-657-8205,
                    Website: uhcmemberhub.com
                </div>
            </div>

        </div>
    `;
}
