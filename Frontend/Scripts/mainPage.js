const API_Movie_Url = "http://www.omdbapi.com/?i=tt3896198&apikey=851bdde1&s=";
const baseURL = "https://shy-gray-butterfly-sock.cyclic.app";

const mainContainer = document.getElementById("mainContainer");
const paginationSection = document.getElementById("pagination");
const allPaginateBtns = document.querySelectorAll(".pagination li");
const preFetch = document.getElementById("preFetch");
const searchForm = document.getElementById("searchMovie");
const logoutBtn = document.getElementById("logoutBtn");
const loginBtn = document.getElementById("loginBtn");
const userName = document.getElementById("userName");
const modalWrapper = document.querySelector("#modal__wrapper");
const addMovieName = document.querySelector("#addMovieName");

let selectedBtnNum = null;

const token = sessionStorage.getItem("token") || null;
const name = sessionStorage.getItem("name") || null;
const currUserId = sessionStorage.getItem("currUserId") || null;

if (token) {
	console.log(token);
	userName.textContent = `Welcome back ${name}`;
	loginBtn.classList.add("hideBtn");
	logoutBtn.classList.remove("hideBtn");
} else {
	userName.textContent = null;
	loginBtn.classList.remove("hideBtn");
	logoutBtn.classList.add("hideBtn");
}

window.addEventListener("load", () => {
	fetchMovie("Rampage", 1);
});

searchForm.addEventListener("submit", (e) => {
	e.preventDefault();

	preFetch.innerHTML = `<h2>Fetching data. Please wait...</h2>
    <img src="https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif" alt="">`;
	selectedBtnNum = 1;
	fetchMovie(searchForm[0].value, selectedBtnNum);
});

function fetchMovie(movie, page) {
	fetch(`${API_Movie_Url}${movie}&page=${page}`)
		.then((res) => res.json())
		.then((result) => {
			console.log(result);
			displayMovies(result);
			paginate(result.totalResults, page);
		});
}

function displayMovies(data) {
	mainContainer.innerHTML = null;
	if (data.Response == "False") {
		preFetch.innerHTML = `<h1 style="color: red;">Movie Not Found!!!</h1>`;
		return;
	}

	preFetch.innerHTML = `<h1 style="color: grey;">Your Search Result...</h1>`;
	data.Search.forEach((ele, ind) => {
		const card = document.createElement("div");
		card.className = "card";

		const poster = document.createElement("img");
		poster.src = ele.Poster;

		const nameAndYear = document.createElement("div");
		nameAndYear.className = "nameAndYear";

		const title = document.createElement("b");
		title.textContent = ele.Title;

		const yom = document.createElement("span");
		yom.innerText = `(${ele.Year})`;

		nameAndYear.append(title, yom);

		const resType = document.createElement("h4");
		resType.textContent = `Type: ${ele.Type} `;

		const btn = document.createElement("button");
		btn.className = "addToPlaylistBtn";
		btn.textContent = "Add to Playlist";

		btn.addEventListener("click", () => {
			if (token) {
				fetchPlList(currUserId, ele);
			} else {
				alert(
					"You are not logged in. Please Login to find all functionality..."
				);
			}
		});

		card.append(poster, nameAndYear, resType, btn);

		mainContainer.append(card);
	});
}

function paginate(length, pagenum) {
	paginationSection.innerHTML = null;

	const numOfPage = Math.ceil(length / 10);

	for (let i = 0; i < numOfPage; i++) {
		const btnList = document.createElement("li");

		if (i == selectedBtnNum - 1) {
			btnList.classList.remove("active");
		}

		if (i == pagenum - 1) {
			btnList.classList.add("active");
			selectedBtnNum = pagenum;
		}

		const btn = document.createElement("button");
		btnList.addEventListener("click", () => {
			fetchMovie(searchForm[0].value || "Rampage", i + 1);

			btnList.classList.add("active");
		});

		btnList.append(btn);
		paginationSection.append(btnList);
	}
}

// Logout Button Listener

logoutBtn.addEventListener("click", () => {
	sessionStorage.removeItem("token");

	alert("logout Sucessful");

	window.location.href = "../index.html";
});

loginBtn.addEventListener("click", () => {
	window.location.href = "./login.html";
});

// <-----------Modal----------->
closeBtn.addEventListener("click", function () {
	closeModal();
});

modalWrapper.addEventListener("click", function (e) {
	if (e.target !== this) return;
	closeModal();
});

document.addEventListener("keydown", function (e) {
	if (e.key === "Escape") {
		closeModal();
	}
});

function openModal() {
	modalWrapper.classList.add("active");
}
function closeModal() {
	modalWrapper.classList.remove("active");
}

// Add movie to playlist
function fetchPlList(uid, movie) {
	fetch(`${baseURL}/playlist/names/${uid}`)
		.then((res) => res.json())
		.then((result) => {
			renderAllPlaylist(result.data, movie);
			openModal();
		});
}

function renderAllPlaylist(data, movie) {
	listPL.innerHTML = null;
	const newMovie = {
		Title: movie.Title,
		Poster: movie.Poster,
		Year: movie.Year,
		Type: movie.Type,
	};

	addMovieName.innerText = `Add ${movie.Title} to: `;

	data.forEach((ele, ind) => {
		const newP = document.createElement("p");
		newP.textContent = ele.title;
		newP.className = "movieNames";
		newP.addEventListener("click", () => {
			addMovieToPlaylist(newMovie, ele._id, ele.title);
		});
		listPL.append(newP);
	});
}

// Add movie to a playlist
// /addMovie/:pid
function addMovieToPlaylist(movie, pid, plName) {
	fetch(`${baseURL}/playlist/addMovie/${pid}`, {
		method: "POST",
		headers: {
			"content-type": "Application/JSON",
			Auth: token,
		},
		body: JSON.stringify(movie),
	})
		.then((res) => res.json())
		.then((result) => {
			if (result.flag) {
				alert(`${movie.Title} is added to the Playlist ${plName}`);
			} else {
				alert(result.msg);
			}
			closeModal();
		})
		.catch((err) => console.log(err));
}
