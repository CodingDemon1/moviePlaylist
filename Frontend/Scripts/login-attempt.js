const formBtn = document.getElementById("formButton");
const formData = document.getElementById("mainForm");
const baseUrl = "https://shy-gray-butterfly-sock.cyclic.app";
formBtn.addEventListener("click", (e) => {
	e.preventDefault();
	const formValue = {};
	if (formBtn.textContent === "Login") {
		formValue.email = formData[2].value;
		formValue.password = formData[3].value;

		fetch(`${baseUrl}/user/login`, {
			method: "POST",
			headers: {
				"content-type": "Application/JSON",
			},
			body: JSON.stringify(formValue),
		})
			.then((res) => res.json())
			.then((result) => {
				console.log(result);
				if (result.response) {
					sessionStorage.setItem("token", result.token);
					sessionStorage.setItem("name", result.name);
					sessionStorage.setItem("currUserId", result.uId);
					alert(result.msg);
					window.location.href = "./mainPage.html";
				} else {
					alert(result.msg);
				}
			})
			.catch((err) => console.log(err.message));
	} else {
		formValue.name = formData[0].value;
		formValue.mobile = formData[1].value;
		formValue.email = formData[2].value;
		formValue.password = formData[3].value;
		fetch(`${baseUrl}/user/register`, {
			method: "POST",
			headers: {
				"content-type": "Application/JSON",
			},
			body: JSON.stringify(formValue),
		})
			.then((res) => res.json())
			.then((result) => alert(result.msg))
			.catch((err) => console.log(err.message));
	}
});
