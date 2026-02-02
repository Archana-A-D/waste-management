// Get collector context
const collectorWard = localStorage.getItem("collectorWard");
const collectorLoggedIn = localStorage.getItem("collectorLoggedIn");

// Safety check
if (!collectorLoggedIn || !collectorWard) {
    window.location.href = "collector-login.html";
}

// Show ward label
document.getElementById("wardLabel").innerText = collectorWard;

// Load on page open
loadRequests();

function loadRequests() {
    const table = document.getElementById("requestTable");
    table.innerHTML = "";

    // Read all user requests
    let requests = JSON.parse(localStorage.getItem("requests")) || [];

    // Filter by this collector's ward (FCFS preserved by insertion order)
    const wardRequests = requests.filter(r => r.ward === collectorWard);

    if (wardRequests.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="6">No pickup requests for ${collectorWard}</td>
            </tr>
        `;
        return;
    }

    wardRequests.forEach((req, index) => {
        let actionHTML = "";

        if (req.status === "Requested") {
            actionHTML = `
                <button class="action accept" onclick="acceptRequest(${req.id})">
                    Accept
                </button>`;
        } else if (req.status === "Accepted") {
            actionHTML = `
                <button class="action complete" onclick="completeRequest(${req.id})">
                    Complete
                </button>`;
        } else {
            actionHTML = "Completed";
        }

        table.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${req.address}</td>
                <td>${req.ward}</td>
                <td>${req.waste}</td>
                <td>${req.status}</td>
                <td>${actionHTML}</td>
            </tr>
        `;
    });
}

function acceptRequest(id) {
    let requests = JSON.parse(localStorage.getItem("requests")) || [];
    const req = requests.find(r => r.id === id);

    if (req && req.status === "Requested") {
        req.status = "Accepted";
        localStorage.setItem("requests", JSON.stringify(requests));
        loadRequests();
        alert("Request accepted");
    }
}

function completeRequest(id) {
    let requests = JSON.parse(localStorage.getItem("requests")) || [];
    const req = requests.find(r => r.id === id);

    if (req && req.status === "Accepted") {
        req.status = "Completed";
        localStorage.setItem("requests", JSON.stringify(requests));
        loadRequests();
        alert("Waste collection completed");
    }
}

function logout() {
    localStorage.removeItem("collectorLoggedIn");
    localStorage.removeItem("collectorWard");
    localStorage.removeItem("collectorId");
    window.location.href = "collector-login.html";
}
