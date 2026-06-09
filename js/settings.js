const token = localStorage.getItem("token");

if(!token){
    window.location.href = "../login.html";
}

function loadProfile(){
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const email = payload.email || "—";
        document.getElementById("profileEmail").textContent = email;
        document.getElementById("avatarInitial").textContent = email[0].toUpperCase();
    } catch(e) {
        console.error("Could not decode token", e);
    }
}

document.getElementById("changePasswordForm")
    .addEventListener("submit", async (e) => {
        e.preventDefault();

        const newPassword     = document.getElementById("newPassword").value;
        const confirmPassword = document.getElementById("confirmNewPassword").value;
        const msg             = document.getElementById("passwordMsg");

        if(newPassword !== confirmPassword){
            msg.style.color = "var(--danger)";
            msg.textContent = "Passwords do not match.";
            return;
        }

        if(newPassword.length < 6){
            msg.style.color = "var(--danger)";
            msg.textContent = "Password must be at least 6 characters.";
            return;
        }

        try {
            const res = await fetch(`${API_URL}/auth/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ new_password: newPassword })
            });

            const data = await res.json();

            if(res.ok){
                msg.style.color = "var(--success)";
                msg.textContent = "Password updated successfully.";
                document.getElementById("changePasswordForm").reset();
            } else {
                msg.style.color = "var(--danger)";
                msg.textContent = data.detail || "Failed to update password.";
            }
        } catch(err) {
            msg.style.color = "var(--danger)";
            msg.textContent = "Something went wrong. Try again.";
        }
    });

document.getElementById("clearDataBtn")
    .addEventListener("click", async () => {
        const confirmed = confirm(
            "This will permanently delete ALL your trades and journal entries. Are you sure?"
        );

        if(!confirmed) return;

        const msg = document.getElementById("clearMsg");

        try {
            const res = await fetch(`${API_URL}/data/clear`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            const data = await res.json();

            if(res.ok){
                msg.style.color = "var(--success)";
                msg.textContent = "All trade data cleared.";
            } else {
                msg.style.color = "var(--danger)";
                msg.textContent = data.detail || "Failed to clear data.";
            }
        } catch(err) {
            msg.style.color = "var(--danger)";
            msg.textContent = "Something went wrong. Try again.";
        }
    });

loadProfile();


// Check if sync agent is running
async function checkAgentStatus(){
    const running = await checkAgent();
    const dot    = document.getElementById("agentDot");
    const status = document.getElementById("agentStatus");

    if(running){
        dot.style.background    = "var(--success)";
        status.textContent      = "Sync Agent is running — ready to sync";
        status.style.color      = "var(--success)";
    } else {
        dot.style.background    = "var(--danger)";
        status.textContent      = "Sync Agent not running — follow Step 1 below";
        status.style.color      = "var(--muted)";
    }
}

// Sync Now button
document.getElementById("syncNowBtn")
    .addEventListener("click", async () => {
        const msg = document.getElementById("syncMsg");
        const btn = document.getElementById("syncNowBtn");

        const running = await checkAgent();

        if(!running){
            msg.style.color = "var(--danger)";
            msg.textContent = "Sync Agent is not running. Please follow Step 1 first.";
            return;
        }

        btn.textContent  = "Syncing...";
        btn.disabled     = true;
        msg.textContent  = "";

        try {
            const result = await syncFromAgent(token);

            if(result.status === "error"){
                msg.style.color = "var(--danger)";
                msg.textContent = result.message;
            } else {
                msg.style.color = "var(--success)";
                msg.textContent = result.imported > 0
                    ? `${result.imported} new trades imported successfully!`
                    : "Everything is up to date — no new trades found.";
            }
        } catch(e) {
            msg.style.color = "var(--danger)";
            msg.textContent = "Could not connect to Sync Agent. Make sure it is running.";
        }

        btn.innerHTML = '<i class="fas fa-rotate" style="margin-right: 8px;"></i>Sync Now';
        btn.disabled  = false;
    });

// Check agent status on page load and every 5 seconds
checkAgentStatus();
setInterval(checkAgentStatus, 5000);
