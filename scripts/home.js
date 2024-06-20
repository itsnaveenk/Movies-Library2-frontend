
const userUrl = config.USER_URL;
const moviesUrl = config.MOVIES_URL;
const token = localStorage.getItem("token");
const username = document.getElementById("username");
const logoutLink = document.getElementById("logout-link");
const listPopup = document.getElementById("list-popup");
const closeModal = document.getElementsByClassName("close")[0];
const userLists = document.getElementById("user-lists");
const successMessage = document.getElementById("success-message");
let selectedMovieId = null; // Variable to store the selected movie ID

if (!token) {
    window.location.href = "/login.html";
}

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
});

// Fetch user's lists when the page loads
fetch(userUrl + "/lists", {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    },
})
.then((response) => response.json())
.then((data) => {
    userLists.innerHTML = data.map(list => `
        <li data-list-id="${list.id}">${list.name}</li>
    `).join('');
})
.catch((error) => {
    console.error("Error:", error);
});

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");

searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const searchInputValue = searchInput.value;
    fetch(moviesUrl + "/search/" + searchInputValue, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then((data) => {
        if (Array.isArray(data.body.Search)) {
            searchResults.innerHTML = data.body.Search.map(movie => `
                <div class="movie-card">
                    <img src="${movie.Poster}" alt="${movie.Title}" />
                    <h3>${movie.Title}</h3>
                    <p>${movie.Year}</p>
                    <button class="add-to-list-button" data-movie-id="${movie.imdbID}">Add to List</button>
                </div>
            `).join('');
        } else {
            searchResults.innerHTML = "<p class='no-results'>No results found.</p>";
        }
    })
    .catch((error) => {
        console.error("Error:", error);
    });
});

// Event delegation for dynamically added buttons
searchResults.addEventListener("click", function (event) {
    if (event.target.classList.contains("add-to-list-button")) {
        selectedMovieId = event.target.getAttribute("data-movie-id");
        listPopup.style.display = "block";
    }
});

// Close the modal
closeModal.addEventListener("click", function () {
    listPopup.style.display = "none";
    successMessage.style.display = "none"; // Hide success message when closing the modal
});

// When the user clicks anywhere outside of the modal, close it
window.addEventListener("click", function (event) {
    if (event.target == listPopup) {
        listPopup.style.display = "none";
        successMessage.style.display = "none"; // Hide success message when clicking outside the modal
    }
});

// Add movie to selected list
userLists.addEventListener("click", function (event) {
    if (event.target.tagName === 'LI') {
        const listId = event.target.getAttribute("data-list-id");
        addMovieToList(listId, selectedMovieId);
    }
});

const addMovieToList = (listId, movieId) => {
    fetch(moviesUrl + "/addmovie", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            listId: listId,
            movieId: movieId
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        successMessage.innerText = "Movie successfully added to the list!";
        successMessage.style.display = "block"; // Show success message
        // Optionally, disable the add button or change its text
        const addButton = document.querySelector(`button[data-movie-id="${movieId}"]`);
        if (addButton) {
            addButton.innerText = "Added";
            addButton.disabled = true;
        }
    })
    .catch(error => console.error('Error:', error));
};
