import { showToast } from "./showToast.js";

const imageInput = document.getElementById("imageInput");
const profileImage = document.getElementById("profileImage");
const profileForm = document.getElementById("profileForm");

// Validación de email
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Cargar todos los usuarios y el usuario logueado
let usersData = JSON.parse(localStorage.getItem("usersData")) || {};
let currentUser = localStorage.getItem("currentUser");
let userDataFromToken = JSON.parse(localStorage.getItem("userData")) || {};

// Obtener datos del usuario - primero de usersData, luego de userData (token), o crear uno nuevo
let userData = null;

// Intentar obtener de usersData usando currentUser
if (currentUser && usersData[currentUser]) {
  userData = usersData[currentUser];
} else if (userDataFromToken && userDataFromToken.user) {
  // Si no existe en usersData, usar los datos del token para crear la entrada
  const key = userDataFromToken.user.toLowerCase();
  if (!usersData[key]) {
    usersData[key] = {
      user: userDataFromToken.user,
      email: userDataFromToken.email || "",
      phone: "",
      img: "",
      apellido: "",
      id: userDataFromToken.id
    };
    localStorage.setItem("usersData", JSON.stringify(usersData));
  }
  currentUser = key;
  localStorage.setItem("currentUser", currentUser);
  userData = usersData[key];
} else if (currentUser) {
  // Si hay currentUser pero no hay datos, buscar por cualquier clave que coincida
  for (let key in usersData) {
    if (usersData[key].user === currentUser || key === currentUser.toLowerCase()) {
      userData = usersData[key];
      break;
    }
  }
}

// Si aún no hay userData, crear uno por defecto
if (!userData) {
  const defaultUser = userDataFromToken.user || currentUser || "Usuario";
  const key = defaultUser.toLowerCase();
  userData = {
    user: defaultUser,
    email: userDataFromToken.email || "",
    phone: "",
    img: "",
    apellido: ""
  };
  usersData[key] = userData;
  localStorage.setItem("usersData", JSON.stringify(usersData));
  currentUser = key;
  localStorage.setItem("currentUser", currentUser);
}

// Función para mostrar los datos en el formulario
function populateForm() {
  if (userData) {
    const nombreInput = document.getElementById("nombre");
    const apellidoInput = document.getElementById("apellido");
    const emailInput = document.getElementById("email");
    const telefonoInput = document.getElementById("telefono");
    
    if (nombreInput) nombreInput.value = userData.user || "";
    if (apellidoInput) apellidoInput.value = userData.apellido || "";
    if (emailInput) emailInput.value = userData.email || "";
    if (telefonoInput) telefonoInput.value = userData.phone || "";
    if (userData.img && profileImage) profileImage.src = userData.img;
  }
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', populateForm);
} else {
  populateForm();
}

let newImageData = null;

// Función para inicializar event listeners
function initializeEventListeners() {
  if (!imageInput || !profileImage || !profileForm) {
    console.error("Elementos del formulario no encontrados");
    return;
  }

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
  if (emailInputField) {
    emailInputField.addEventListener("input", () => {
      if (!emailRegex.test(emailInputField.value.trim())) {
        emailInputField.classList.add("is-invalid");
      } else {
        emailInputField.classList.remove("is-invalid");
      }
    });
  }

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
    if (userData) {
      userData.user = document.getElementById("nombre").value;
      userData.apellido = document.getElementById("apellido").value;
      userData.email = emailInput;
      userData.phone = document.getElementById("telefono").value;

      if (newImageData) userData.img = newImageData;

      usersData[currentUser] = userData;
      localStorage.setItem("usersData", JSON.stringify(usersData));

      showToast("Datos guardados correctamente", "success");
    }
  });
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    populateForm();
    initializeEventListeners();
  });
} else {
  populateForm();
  initializeEventListeners();
}
