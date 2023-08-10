document.querySelectorAll(".outline").forEach(function (element) {
	element.addEventListener("click", function (e) {
		e.preventDefault();
		let id = this.getAttribute("name");
		let form = document.querySelector("form");
		let nameInputs = document.querySelectorAll("input[name*='Name']");
		let mobileInputs = document.querySelectorAll("input[name*='mobile']");
		let formButton = document.querySelector(".formButton");
		let heading = document.getElementById("heading");

		if (id === "login") {
			form.style.left = "480px";
			form.style.right = null;
			nameInputs.forEach(function (input) {
				input.style.display = "none";
				input.style.height = "0";
			});
			mobileInputs.forEach(function (input) {
				input.style.display = "none";
				input.style.height = "0";
			});
			formButton.textContent = "Login";
			heading.textContent = "Login";
		} else if (id === "signup") {
			form.style.left = null;
			form.style.right = "480px";
			nameInputs.forEach(function (input) {
				input.style.display = "block";
				input.style.height = null;
			});
			mobileInputs.forEach(function (input) {
				input.style.display = "block";
				input.style.height = null;
			});
			formButton.textContent = "Sign Up";
			heading.textContent = "Sign Up";
		}
	});
});
