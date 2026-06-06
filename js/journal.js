const token =
localStorage.getItem(
    "token"
);

async function loadJournals(){

    const journals =
    await getJournals(token);

    const trades =
    await getTrades(token);

    const container =
    document.getElementById(
        "journalList"
    );

    container.innerHTML = "";

    journals.forEach(entry=>{

        console.log("Journal Trade ID:", entry.trade_id);

        console.log(
            "Available Trade IDs:",
            trades.map(t => t.id)
        );

        const trade =
        trades.find(
            t => t.id === entry.trade_id
        );

        const tradeText =
        trade
        ?
        `${entry.trade_id}: ${trade.symbol}
         (${trade.order_type})
         Profit:
         ${trade.profit}`
        :
        "Trade Not Found";

        const card =
        document.createElement(
            "div"
        );

        card.className =
        "metric-card";

        card.innerHTML = `

            <h3>
                ${entry.emotion}
            </h3>

            <p>
                <strong>Trade:</strong>
                ${tradeText}
            </p>

            <p>
                <strong>Lesson:</strong>
                ${entry.lesson}
            </p>

            <p>
                <strong>Mistake:</strong>
                ${entry.mistake}
            </p>

            <p>
                Rating:
                ${entry.rating}/10
            </p>

        `;

        container.appendChild(
            card
        );

    });

}

document
.getElementById(
    "journalForm"
)
.addEventListener(
    "submit",
    async(e)=>{

        e.preventDefault();

        await createJournal(
            token,
            {

                trade_id:
                document.getElementById(
                    "tradeId"
                ).value,

                emotion:
                document.getElementById(
                    "emotion"
                ).value,

                lesson:
                document.getElementById(
                    "lesson"
                ).value,

                mistake:
                document.getElementById(
                    "mistake"
                ).value,

                rating:
                document.getElementById(
                    "rating"
                ).value

            }
        );

        loadJournals();

        document
        .getElementById(
            "journalForm"
        )
        .reset();

    }
);



async function loadTradeOptions(){

    const trades =
    await getTrades(token);

    const select =
    document.getElementById(
        "tradeId"
    );

    trades.forEach(trade=>{

        const option =
        document.createElement(
            "option"
        );

        option.value =
        trade.id;

        option.textContent =

            `${trade.symbol}
             (${trade.order_type})
             Profit:
             ${trade.profit}`;

        select.appendChild(
            option
        );

    });

}

window.onload =
async()=>{

    await loadTradeOptions();

    await loadJournals();

};