// Redirigir al login si no está logueado
if (
  !localStorage.getItem("loggedIn") &&
  !window.location.href.includes("login.html")
) {
  window.location.href = "login.html";
}

// Cerrar sesión
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("btn-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("loggedIn");
      localStorage.setItem("logoutMessage", "true");
      localStorage.removeItem("currentUser");
      window.location.href = "login.html";
    });
  }
});
