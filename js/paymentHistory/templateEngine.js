function buildDocument(record) {

    return `
        <div class="document">

            <p>Name: ${record.Name}</p>

           <p>
                Policy Number:
                ${record.PolicyNumber}
            </p>

          <p>
                Effective Date:
                ${record.EffectiveDate}
            </p>

        </div>
    `;
}