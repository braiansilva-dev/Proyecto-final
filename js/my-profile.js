import { showToast } from "./showToast.js";

const imageInput = document.getElementById("imageInput");
const profileImage = document.getElementById("profileImage");
const profileForm = document.getElementById("profileForm");

// Validación de email
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Cargar todos los usuarios y el usuario logueado
let usersData = JSON.parse(localStorage.getItem("usersData")) || {};
let currentUser = localStorage.getItem("currentUser");

let userData = usersData[currentUser];

// mostrar los datos en el formulario
document.getElementById("nombre").value = userData.user || "";
document.getElementById("apellido").value = userData.apellido || "";
document.getElementById("email").value = userData.email || "";
document.getElementById("telefono").value = userData.phone || "";
if (userData.img) profileImage.src = userData.img;

let newImageData = null;

imageInput.addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  // validación tamaño máximo en MB
  const maxSizeMB = 2;
  if (file.size / 1024 / 1024 > maxSizeMB) {
    showToast(`La imagen es demasiado grande. Máximo permitido: ${maxSizeMB} MB`, "error");
    this.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      profileImage.src = e.target.result;
      newImageData = e.target.result;
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

// validar email en tiempo real
const emailInputField = document.getElementById("email");
emailInputField.addEventListener("input", () => {
  if (!emailRegex.test(emailInputField.value.trim())) {
    emailInputField.classList.add("is-invalid");
  } else {
    emailInputField.classList.remove("is-invalid");
  }
});

// guardar cambios en el formulario
profileForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const emailInput = document.getElementById("email").value.trim();

  // validar email
  if (!emailRegex.test(emailInput)) {
    showToast("Email inválido", "error");
    return;
  }

  // actualizar datos del usuario actual
  userData.user = document.getElementById("nombre").value;
  userData.apellido = document.getElementById("apellido").value;
  userData.email = emailInput;
  userData.phone = document.getElementById("telefono").value;

  if (newImageData) userData.img = newImageData;

  usersData[currentUser] = userData;
  localStorage.setItem("usersData", JSON.stringify(usersData));

  showToast("Datos guardados correctamente", "success");
});
