const moviesUrl= config.MOVIES_URL;
const publicLists = document.getElementById("public-lists");


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
            console.log(data);
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