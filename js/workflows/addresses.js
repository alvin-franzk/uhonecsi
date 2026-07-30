function filterAddresses(data, searchText) {
    const query = searchText.trim().toLowerCase();

    if (!query) return data;

    return {
        addresses: data.addresses.filter(address => {

            const searchableText = [
                address.title,
                ...address.details,
                ...(address.keywords || [])
            ]
                .join(" ")
                .toLowerCase();

            return searchableText.includes(query);
        })
    };
}

function renderAddresses(data) {

    const container = document.getElementById(
        "categoriesAddressContainer"
    );

    container.innerHTML = `
        ${data.addresses.map(address => `
            <div class="card mb-3">
                <div
                    class="card-body copy-address"
                    data-address="${address.details.join('\n')}">

                    <h5 class="card-title">
                        ${address.title}
                    </h5>

                    ${address.details.map(line => `
                        <div>${line}</div>
                    `).join("")}

                </div>
            </div>
        `).join("")}
    `;
}

document.addEventListener("click", async (e) => {

    const card = e.target.closest(".copy-address");

    if (!card) return;

    const address =
        card.dataset.address;

    await navigator.clipboard.writeText(address);
});

let addressData;

fetch("data/addresses.json")
    .then(response => response.json())
    .then(data => {
        addressData = data;
        renderAddresses(data);
    })
    .catch(error => {
        console.error(
            "Failed to load addresses:",
            error
        );
    });

document
    .getElementById("addressSearch")
    .addEventListener("input", function () {

        const filteredData =
            filterAddresses(
                addressData,
                this.value
            );

        renderAddresses(filteredData);

    });