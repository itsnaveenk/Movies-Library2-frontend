const username = document.getElementById("username");
const logoutLink = document.getElementById("logout-link");
const listNameElement = document.getElementById("list-name");
const listTypeElement = document.getElementById("list-type");
const listIdElement = document.getElementById("list-id");
const movieList = document.getElementById("movie-list");

const urlParams = new URLSearchParams(window.location.search);
const listId = urlParams.get('id');

if (!listId) {
    console.error("List ID not found in URL");
}

const userUrl = config.USER_URL;
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "/login.html";
}

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

logoutLink.addEventListener("click", function () {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.location.href = "/index.html";
});

const moviesUrl = config.MOVIES_URL;

function deleteMovie(movieId, listItem) {
    fetch(`${moviesUrl}/deletemovie/${listId}/${movieId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete movie from list.');
        }
        alert('Movie deleted successfully.');
        listItem.remove();
    })
    .catch(error => {
        console.error('Error deleting movie from list:', error);
        alert('Failed to delete movie from list. Please try again.');
    });
}

fetch(`${moviesUrl}/list/${listId}`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    },
})
.then((response) => response.json())
.then((data) => {
    listNameElement.innerText = data.name;
    listTypeElement.innerText = data.isPublic ? 'Public' : 'Private';
    listIdElement.innerText = data.id;

    movieList.innerHTML = '';

    data.movies.forEach((movieId) => {
        fetch(`${moviesUrl}/searchById/${movieId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => response.json())
        .then((movieData) => {
            const listItem = document.createElement("li");
            listItem.setAttribute('data-movie-id', movieId);
            listItem.innerHTML = `
                <div class="movie-details">
                    <img src="${movieData.body.Poster}" alt="${movieData.body.Title}" />
                    <div class="movie-info">
                        <h3>${movieData.body.Title} (${movieData.body.Year})</h3>
                        <p><strong>IMDB Rating:</strong> ${movieData.body.imdbRating}</p>
                        <p><strong>Director:</strong> ${movieData.body.Director}</p>
                        <p><strong>Genre:</strong> ${movieData.body.Genre}</p>
                        <p><strong>Plot:</strong> ${movieData.body.Plot}</p>
                        <button class="delete-movie-btn">Delete Movie</button>
                    </div>
                </div>
            `;
            movieList.appendChild(listItem);

            listItem.querySelector('.delete-movie-btn').addEventListener('click', () => {
                deleteMovie(movieId, listItem);
            });
        })
        .catch((error) => {
            console.error("Error fetching movie details:", error);
        });
    });
})
.catch((error) => {
    console.error("Error fetching list details:", error);
});



const deleteListBtn = document.getElementById('delete-list-button');
deleteListBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to delete this list?')) {
        fetch(`${moviesUrl}/deletelist/${listId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete list.');
            }
            alert('List deleted successfully.');
            window.location.href = '/mylists.html'; // Redirect or handle as needed
        })
        .catch(error => {
            console.error('Error deleting list:', error);
            alert('Failed to delete list. Please try again.');
        });
    }
});