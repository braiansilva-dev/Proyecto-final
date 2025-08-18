document.getElementById("btn-logout").addEventListener("click", () => {
  localStorage.removeItem("loggedIn");
  localStorage.setItem("logoutMessage", "true");
  window.location.href = "login.html";
});
