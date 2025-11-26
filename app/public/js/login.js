import { showToast } from "./showToast.js";

const loginForm = document.getElementById("loginForm");

// mostrar toast si viene de cerrar sesión
if (localStorage.getItem("logout")) {
  showToast("Sesión cerrada correctamente", "success");
  localStorage.removeItem("logout");
}

// Validaciones regex (mismo que el backend)
const usuarioValido =
  /^(?:[a-zA-Z0-9._-]{3,}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
const passwordValida = /^[a-zA-Z0-9._-]{6,}$/;

document.querySelector("a.forgot")?.addEventListener("click", () => {
  showToast("Funcionalidad no implementada", "error");
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const input = document.getElementById("usuario").value.trim();
  const pass = document.getElementById("contrasena").value.trim();

  // Validación regex en el frontend (validación también en backend)
  if (!usuarioValido.test(input) || !passwordValida.test(pass)) {
    showToast(
      "Usuario o contraseña no cumplen con el formato requerido",
      "error"
    );
    return;
  }

  try {
    // Llamar a la API del backend (el token se guarda automáticamente en cookie httpOnly)
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Importante: incluir cookies
      body: JSON.stringify({
        usuario: input,
        contrasena: pass,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      showToast(data.error || "Error al iniciar sesión", "error");
      return;
    }

    // Guardar solo datos del usuario en localStorage (sin token)
    const userName = input.includes("@") ? input.split("@")[0] : input;
    let usersData = JSON.parse(localStorage.getItem("usersData")) || {};
    const key = userName.toLowerCase();
    usersData[key] = {
      user: userName,
      email: input.includes("@") ? input : "",
      phone: "",
      img: "",
      id: data.user.id,
    };
    localStorage.setItem("usersData", JSON.stringify(usersData));
    localStorage.setItem("currentUser", userName);

    showToast("Sesión iniciada correctamente", "success");

    setTimeout(() => {
      window.location.href = "/index";
    }, 1500);
  } catch (error) {
    console.error("Error:", error);
    showToast("Error de conexión con el servidor", "error");
  }
});
