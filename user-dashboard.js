window.onload = loadUserRequestStatus;

function submitRequest(event) {
    event.preventDefault();

    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const ward = document.getElementById("ward").value;
    const email = localStorage.getItem("userEmail");

    const wastes = [];
    document.querySelectorAll('.waste-types input:checked').forEach(w =>
        wastes.push(w.value)
    );

    if (wastes.length === 0) {
        alert("Select at least one waste type");
        return;
    }

    const request = {
        id: Date.now(),
        userEmail: email,
        phone,
        address,
        ward: "Ward " + ward,
        waste: wastes.join(", "),
        status: "Requested"
    };

    let requests = JSON.parse(localStorage.getItem("requests")) || [];
    requests.push(request);
    localStorage.setItem("requests", JSON.stringify(requests));

    updateStatusUI("Requested");
    alert("Pickup request submitted!");
}

function loadUserRequestStatus() {
    const email = localStorage.getItem("userEmail");
    let requests = JSON.parse(localStorage.getItem("requests")) || [];

    const userRequests = requests.filter(r => r.userEmail === email);
    if (userRequests.length === 0) return;

    const latest = userRequests[userRequests.length - 1];
    updateStatusUI(latest.status);
}

function updateStatusUI(status) {
    ["requested", "accepted", "completed"].forEach(id =>
        document.getElementById(id).classList.remove("active")
    );

    if (status === "Requested") {
        document.getElementById("requested").classList.add("active");
        statusText.innerText = "Waiting for collector acceptance.";
    }
    if (status === "Accepted") {
        document.getElementById("requested").classList.add("active");
        document.getElementById("accepted").classList.add("active");
        statusText.innerText = "Collector accepted your request.";
    }
    if (status === "Completed") {
        document.getElementById("requested").classList.add("active");
        document.getElementById("accepted").classList.add("active");
        document.getElementById("completed").classList.add("active");
        statusText.innerText = "Waste collected successfully.";
    }
}

function logout() {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userEmail");
    window.location.href = "login.html";
}
