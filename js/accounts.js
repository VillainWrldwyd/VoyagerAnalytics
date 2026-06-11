const token = localStorage.getItem("token");

if(!token){
    window.location.href = "../login.html";
}

const connectBtn = document.getElementById("connectAccountBtn");
const modal      = document.getElementById("accountModal");

// Open modal
connectBtn.addEventListener("click", () => {
    modal.style.display = "flex";
});

// Close modal when clicking outside
modal.addEventListener("click", (e) => {
    if(e.target === modal){
        modal.style.display = "none";
    }
});

function formatDate(dateString){
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

async function loadAccounts(){

    const accounts = await getAccounts(token);
    const table    = document.getElementById("accountsTable");

    table.innerHTML = "";

    if(!Array.isArray(accounts) || accounts.length === 0){
        table.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: var(--muted); padding: 60px 20px;">
                    <i class="fas fa-briefcase" style="font-size: 2rem; margin-bottom: 16px; display: block; opacity: 0.3;"></i>
                    <p style="margin-bottom: 8px;">No accounts connected yet.</p>
                    <p style="font-size: 13px;">Click <strong style="color: white;">+ Connect Account</strong> to get started.</p>
                </td>
            </tr>
        `;
        return;
    }

    accounts.forEach(account => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${account.broker}</td>
            <td>${account.account_number}</td>
            <td>${account.server}</td>
            <td>
                <span class="status-badge">${account.status}</span>
            </td>
            <td>${formatDate(account.created_at)}</td>
            <td>
                <button class="delete-btn" data-id="${account.id}">Delete</button>
            </td>
        `;

        table.appendChild(row);

        row.querySelector(".delete-btn")
            .addEventListener("click", async () => {
                if(!confirm("Delete this account?")) return;
                await deleteAccount(account.id, token);
                await loadAccounts();
            });
    });
}

// Handle form submission
document.getElementById("accountForm")
    .addEventListener("submit", async (e) => {
        e.preventDefault();

        const result = await createAccount({
            broker:            document.getElementById("broker").value,
            account_number:    document.getElementById("accountNumber").value,
            server:            document.getElementById("server").value,
            investor_password: document.getElementById("investorPassword").value
        }, token);

        if(result.message === "Account created"){
            modal.style.display = "none";
            document.getElementById("accountForm").reset();
            await loadAccounts();
        } else {
            alert(result.detail || "Failed to create account. Try again.");
        }
    });

// MT5 sync button
document.getElementById("syncMt5Btn")
    .addEventListener("click", async () => {
        const result = await syncMT5(token);

        if(result.status === "error"){
            alert("MT5 sync must be run locally.\nUse the Sync Agent in Settings.");
        } else if(result.imported === 0){
            alert("No new trades found.");
        } else {
            alert(`Imported ${result.imported} new trades`);
        }
    });

loadAccounts();
