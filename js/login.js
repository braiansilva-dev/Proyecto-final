const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const user = document.getElementById("usuario").value;
  const pass = document.getElementById("contrasena").value;

  if (user.trim() != "" && pass.trim() != "") {
    localStorage.setItem("loggedIn", "true");
    window.location.href = "index.html";
  } else {
    alert("Usuario y Contraseña inválidos");
  }
});
