export function showToast(msg, type = "error") {
  const toast = document.getElementById("toast");
  toast.className = `mostrar ${type}`;
  toast.querySelector("p").innerText = msg;
  setTimeout(() => {
    toast.classList.remove("mostrar");
  }, 3000);
}