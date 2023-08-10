const token = sessionStorage.getItem("token") || null;
const currUserName = sessionStorage.getItem("name") || null;
const currUserId = sessionStorage.getItem("currUserId") || null;

const createBtn = document.getElementById("createBtn");
const modalWrapper = document.querySelector("#modal__wrapper");
const closeBtn = document.querySelector("#closeBtn");
const renderPlaylist = document.getElementById("renderPlaylist");
const createPLForm = document.getElementById("createPLForm");
const renderMovies = document.getElementById("renderMovies");
const baseURL = "https://shy-gray-butterfly-sock.cyclic.app";
const listPL = document.getElementById("listPL");
const ShowOthersBtn = document.getElementById("ShowOthersBtn");
const ShowOwnBtn = document.getElementById("ShowOwnBtn");
if (token) {
	console.log(token);
	userName.textContent = `Welcome back ${currUserName}`;
	loginBtn.classList.add("hideBtn");
	logoutBtn.classList.remove("hideBtn");
} else {
	document.querySelector("body").classList.add("blurr");
	userName.textContent = null;
	loginBtn.classList.remove("hideBtn");
	logoutBtn.classList.add("hideBtn");

	setTimeout(() => {
		alert("You are not Logged In!!! Please login...");
		window.location.href = "./mainPage.html";
	}, 1000);
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

// Event Listeners

createBtn.addEventListener("click", () => {
	openModal();
});

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
	// console.log("open");
	modalWrapper.classList.add("active");
}
function closeModal() {
	// console.log("close");
	modalWrapper.classList.remove("active");
}

// Get User Playlists
function fetchPlaylist(uid) {
	fetch(`${baseURL}/playlist/getPL/${uid}`)
		.then((res) => res.json())
		.then((result) => {
			// console.log(result);
			displayPlaylist(result.data);
		})
		.catch((err) => console.log(err));
}

window.addEventListener("load", () => {
	fetchPlaylist(currUserId);
});

function displayPlaylist(data) {
	renderPlaylist.innerHTML = null;

	if (data.length) {
		renderPlaylist.style.display = "grid";
		data.forEach((element, index) => {
			const card = document.createElement("div");
			card.className = "plCard";

			const div = document.createElement("div");
			const title = document.createElement("h3");
			title.textContent =
				element.title.length > 10
					? element.title.substring(0, 10) + "..."
					: element.title;

			const p = document.createElement("p");
			if (element.isPrivate) {
				p.className = "privatePL";
				p.textContent = "Private";
			} else {
				p.className = "publicPL";
				p.textContent = "Public";
			}
			const num = document.createElement("p");
			num.textContent = element.movieList.length;
			num.className = "numOfMovie";
			div.append(title, p, num);

			div.addEventListener("click", () => {
				renderMovies.innerHTML = `<h2>Fetching data. Please wait...</h2>
    <img src="https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif" alt="">`;
				fetchMovieData(element._id);
			});

			const desc = document.createElement("p");
			desc.textContent = element.description;

			desc.addEventListener("click", () => {
				renderMovies.innerHTML = `<h2>Fetching data. Please wait...</h2>
    <img src="https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif" alt="">`;
				fetchMovieData(element._id);
			});

			const delBtn = document.createElement("button");
			delBtn.textContent = "Delete";
			delBtn.id = "closeBtn";

			delBtn.addEventListener("click", () => {
				console.log("CLicked");
				deletePlaylist(element._id);
			});

			card.append(div, desc, delBtn);

			renderPlaylist.append(card);
		});
	} else {
		renderPlaylist.style.display = "flex";
		renderPlaylist.innerHTML = `<h2 style="color:grey">Currently, You do not have a playlist Please Add One..</h2>`;
	}
}

// Create PlayList

createPLForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const newPl = {
		title: createPLForm[0].value,
		description: createPLForm[1].value,
		isPrivate: createPLForm[2].value,
		userID: currUserId,
		userName: currUserName,
	};

	fetch(`${baseURL}/playlist/add`, {
		method: "POST",
		headers: {
			"content-type": "Application/JSON",
			Auth: token,
		},
		body: JSON.stringify(newPl),
	})
		.then((res) => res.json())
		.then((result) => {
			alert(result.msg);
			closeModal();
			fetchPlaylist(currUserId);
		})
		.catch((err) => console.log(err));
});

function fetchMovieData(pId) {
	fetch(`${baseURL}/playlist/getCurrPLMovies/${pId}`)
		.then((res) => res.json())
		.then((result) => {
			// console.log(result);
			if (!result.data.length) {
				renderMovies.style.display = "flex";
				renderMovies.innerHTML = `<h2 style="color:grey">Playlist is Empty!!! Please add movie...</h2>`;
			} else {
				renderMovies.style.display = "grid";
				renderMovies.innerHTML = displayMoviesData(result.data);
				// Accessing Delete movie Buttons
				const movieDelBtn = document.querySelectorAll(".deleteMovieBtn");

				console.log(movieDelBtn);
				movieDelBtn.forEach((ele) => {
					ele.addEventListener("click", () => {
						deleteMovieFromPlaylist(ele.getAttribute("data-id"), pId);
					});
				});
			}
		});
}

function displayMoviesData(data) {
	return data
		.map(
			(ele, ind) => `
    <div class="movieCard">
      <img src="${ele.Poster}" />
      <div class="nameAndYear">
        <b>${ele.Title}</b>
        <span>(${ele.Year})</span>
      </div>
      <h4>Type: ${ele.Type}</h4>
      <button class="deleteMovieBtn" data-id="${ele._id}">Delete</button>
    </div>
  `
		)
		.join("");
}

// Delete Playlist
function deletePlaylist(id) {
	fetch(`${baseURL}/playlist/deletePL/${id}`, {
		method: "DELETE",
	})
		.then((res) => res.json())
		.then((result) => {
			alert(result.msg);
			if (result.flag) {
				fetchPlaylist(currUserId);
			}
		});
}

function deleteMovieFromPlaylist(mId, pId) {
	fetch(`${baseURL}/playlist/${pId}/delete/${mId}`, {
		method: "DELETE",
		headers: {
			"content-type": "Application/JSON",
			Auth: token,
		},
	})
		.then((res) => res.json())
		.then((result) => {
			alert(result.msg);
			fetchPlaylist(currUserId);
			fetchMovieData(pId);
		})
		.catch((err) => console.log(err));
}

ShowOthersBtn.addEventListener("click", () => {
	renderPlaylist.innerHTML = null;
	renderMovies.innerHTML = null;
	fetchOtherslaylist(currUserId);
});

ShowOwnBtn.addEventListener("click", () => {
	renderPlaylist.innerHTML = null;
	renderMovies.innerHTML = null;
	fetchPlaylist(currUserId);
});

function fetchOtherslaylist(uid) {
	fetch(`${baseURL}/playlist/getOthersPL/${uid}`)
		.then((res) => res.json())
		.then((result) => {
			// console.log(result);
			displayOthersPlaylist(result.data);
		})
		.catch((err) => console.log(err));
}

// Display Others Playlist
function displayOthersPlaylist(data) {
	renderPlaylist.innerHTML = null;

	data.forEach((element, index) => {
		const card = document.createElement("div");
		card.className = "plCard";

		const userId = document.createElement("p");
		userId.className = "othersUserId";
		userId.textContent = `UserId : ${element.userID}`;

		const div = document.createElement("div");
		const title = document.createElement("h3");
		title.textContent =
			element.title.length > 10
				? element.title.substring(0, 10) + "..."
				: element.title;

		const p = document.createElement("p");
		if (element.isPrivate) {
			p.className = "privatePL";
			p.textContent = "Private";
		} else {
			p.className = "publicPL";
			p.textContent = "Public";
		}
		const num = document.createElement("p");
		num.textContent = element.movieList.length;
		num.className = "numOfMovie";
		div.append(title, p, num);

		div.addEventListener("click", () => {
			renderMovies.innerHTML = `<h2>Fetching data. Please wait...</h2>
    <img src="https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif" alt="">`;
			fetchOthersMovieData(element._id);
		});

		const desc = document.createElement("p");
		desc.textContent = element.description;

		desc.addEventListener("click", () => {
			renderMovies.innerHTML = `<h2>Fetching data. Please wait...</h2>
    <img src="https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif" alt="">`;
			fetchOthersMovieData(element._id);
		});

		card.append(userId, div, desc);

		renderPlaylist.append(card);
	});
}

// Display others Playlist Movies
function displayOthersMoviesData(data) {
	return data
		.map(
			(ele, ind) => `
    <div class="movieCard">
      <img src="${ele.Poster}" />
      <div class="nameAndYear">
        <b>${ele.Title}</b>
        <span>(${ele.Year})</span>
      </div>
      <h4>Type: ${ele.Type}</h4>
    </div>
  `
		)
		.join("");
}

function fetchOthersMovieData(pId) {
	fetch(`${baseURL}/playlist/getCurrPLMovies/${pId}`)
		.then((res) => res.json())
		.then((result) => {
			// console.log(result);
			if (!result.data.length) {
				renderMovies.style.display = "flex";

				renderMovies.innerHTML = `<h2 style="color:grey">This Playlist is Empty!!! Check Other One...</h2>`;
			} else {
				renderMovies.style.display = "grid";
				renderMovies.innerHTML = displayOthersMoviesData(result.data);
			}
		});
}
