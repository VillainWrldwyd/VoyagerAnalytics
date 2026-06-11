const connectBtn =
document.getElementById(
    "connectAccountBtn"
);

const modal =
document.getElementById(
    "accountModal"
);

connectBtn.addEventListener(
    "click",
    () => {

        modal.style.display =
        "flex";

    }
);

// date formatting function
function formatDate(dateString){

    const date =
    new Date(dateString);

    return date.toLocaleDateString(
        "en-GB",
        {
            day:"2-digit",
            month:"short",
            year:"numeric"
        }
    );

}

// live mock data
const token =
localStorage.getItem("token");

async function loadAccounts(){

    const accounts = await getAccounts(token);
    const table    = document.getElementById("accountsTable");

    table.innerHTML = "";

    if(accounts.length === 0){
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

// Handle account form submission
const accountForm =
document.getElementById(
    "accountForm"
);

accountForm.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        const token =
        localStorage.getItem(
            "token"
        );

        const broker =
        document.getElementById(
            "broker"
        ).value;

        const account_number =
        document.getElementById(
            "accountNumber"
        ).value;

        const server =
        document.getElementById(
            "server"
        ).value;

        const investor_password =
        document.getElementById(
            "investorPassword"
        ).value;

        const result =
        await createAccount({

            broker,
            account_number,
            server,
            investor_password

        }, token);

        console.log(result);

        alert(
            "Account submitted"
        );

        await loadAccounts();

    }
);

// mt5 account sync btn
document
.getElementById(
    "syncMt5Btn"
)
.addEventListener(
    "click",
    async()=>{

        
        const token =
        localStorage.getItem(
            "token"
        );

        console.log(token);

       const result = await syncMT5(token);

    if(result.status === "error"){
        alert("MT5 sync must be run locally.\nUse sync.py on your Windows machine.");
        }else if(result.imported === 0){
            alert("No new trades found.");
        }else{
            alert(`Imported ${result.imported} new trades`);
        }
    }
);
