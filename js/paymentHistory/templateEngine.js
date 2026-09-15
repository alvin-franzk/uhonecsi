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


export function buildLetter(records) {
    console.log(records);
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
    const tableRows =
        buildPaymentTable(records);
    return `
        <div class="document">

            <p>
                ${new Date().toLocaleDateString()}
            </p>

            <p>
                ${memberName}<br>
                ${memberAddress}
            </p>

            <p>
                <strong>Subject:</strong>
                Payment History
            </p>

            <p>
                <strong>Re:</strong>
                ${planId}
            </p>

            <p>
                <strong>Plan Name:</strong>
                ${planName}
            </p>

            <p>
                Dear ${memberName}:
            </p>

            <p>
                This letter is in response to your recent request.
                Below is the payment history from
                ${earliest.toLocaleDateString()}
                to
                ${latest.toLocaleDateString()}
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
            <p></p>
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
    `;

}