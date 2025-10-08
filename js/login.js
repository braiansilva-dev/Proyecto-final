import { showToast } from "./showToast.js";

const loginForm = document.getElementById("loginForm");

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

// Validaciones
const usuarioValido = /^(?:[a-zA-Z0-9._-]{3,}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
const passwordValida = /^[a-zA-Z0-9._-]{6,}$/;

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const input = document.getElementById("usuario").value.trim();
  const pass = document.getElementById("contrasena").value.trim();

  if (!usuarioValido.test(input) || !passwordValida.test(pass)) {
    showToast("Usuario o contraseña incorrectos", "error");
    return;
  }

  let usersData = JSON.parse(localStorage.getItem("usersData")) || {};
  let currentKey = null;

  // busca usuario existente
  if (usersData[input.toLowerCase()]) {
    currentKey = input.toLowerCase();
  } else {
    // vemos si el input coincide con el email de algún usuario
    for (let key in usersData) {
      if (usersData[key].email.toLowerCase() === input.toLowerCase()) {
        currentKey = key;
        break;
      }
    }
  }

  // si no existe creamos nuevo usuario
  if (!currentKey) {
    const key = input.toLowerCase();
    usersData[key] = {
      user: input.includes("@") ? "" : input,
      email: input.includes("@") ? input : "",
      phone: "",
      img: ""
    };
    currentKey = key;
  }

  // guardamos usuarios y la sesión actual
  localStorage.setItem("usersData", JSON.stringify(usersData));
  localStorage.setItem("currentUser", currentKey);
  localStorage.setItem("loggedIn", "true");

  showToast("Sesión iniciada correctamente", "success");

  setTimeout(() => {
    window.location.href = "index.html";
  }, 1500);
});
