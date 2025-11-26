import { showToast } from "./showToast.js";

const producto = JSON.parse(localStorage.getItem("productoSeleccionado"));
const detalle = document.getElementById("detalle");
const category = producto?.category || "Categoría desconocida";
const Comentarios = `${PRODUCT_INFO_COMMENTS_URL}${producto.id}`;

// Obtener la lista de productos desde localStorage (guardada por products.js)
const productos = JSON.parse(localStorage.getItem("productos")) || [];
const starInputs = document.querySelectorAll("input[name='star']");

document.addEventListener("DOMContentLoaded", function () {
  let commentsSection; // lo declaramos acá
  if (producto) {
    detalle.insertAdjacentHTML(
      "afterbegin",
      ` 
            <!-- Imagenes y botón favorito -->
            <div id="elementos-product-info">
                <div class="product-img">

               <!-- Carousel de imagenes -->
                  <div id="carousel-${producto.id}" class="carousel slide">
                    <div class="carousel-inner rounded"> 
                      ${
                        producto.images
                          ?.map(
                            (img, i) => `
                        <div class="carousel-item ${i === 0 ? "active" : ""}">
                          <img src="${img}" class="d-block w-100" alt="...">
                        </div>
                      `
                          )
                          .join("") ||
                        `
                        <div class="carousel-item active">
                          <img src="${producto.image}" class="d-block w-100" alt="...">
                        </div>
                      `
                      }
                    </div>
                    
                    <!-- Botones del carousel prev/next -->
                    <button class="carousel-control-prev " type="button" data-bs-target="#carousel-${
                      producto.id
                    }" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Anterior</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carousel-${
                      producto.id
                    }" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Siguiente</span>
                    </button>


                  <!-- Botón favorito -->
                  <input type="checkbox" style="display: none;" id="fav">
                  <label for="fav" class="fav-btn" style="z-index: 9999">
                    <i class="fa-solid fa-heart"></i>
                  </label>
                </div>
            </div>
            <!-- Info del producto -->
                <div class="product-info">
                  <h2 id="producto-nombre">${producto.name}</h2>
                  <span id="producto-tag" class="tag">${category}</span>
                  <p id="producto-precio" class="price">${producto.currency} ${
        producto.cost
      }</p>
                  <p id="producto-vendidos" class="sold">${
                    producto.soldCount || 0
                  } vendidos</p>

                  <!-- Selectores (opciones) -->
                  <div class="options">
                    <label>
                      Modelo
                      <select>
                        <option>Standard</option>
                        ${
                          producto.relatedProducts
                            ?.map((prod) => `<option>${prod.name}</option>`)
                            .join("") || ""
                        }
                      </select>
                    </label>
                    <label>
                      Color
                      <select>
                        <option>Negro</option>
                        <option>Blanco</option>
                      </select>
                    </label>
                  </div>

                  <!-- Botón de compra -->   <!--Acá redirige al carrito-->
                  <button id= "btncompara" class="buy-btn" onclick="window.location.href='/cart'">Comprar</button>

                  <!-- Descripción (acordeón) -->
                  <details open>
                    <summary>Descripción</summary>
                    <p id="producto-descripcion">${
                      producto.description || "No hay descripción disponible."
                    }</p>
                  </details>
                </div>
                
                </div>
                <!-- Sección de productos relacionados -->
                  <div id="productos-relacionados" class="productos-rel">
                    <h3>Productos relacionados</h3>
                    <div class="productos-rel-container">
                      ${
                        // Buscar el producto completo por id
                        producto.relatedProducts
                          ?.map((prod) => {
                            const prodCompleto = productos.find(
                              (p) => p.id === prod.id
                            );
                            if (prodCompleto) {
                              return `
                              <div class="producto-relacionado" 
                                data-producto-id='${prodCompleto.id}'>
                                <img class="img-producto" src="${prodCompleto.image}" alt="${prodCompleto.name}">
                                <p style="margin:10px 0 0 0;">${prodCompleto.name}</p>
                              </div>
                            `;
                            } else {
                              // Si no se encuentra el producto completo, mostrar el básico
                              return `
                              <div class="producto-relacionado" 
                                data-producto-id='${prod.id}'>
                                <img src="${prod.image}" alt="${prod.name}" style="width:150px; height:auto; object-fit:cover;">
                                <p style="margin:10px 0 0 0;">${prod.name}</p>
                              </div>
                            `;
                            }
                          })
                          .join("") || "<p>No hay productos relacionados.</p>"
                      }
                    </div>
                  </div>

                  <!-- Comentarios -->
                  <div>
                    <h3 class="mt-4">Comentarios</h3>
                    <ul class="list-group d-flex flex-column gap-2" id="commentsSection"></ul>
                  </div>

                </div>
          `
    );

    // Evento para productos relacionados
    document.querySelectorAll(".producto-relacionado").forEach((el) => {
      el.addEventListener("click", function () {
        const prodId = parseInt(this.getAttribute("data-producto-id"));
        // Hacer fetch para traer el producto completo por su id
        fetch(PRODUCT_INFO_URL + prodId + EXT_TYPE, { credentials: "include" })
          .then((res) => res.json())
          .then((productoCompleto) => {
            localStorage.setItem(
              "productoSeleccionado",
              JSON.stringify(productoCompleto)
            );
            location.reload();
          })
          .catch(() => {
            alert("No se pudo cargar el producto.");
          });
      });
    });

    // Ahora sí capturamos el nuevo <ul>
    commentsSection = document.getElementById("commentsSection");

    fetch(Comentarios, { credentials: "include" })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => data.forEach(renderComment))
      .catch((error) => console.error("Error fetching comments:", error));
  } else {
    detalle.innerHTML = `<p>No se encontró el producto.</p>`;
  }

  function paintStars(value) {
    starInputs.forEach((star) => {
      const starValue = parseInt(star.id.split("-")[1], 10);
      const icon = document.querySelector(`label[for='${star.id}'] i`);
      if (icon) {
        if (starValue <= value) icon.classList.add("text-warning");
        else icon.classList.remove("text-warning");
      }
    });
  }

  function getSelectedValue() {
    const selected = document.querySelector("input[name='star']:checked");
    return selected ? parseInt(selected.id.split("-")[1], 10) : 0;
  }

  starInputs.forEach((input) => {
    const value = parseInt(input.id.split("-")[1], 10);
    const label = document.querySelector(`label[for='${input.id}']`);

    if (label) {
      // Hover: pintar hasta esa estrella
      label.addEventListener("mouseover", () => paintStars(value));
      // Al salir con el mouse: volver al valor seleccionado
      label.addEventListener("mouseout", () => paintStars(getSelectedValue()));
    }

    // Click: seleccionar y pintar hasta esa estrella
    input.addEventListener("change", () => paintStars(value));
  });

  function renderComment(comment) {
    const li = document.createElement("li");
    li.className = "list-group-item";

    const top = document.createElement("div");
    top.className = "d-flex justify-content-between border-bottom pb-2";

    const left = document.createElement("div");

    const userSpan = document.createElement("span");
    userSpan.className = "user-name me-2 fw-semibold";
    userSpan.textContent = comment.user;

    const starsSpan = document.createElement("span");
    starsSpan.className = "stars text-nowrap";
    // siempre estrellas con text-warning en las activas
    starsSpan.innerHTML =
      `<i class="fa fa-star text-warning"></i> `.repeat(comment.score) +
      `<i class="fa fa-star text-secondary"></i> `.repeat(5 - comment.score);

    left.appendChild(userSpan);
    left.appendChild(starsSpan);

    const dateDiv = document.createElement("div");
    dateDiv.className = "date";
    dateDiv.textContent = new Date(comment.dateTime).toLocaleDateString();

    top.appendChild(left);
    top.appendChild(dateDiv);

    const commentDiv = document.createElement("div");
    commentDiv.className = "comment pt-2";
    commentDiv.textContent = comment.description;

    li.appendChild(top);
    li.appendChild(commentDiv);

    commentsSection.appendChild(li);
  }

  // === Botón de enviar comentario ===
  const submitButton = document.getElementById("submitButton");
  const commentInput = document.getElementById("comentario");
  submitButton.addEventListener("click", (e) => {
    e.preventDefault();
    const userName = getLoggedUserName();
    const commentText = commentInput.value.trim();
    const score = getSelectedValue();

    if (!commentText || !score) {
      showToast(
        "Por favor escribe un comentario y elige una puntuación.",
        "error"
      );
      return;
    }

    const newComment = {
      user: userName,
      description: commentText,
      score,
      dateTime: new Date().toISOString(),
    };

    renderComment(newComment);

    commentInput.value = "";
    starInputs.forEach((star) => (star.checked = false));
    paintStars(0);
  });

  //FUNCION PARA QUE AL APRETAR BOTON: COMPRAR SE GUARDE EN EL LOCALSTORAGE

  const btnN = document.getElementById("btncompara");

  btnN.addEventListener("click", function () {
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    const existe = cartItems.some((item) => item.id === producto.id);
    if (!existe) {
      cartItems.push(producto);
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    if (typeof updateCartBadge === "function") {
      updateCartBadge();
    }

    window.location.href = "/cart";
  });
});
