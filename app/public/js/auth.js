// Cerrar sesión - llama al backend para eliminar la cookie
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("btn-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        // Llamar al endpoint de logout para eliminar la cookie
        await fetch("/api/logout", {
          method: "POST",
          credentials: 'include' // Importante: incluir cookies
        });
        
        // Limpiar datos del usuario del localStorage
        localStorage.removeItem("currentUser");
        localStorage.removeItem("userData");
        
        // Redirigir a login
        localStorage.setItem("logout", "true");
        window.location.href = "/login";
        
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
        // Aún así redirigir a login
        window.location.href = "/login";
      }
    });
  }
});
