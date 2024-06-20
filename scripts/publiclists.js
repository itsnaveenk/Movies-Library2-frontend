const userUrl = config.USER_URL;
const moviesUrl= config.MOVIES_URL;
const token = localStorage.getItem("token");
const username = document.getElementById("username");
const logoutLink = document.getElementById("logout-link");
const publicLists = document.getElementById("public-lists");


logoutLink.addEventListener("click", function () {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.location.href = "/index.html";
});

fetch(userUrl + "/fetchusername", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    },
})
.then((response) => response.json())
.then((data) => {
    username.innerText = data.username;
})
.catch((error) => {
    console.error("Error:", error);
    username.innerText = "Guest";
});

// Fetch and display public lists
function fetchPublicLists() {
    fetch(moviesUrl + "/publiclists", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            data.forEach((list) => {
                const listItem = document.createElement("li");
                const listLink = document.createElement("a");
                listLink.href = `/list.html?id=${list.id}`;
                listLink.textContent = `${list.name}`;
                listItem.appendChild(listLink);
                publicLists.appendChild(listItem);
            });
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

fetchPublicLists();