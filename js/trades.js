const token =
localStorage.getItem(
    "token"
);

if(!token){

    window.location.href =
    "../login.html";

}

// Date formatting function
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

// Load trades and populate table
async function loadTrades(){

    const trades =
    await getTrades(
        token
    );

    const table =
    document.getElementById(
        "tradesTable"
    );

    table.innerHTML = "";

    trades.forEach(trade => {

        const row =
        document.createElement(
            "tr"
        );

        row.innerHTML = `

            <td>
                ${trade.symbol}
            </td>

            <td>
                ${trade.order_type}
            </td>

            <td>
                ${trade.lot_size}
            </td>

            <td>
                $${trade.profit}
            </td>

            <td>
                ${formatDate(
                    trade.created_at
                )}
            </td>

            <td>

                <button
                    class="delete-btn"
                    data-id="${trade.id}"
                >
                    Delete
                </button>

            </td>

        `;

        table.appendChild(
            row
        );

        const deleteBtn =
        row.querySelector(
            ".delete-btn"
        );

        deleteBtn.addEventListener(

            "click",

            async () => {

                const confirmed =
                confirm(
                    "Delete trade?"
                );

                if(!confirmed){
                    return;
                }

                await deleteTrade(
                    trade.id,
                    token
                );

                await loadTrades();

            }

        );

    });

}
loadTrades();

// Export trades to CSV
document.getElementById("exportBtn")
    .addEventListener("click", async () => {

        const trades = await getTrades(token);

        if(!trades || trades.length === 0){
            alert("No trades to export.");
            return;
        }

        const headers = [
            "Symbol",
            "Type",
            "Lot Size",
            "Open Price",
            "Close Price",
            "Profit",
            "Date"
        ];

        const rows = trades.map(trade => [
            trade.symbol,
            trade.order_type,
            trade.lot_size,
            trade.open_price,
            trade.close_price,
            trade.profit,
            formatDate(trade.created_at)
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement("a");

        a.href     = url;
        a.download = `voyager-trades-${new Date().toISOString().slice(0,10)}.csv`;
        a.click();

        URL.revokeObjectURL(url);
    });
