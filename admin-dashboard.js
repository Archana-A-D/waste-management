const wards = ["Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5"];

loadDashboard();

function loadDashboard() {
    const requests = JSON.parse(localStorage.getItem("requests")) || [];

    // Overall stats
    document.getElementById("overallTotal").innerText = requests.length;

    const completed = requests.filter(r => r.status === "Completed").length;
    document.getElementById("overallCompleted").innerText = completed;
    document.getElementById("overallPending").innerText =
        requests.length - completed;

    // Ward cards
    const grid = document.getElementById("wardGrid");
    grid.innerHTML = "";

    wards.forEach(ward => {
        const wardRequests = requests.filter(r => r.ward === ward);
        const completedCount =
            wardRequests.filter(r => r.status === "Completed").length;
        const pendingCount =
            wardRequests.length - completedCount;

        grid.innerHTML += `
            <div class="ward-card" onclick="openWard('${ward}')">
                <h4>${ward}</h4>
                <div class="ward-stats">
                    <p>Total: ${wardRequests.length}</p>
                    <p>Completed: ${completedCount}</p>
                    <p>Pending: ${pendingCount}</p>
                </div>
            </div>
        `;
    });
}

function openWard(ward) {
    document.getElementById("wardSection").style.display = "none";
    document.getElementById("wardDetails").style.display = "block";
    document.getElementById("wardTitle").innerText = ward + " - Requests";

    const table = document.getElementById("wardTable");
    table.innerHTML = "";

    const requests = JSON.parse(localStorage.getItem("requests")) || [];
    const wardRequests = requests.filter(r => r.ward === ward);

    if (wardRequests.length === 0) {
        table.innerHTML = `
            <tr><td colspan="5">No requests in this ward</td></tr>
        `;
        return;
    }

    wardRequests.forEach((req, index) => {
        table.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${req.userEmail}</td>
                <td>${req.address}</td>
                <td>${req.waste}</td>
                <td>${req.status}</td>
            </tr>
        `;
    });
}

function backToWards() {
    document.getElementById("wardDetails").style.display = "none";
    document.getElementById("wardSection").style.display = "block";
}

function logout() {
    localStorage.removeItem("adminLoggedIn");
    window.location.href = "admin-login.html";
}
