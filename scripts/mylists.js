const userUrl = config.USER_URL;
const moviesUrl = config.MOVIES_URL;
const token = localStorage.getItem("token");
const username = document.getElementById("username");
const logoutLink = document.getElementById("logout-link");
const createListButton = document.getElementById("create-list-button");
const createListForm = document.getElementById("create-list-form");
const listNameInput = document.getElementById("list-name");
const listTypeSelect = document.getElementById("list-type");
const privateLists = document.getElementById("private-lists");

if (!token) {
    window.location.href = "./login.html";
}
// logout
logoutLink.addEventListener("click", function () {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.location.href = "./index.html";
});
// fetch username
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
    });

createListButton.addEventListener("click", function () {
    createListForm.style.display = 'block';
});
// create lists
createListForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const listName = listNameInput.value;
    const listType = listTypeSelect.value;

    fetch(moviesUrl + "/createlist", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            name: listName,
            type: listType,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            window.location.reload();            
        })
        .catch((error) => {
            console.error("Error:", error);
        });
});

// Fetch existing private lists
function fetchPrivateLists() {
    fetch(moviesUrl + "/mylists", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            data.forEach((list) => {
                const listItem = document.createElement("li");
                const listLink = document.createElement("a");
                listLink.href = `/list.html?id=${list.id}`;
                listLink.textContent = `${list.name} (${list.isPublic ? 'Public' : 'Private'})`;
                listItem.appendChild(listLink);
                privateLists.appendChild(listItem);
            });
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

fetchPrivateLists();