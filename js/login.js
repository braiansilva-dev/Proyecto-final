const loginForm = document.getElementById("loginForm");

function showToast(msg, type = "error") {
  const toast = document.getElementById("toast");
  toast.className = `mostrar ${type}`;
  toast.querySelector("p").innerText = msg;
  setTimeout(() => {
    toast.classList.remove("mostrar");
  }, 3000);
}

// Mostrar toast si venimos de cerrar sesión
if (localStorage.getItem("logoutMessage") === "true") {
  setTimeout(() => {
    showToast("Sesión cerrada correctamente", "success");
  }, 1);
  localStorage.removeItem("logoutMessage");
}
document.querySelector("a.forgot").addEventListener("click", () => {
  showToast("Funcionalidad no implementada", "error");
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const usuarioValido = /[a-zA-Z0-9._-]{3,}/;

  const passwordValida = /[a-zA-Z0-9._-]{6,}/;

  const user = document.getElementById("usuario").value;
  const pass = document.getElementById("contrasena").value;

  if (usuarioValido.test(user) && passwordValida.test(pass)) {
    localStorage.setItem("loggedIn", "true");
    showToast("Sesión iniciada correctamente", "success");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
  } else {
    showToast("Usuario o contraseña incorrectos", "error");
  }
});
