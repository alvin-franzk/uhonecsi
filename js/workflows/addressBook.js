let addressBookData;

fetch("data/addressBook.json")
    .then(response => response.json())
    .then(data => {
        addressBookData = data;
        renderCategories(data);
    })
    .catch(error => {
        console.error("Failed to load Address Book:", error);
    });

function filterContacts(data, searchText) {

    const query = searchText.trim().toLowerCase();

    if (!query) {
        return data;
    }

    return {
        categories: data.categories
            .map(category => ({
                ...category,
                contacts: category.contacts.filter(contact => {

                    const searchableText = [
                        contact.name,
                        contact.number,
                        ...(contact.keywords || [])
                    ]
                        .join(" ")
                        .toLowerCase();

                    return searchableText.includes(query);

                })
            }))
            .filter(category => category.contacts.length > 0)
    };
}

function renderCategories(data) {
    const container = document.getElementById("categoriesContainer");

    container.innerHTML = `
        <div class="row g-3">
            ${data.categories.map(category => `
                <div class="col-lg-6">
                    <div class="card category-card">
                        <div class="card-body">
                            <h4 class="card-title mb-3">
                                ${category.name}
                            </h4>
                            <div class="contact-table-container">
                                <table class="table table-bordered align-middle mb-0">
                                    <tbody>
                                        ${category.contacts.map(contact => `
                                            <tr>
                                                <td class="${contact.copyable === false ? '' : 'copy-cell'}">${contact.name}</td>
                                                <td class="${contact.copyable === false ? '' : 'copy-cell'} text-center">${contact.number}</td>
                                            </tr>
                                        `).join("")}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            `).join("")}
        </div>
    `;
}

document.addEventListener("click", async (e) => {

    const cell = e.target.closest(".copy-cell");

    if (!cell) return;

    const value = cell.textContent.trim();

    try {

        await navigator.clipboard.writeText(value);

        // Green flash on cell
        cell.classList.add("copied");

        setTimeout(() => {
            cell.classList.remove("copied");
        }, 800);

        // Toast
        const toast = document.getElementById("copyToast");

        toast.textContent = `✅ ${value} copied!`;

        toast.classList.add("show");

        clearTimeout(toast.hideTimer);

        toast.hideTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 1500);

    } catch (err) {
        console.error(err);
    }

});

document
    .getElementById("contactSearch")
    .addEventListener("input", function () {

        const filteredData =
            filterContacts(
                addressBookData,
                this.value
            );

        renderCategories(filteredData);

    });
