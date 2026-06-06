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

    const accounts =
    await getAccounts(token);

    console.log(accounts);

    const table =
    document.getElementById(
        "accountsTable"
    );

    console.log(table);

    table.innerHTML = "";

    accounts.forEach(account => {

        const row =
        document.createElement("tr");

        row.innerHTML = `
            <td>${account.broker}</td>

            <td>${account.account_number}</td>

            <td>${account.server}</td>

            <td>
                <span class="status-badge">
                    ${account.status}
                </span>
            </td>

            <td>${formatDate(account.created_at)}</td>

            <td>
                <button
                    class="delete-btn"
                    data-id="${account.id}"
                >
                    Delete
                </button>
            </td>
        `;

        table.appendChild(row);

const deleteBtn =
row.querySelector(
    ".delete-btn"
);

deleteBtn.addEventListener(
    "click",
    async () => {

        const confirmDelete =
        confirm(
            "Delete this account?"
        );

        if(!confirmDelete){
            return;
        }

        const token =
        localStorage.getItem(
            "token"
        );

        const result =
        await deleteAccount(
            account.id,
            token
        );

        console.log(result);

        await loadAccounts();

    }
);

    });

}

loadAccounts();


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

        const result =
        await syncMT5(token);

        if(result.imported === 0){

            alert(
                "No new trades found."
            );

        }else{

            alert(
                `Imported ${
                    result.imported
                } new trades`
            );

        }

    }
);