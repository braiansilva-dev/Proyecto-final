document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cartContainer");

  // Intentar obtener del localStorage
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  // Render principal
  function renderCart() {
    cartContainer.innerHTML = "";

    if (!cartItems || cartItems.length === 0) {
      cartContainer.innerHTML = `
        <div class="alert alert-info text-center">
          Tu carrito está vacío.
        </div>`;
      localStorage.removeItem("cartItems");
      return;
    }

    cartItems.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "card mb-3 shadow-sm position-relative";

      card.innerHTML = `
        <button
          class="btn-delete text-danger bg-transparent border-0 position-absolute"
          title="Eliminar producto"
          data-index="${index}"
          style="top: .5rem; right: .5rem; cursor: pointer; z-index: 2;"
        >
          <i class="bi bi-x-circle fs-4" style="pointer-events: none;"></i>
        </button>

        <div class="row g-0 flex-nowrap align-items-center">
          <div class="col-3 d-flex align-items-center pe-0">
            <img src="${item.images[0]}" class="img-fluid rounded-sm" alt="${
        item.name
      }">
          </div>

          <div class="col-9 ps-0 h-100">
            <div class="card-body d-flex flex-column justify-content-between h-100">
              <div class="d-flex justify-content-between align-items-start w-100">
                <h5 class="card-title mb-2 mb-md-0">${item.name}</h5>
                <div class="text-end ms-auto">
                  <h5 class="fw-bold mb-2 me-4">
                    ${item.currency === "USD" ? "$" : item.currency} ${
        item.cost
      }
                  </h5>

                  <div class="d-flex flex-column justify-content-end align-items-end gap-2">
                    <select class="form-select form-select-sm w-auto cantidad-select" data-index="${index}">
                      ${[1, 2, 3, 4, 5]
                        .map(
                          (n) =>
                            `<option value="${n}" ${
                              n === 1 ? "selected" : ""
                            }>${n}</option>`
                        )
                        .join("")}
                    </select>
                    <select class="form-select form-select-sm w-auto color-select" data-index="${index}">
                      ${["rojo", "negro", "blanco"]
                        .map(
                          (color) =>
                            `<option value="${color}" ${
                              color === "rojo" ? "selected" : ""
                            }>${
                              color[0].toUpperCase() + color.slice(1)
                            }</option>`
                        )
                        .join("")}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>`;

      cartContainer.appendChild(card);
    });

    // Mostrar total
    cartContainer.innerHTML += `
    <!-- Contenedor del total -->
        <div id="cart-summary" class="container p-4 shadow-sm" style="max-width: 300px">
          <div
            class="d-flex justify-content-between align-items-center total-text"
          >
            <span class="fw-bold fs-5">Total:</span>
            <span id="cart-total" class="fw-bold fs-5">$0 USD</span>
          </div>
          <button
            id="checkout-btn"
            class="d-block w-100 btn btn-primary mx-auto"
          >
            Proceder con la compra
          </button>
        </div>
    `;
    addListeners();
  }

  // Eliminar producto
  function addListeners() {
    document.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = parseInt(e.currentTarget.dataset.index, 10);
        if (!isNaN(index)) {
          cartItems.splice(index, 1);
          localStorage.setItem("cartItems", JSON.stringify(cartItems));
          renderCart();
        }
      });
    });
  }

  // Render inicial
  renderCart();
});
