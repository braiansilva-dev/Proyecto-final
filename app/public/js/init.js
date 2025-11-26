const CATEGORIES_URL = "/api/cats/cat";
const PUBLISH_PRODUCT_URL = "/api/sell/publish";
const PRODUCTS_URL = "/api/cats_products/";
const PRODUCT_INFO_URL = "/api/products/";
const PRODUCT_INFO_COMMENTS_URL = "/api/products_comments/";
const CART_INFO_URL = "/api/user_cart/";
const CART_BUY_URL = "/api/cart/buy";
const EXT_TYPE = "";

let showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
};

let hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
};

let getJSONData = function (url, requireAuth = false) {
  let result = {};
  showSpinner();

  const options = {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Incluir cookies automáticamente
  };

  return fetch(url, options)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = "ok";
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = "error";
      result.data = error;
      hideSpinner();
      return result;
    });
};

// funcion para que se actualice el badge del carrito
function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (!badge) return;

  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const total = cartItems.length;

  if (total > 0) {
    badge.textContent = total;
    badge.style.display = "inline-block";
  } else {
    badge.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", updateCartBadge);

function getLoggedUserName() {
  const usersData = JSON.parse(localStorage.getItem("usersData")) || {};
  const currentUser = localStorage.getItem("currentUser");
  const userDataFromToken = JSON.parse(localStorage.getItem("userData")) || {};

  let userName = "Usuario";

  // 1. Si está en usersData usando currentUser
  if (currentUser && usersData[currentUser]) {
    const data = usersData[currentUser];
    return data.user || data.email || userName;
  }

  // 2. Si viene del token
  if (userDataFromToken && userDataFromToken.user) {
    const tokenUser = userDataFromToken.user;

    // Buscar coincidencia en usersData
    for (let key in usersData) {
      if (
        usersData[key].user === tokenUser ||
        key === tokenUser.toLowerCase()
      ) {
        const data = usersData[key];
        return data.user || data.email || userName;
      }
    }

    return tokenUser; // Si no estaba en usersData, devolvemos el del token
  }

  // 3. Último intento: buscar clave o campo user igual a currentUser
  if (currentUser) {
    for (let key in usersData) {
      if (
        usersData[key].user === currentUser ||
        key === currentUser.toLowerCase()
      ) {
        const data = usersData[key];
        return data.user || data.email || userName;
      }
    }
  }

  return userName;
}

// Función para actualizar el nombre de usuario en todas las páginas
function updateUserName() {
  const nombreUsuarioEl = document.getElementById("nombreUsuario");
  if (!nombreUsuarioEl) return;

  nombreUsuarioEl.innerText = getLoggedUserName();
}

// Actualizar nombre de usuario cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", updateUserName);
