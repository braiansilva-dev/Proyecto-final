const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const user = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;

  if (user != "" && pass != "") {
    localStorage.setItem("loggedIn", "true");
    window.location.href = "index.html";
  } else {
    alert("Usuario y Contraseña inválidos");
  }
});
