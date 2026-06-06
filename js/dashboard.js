/*route protection*/
const token =
localStorage.getItem(
    "token"
);

if(!token){

    window.location.href =
    "../login.html";

}

// load dashboard data
async function loadDashboard(){

    const mt5 =
    await getMT5Account(
        token
    );

    const analytics =
    await getAnalytics(
        token
    );

    const accounts =
    await getAccounts(
        token
    );

    const trades =
    await getTrades(
        token
    );

    console.log("MT5 Account:", mt5);
    console.log(document.getElementById("mt5Balance"));
    console.log(document.getElementById("mt5Equity"));
    console.log(document.getElementById("mt5Profit"));
    console.log(document.getElementById("mt5FreeMargin"));


    buildEquityCurve(trades);

    document.getElementById(
        "mt5Balance"
    ).textContent =
        `$${Number(mt5.balance).toFixed(2)}`;

    document.getElementById(
        "mt5Equity"
    ).textContent =
        `$${Number(mt5.equity).toFixed(2)}`;

    document.getElementById(
        "mt5Profit"
    ).textContent =
        `$${Number(mt5.profit).toFixed(2)}`;

    document.getElementById(
        "mt5FreeMargin"
    ).textContent =
        `$${Number(mt5.margin_free).toFixed(2)}`;

    const table =
    document.getElementById(
        "recentTradesTable"
    );

    table.innerHTML = "";

    trades
        .slice(-5)
        .reverse()
        .forEach(trade => {

            const row =
            document.createElement("tr");

            const profitClass =
                trade.profit >= 0
                ? "profit-positive"
                : "profit-negative";

            row.innerHTML = `

                <td>${trade.symbol}</td>

                <td>${trade.order_type}</td>

                <td class="${profitClass}">
                    ${trade.profit >= 0 ? "+" : ""}
                    $${trade.profit}
                </td>

            `;

            table.appendChild(row);

        })


    // mt5 sync
    document
    .getElementById(
        "mt5Balance"
    )
    .textContent =
    `$${mt5.balance}`;

    document
    .getElementById(
        "mt5Equity"
    )
    .textContent =
    `$${mt5.equity}`;

    document
    .getElementById(
        "mt5Profit"
    )
    .textContent =
    `$${mt5.profit}`;

}


// build Equity curve
function buildEquityCurve(trades){
    let equity = 0;

    const labels = [];

    const data = [];

    trades.forEach((trade,index)=>{
        equity += trade.profit;
        labels.push(
            `Trade ${index + 1}`
        );

        data.push(
            equity
        );

     });

    // equity curve chart
    const ctx = document.getElementById(
        "equityChart"
    );

    if(window.equityChart && 
        typeof window.equityChart.destroy === "function"){
        window.equityChart.destroy();
    }

    window.equityChart = new Chart(ctx,{

        type:"line",

       data:{

            labels,
            datasets:[{

            label:"Equity",

            data

            }]

        }

    });
}
window.onload = loadDashboard;

/*logout functionality*/
const logoutBtn =
document.getElementById("logoutBtn");

if(logoutBtn){

    logoutBtn.addEventListener(
        "click",
        ()=>{

            localStorage.removeItem(
                "token"
            );

            window.location.href =
            "../login.html";
        }
    );

}