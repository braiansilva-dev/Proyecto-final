let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

document.addEventListener("DOMContentLoaded", () => {
    const cartContainer = document.getElementById("cartContainer");


    // Render principal del carrito
    function renderCart() {
      cartContainer.innerHTML = "";

      if (!cartItems || cartItems.length === 0) {
        // Ocultar las columnas
        const checkoutColumn = document.getElementById("checkoutColumn");
        const cartColumn = document.getElementById("cartColumn");
        if (checkoutColumn) checkoutColumn.style.display = "none";
        if (cartColumn) cartColumn.style.display = "none";

        // Mostrar solo el mensaje centrado
        const main = document.querySelector("main");
        main.innerHTML = `
        <div class="d-flex align-items-center justify-content-center " style="min-height: 70vh;">
        <div class="p-3 rounded alert-info text-center" style="width: fit-content;">
            <i class="bi bi-cart-x fs-1 mb-3 d-block"></i>
            <h4>Tu carrito está vacío</h4>
            <p class="mb-3">Agrega algunos productos para continuar</p>
            <a href="index.html" class="btn btn-primary">Seguir comprando</a>
        </div>
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
                        <img src="${
                          item.images[0]
                        }" class="img-fluid rounded-sm" alt="${
          item.name
        }" style="max-height: 120px; object-fit: cover;">
                    </div>

                    <div class="col-9 ps-0 h-100">
                        <div class="card-body d-flex flex-column justify-content-between h-100">
                            <div class="d-flex justify-content-between align-items-start w-100">
                                <h5 class="card-title mb-2 mb-md-0">${
                                  item.name
                                }</h5>
                                <div class="text-end ms-auto">
                                    <h5 class="fw-bold mb-2 me-4">
                                        ${
                                          item.currency === "USD"
                                            ? "$"
                                            : item.currency
                                        } ${item.cost}
                                    </h5>

                                    <div class="d-flex flex-column justify-content-end align-items-end gap-2">
                                        <div class="d-flex align-items-center">
                                            <label class="form-label me-2 mb-0">Cantidad:</label>
                                            <select class="form-select form-select-sm w-auto cantidad-select" data-index="${index}">
                                                ${[
                                                  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
                                                ]
                                                  .map(
                                                    (n) =>
                                                      `<option value="${n}" ${
                                                        n === 1
                                                          ? "selected"
                                                          : ""
                                                      }>${n}</option>`
                                                  )
                                                  .join("")}
                                            </select>
                                        </div>
                                        <div class="d-flex align-items-center">
                                            <label class="form-label me-2 mb-0">Color:</label>
                                            <select class="form-select form-select-sm w-auto color-select" data-index="${index}">
                                                ${[
                                                  "rojo",
                                                  "negro",
                                                  "blanco",
                                                  "azul",
                                                  "verde",
                                                ]
                                                  .map(
                                                    (color) =>
                                                      `<option value="${color}" ${
                                                        color === "rojo"
                                                          ? "selected"
                                                          : ""
                                                      }>${
                                                        color[0].toUpperCase() +
                                                        color.slice(1)
                                                      }</option>`
                                                  )
                                                  .join("")}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="text-end mt-2">
                                <small>Subtotal:</small>
                                <span class="fw-bold subtotal" id="subtotal-${index}">
                                    ${
                                      item.currency === "USD"
                                        ? "USD"
                                        : item.currency
                                    } ${item.cost}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>`;

        cartContainer.appendChild(card);
      });

      addCartListeners();
      updateTotal();
    }

    function addCartListeners() {
        // Eliminar producto
        document.querySelectorAll(".btn-delete").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const index = parseInt(e.currentTarget.dataset.index, 10);
                if (!isNaN(index)) {
                    cartItems.splice(index, 1);
                    localStorage.setItem("cartItems", JSON.stringify(cartItems));
                    renderCart();
                    updateCartBadge();
                }
            });
        });

        // Actualizar total
        document.querySelectorAll(".cantidad-select").forEach((select) => {
            select.addEventListener("change", (e) => {
                const index = parseInt(e.target.dataset.index, 10);
                const cantidad = parseInt(e.target.value, 10);
                const item = cartItems[index];

                const subtotal = item.cost * cantidad;
                const subtotalElement = document.getElementById(`subtotal-${index}`);
                const subtotalConvertido = convertir(subtotal, item.currency, monedaSeleccionada);
                subtotalElement.textContent = `${monedaSeleccionada} ${subtotalConvertido.toFixed(2)}`;

                updateTotal();
            });
        });
    }

    let monedaSeleccionada = "USD"; // por defecto
    let USD_a_UYU = 40;

    function convertir(valor, monedaOriginal, monedaDestino) {
        if (monedaOriginal === monedaDestino) return valor;

        if (monedaOriginal === "USD" && monedaDestino === "UYU") {
            return valor * USD_a_UYU;
        }

        if (monedaOriginal === "UYU" && monedaDestino === "USD") {
            return valor / USD_a_UYU;
        }
    }

    // Listener para el cambio de moneda
    document.querySelectorAll('input[name="currency"]').forEach(radio => {
        radio.addEventListener("change", (e) => {
            monedaSeleccionada = e.target.value;
            updateTotal();   // recalcular todo
            renderCart();    // recargare subtotales
        });
    });


    // ========== FUNCIONES DEL CHECKOUT ==========

    // Función para actualizar los costos en la sección de checkout
    function updateCostos(subtotal) {
        const subtotalElement = document.getElementById("subtotal-costo");
        const envioElement = document.getElementById("costo-envio");
        const totalElement = document.getElementById("total-costo");
        
        if (subtotalElement && envioElement && totalElement) {
            // Obtener el porcentaje de envío seleccionado
            const selectedEnvio = document.querySelector('input[name="tipoEnvio"]:checked');
            const porcentajeEnvio = selectedEnvio ? parseFloat(selectedEnvio.value) : 0.15;
            
            // Calcular costos
            const costoEnvio = subtotal * porcentajeEnvio;
            const total = subtotal + costoEnvio;
            
            // Actualizar elementos
            subtotalElement.textContent = `${subtotal.toFixed(2)} ${monedaSeleccionada}`;
            envioElement.textContent = `${costoEnvio.toFixed(2)} ${monedaSeleccionada}`;
            totalElement.textContent = `${total.toFixed(2)} ${monedaSeleccionada}`;
        }
    }
    
    // Función para calcular el subtotal del carrito
    function calcularSubtotal() {
        let subtotal = 0;
        
        if (cartItems.length === 0) {
            return 0;
        }
        
        const selects = document.querySelectorAll(".cantidad-select");
        
        selects.forEach((select, index) => {
            if (cartItems[index]) {
                const cantidad = parseInt(select.value, 10);
                const item = cartItems[index];
                subtotal += convertir(item.cost * cantidad, item.currency, monedaSeleccionada);
            }
        });
        
        return subtotal;
    }

    // Función para actualizar el total general
    function updateTotal() {
        let subtotal = 0;
        
        if (cartItems.length > 0) {
            document.querySelectorAll(".cantidad-select").forEach((select, index) => {
                const cantidad = parseInt(select.value, 10);
                const item = cartItems[index];
                subtotal += convertir(item.cost * cantidad, item.currency, monedaSeleccionada);
            });
        }
        
        updateCostos(subtotal);
    }

    // Función para calcular subtotal inicial
    function calcularSubtotalInicial() {
        let subtotal = 0;
        
        cartItems.forEach(item => {
            subtotal += item.cost; // Cada item empieza con cantidad 1
        });
        
        return subtotal;
    }

    // Listeners del checkout
    function addCheckoutListeners() {
        // Actualizar costos cuando cambia el tipo de envío
        document.querySelectorAll('input[name="tipoEnvio"]').forEach((radio) => {
            radio.addEventListener('change', () => {
                const subtotal = calcularSubtotal();
                updateCostos(subtotal);
            });
        });
        
        // Evento para el botón de finalizar compra
        const btnFinalizar = document.getElementById('btn-finalizar');
        if (btnFinalizar) {
            btnFinalizar.addEventListener('click', finalizarCompra);
        }
    }

    // Función para finalizar la compra
    function finalizarCompra() {
        // Validar que hay productos en el carrito
        if (!cartItems || cartItems.length === 0) {
            alert('Tu carrito está vacío. Agrega productos antes de finalizar la compra.');
            return;
        }
        
        // Validar que se completó la dirección
        const departamento = document.getElementById('departamento').value.trim();
        const localidad = document.getElementById('localidad').value.trim();
        const calle = document.getElementById('calle').value.trim();
        const numero = document.getElementById('numero').value.trim();
        
        if (!departamento || !localidad || !calle || !numero) {
            alert('Por favor, completa todos los campos obligatorios de la dirección de envío.');
            return;
        }
        
        // Validar forma de pago seleccionada
        const formaPago = document.querySelector('input[name="formaPago"]:checked');
        if (!formaPago) {
            alert('Por favor, selecciona una forma de pago.');
            return;
        }
        
        // Preparar datos para el resumen de compra
        const direccionEnvio = {
            departamento,
            localidad,
            calle,
            numero,
            esquina: document.getElementById('esquina').value.trim()
        };
        
        const tipoEnvioSeleccionado = document.querySelector('input[name="tipoEnvio"]:checked');
        const tipoEnvio = {
            nombre: tipoEnvioSeleccionado.nextElementSibling.textContent.trim(),
            porcentaje: parseFloat(tipoEnvioSeleccionado.value)
        };
        
        const formaPagoSeleccionada = formaPago.nextElementSibling.textContent.trim();
        
        // Calcular totales finales
        const subtotal = calcularSubtotal();
        const costoEnvio = subtotal * tipoEnvio.porcentaje;
        const total = subtotal + costoEnvio;
        
        // Crear objeto de compra
        const compra = {
            productos: cartItems.map((item, index) => {
                const select = document.querySelector(`.cantidad-select[data-index="${index}"]`);
                const colorSelect = document.querySelector(`.color-select[data-index="${index}"]`);
                return {
                    ...item,
                    cantidad: parseInt(select.value, 10),
                    color: colorSelect ? colorSelect.value : 'rojo'
                };
            }),
            direccionEnvio,
            tipoEnvio,
            formaPago: formaPagoSeleccionada,
            subtotal,
            costoEnvio,
            total,
            moneda: monedaSeleccionada,
            fecha: new Date().toISOString(),
            id: 'PED-' + Date.now().toString()
        };
        
        // Guardar compra en localStorage
        const historialCompras = JSON.parse(localStorage.getItem('historialCompras')) || [];
        historialCompras.push(compra);
        localStorage.setItem('historialCompras', JSON.stringify(historialCompras));
        
        mostrarResumenCompra(compra);
    }
    
// Función para mostrar el resumen de compra
function mostrarResumenCompra(compra) {
  const main = document.querySelector("main");
  const resumenHTML = `
  <div class="d-flex align-items-center justify-content-center " style="min-height: 100vh;">
    <div class="rounded alert-success text-center" style="max-width: 600px; width: 100%; padding: 2rem;">
      <div class="text-center mb-3">
        <i class="bi bi-check-circle-fill text-success fs-1"></i>
          </div>
            <h4 class="text-success text-center">¡Compra realizada con éxito!</h4>
              <div class="mt-4">
                <p><strong>Número de pedido:</strong> ${compra.id}</p>
                <p><strong>Total:</strong> $${compra.total.toFixed(
                      2
                    )} ${compra.moneda}</p>
                    <p><strong>Dirección de envío:</strong> ${
                      compra.direccionEnvio.calle
                    } ${compra.direccionEnvio.numero}, ${
    compra.direccionEnvio.localidad
  }, ${compra.direccionEnvio.departamento}</p>
                    <p><strong>Tipo de envío:</strong> ${
                      compra.tipoEnvio.nombre
                    }</p>
              <p><strong>Forma de pago:</strong> ${compra.formaPago}</p>
              <p class="mt-3">Recibirás un email de confirmación en breve.</p>
            </div>
          <div class="text-center mt-4">
        <a href="index.html" class="btn btn-primary">Seguir comprando</a>
      </div>
    </div>
  </div>
    `;

  document.getElementById("cartContainer").style.display = "none";
  document.getElementById("checkoutColumn").style.display = "none";

  main.innerHTML = resumenHTML;

  cartItems = [];
  localStorage.removeItem("cartItems");
}


    // ========== INICIALIZACIÓN ==========

    // Inicializar listeners del checkout
    addCheckoutListeners();
    
    // Render inicial del carrito
    renderCart();

    // Actualizar badge del carrito
    updateCartBadge();
    
    // Inicializar costos con el subtotal inicial (no con 0)
    const subtotalInicial = calcularSubtotalInicial();
    updateCostos(subtotalInicial);
    
    // Switch y usuario (manteniendo la funcionalidad existente)
    const miCheckbox = document.getElementById("miCheckboxId");
    const body = document.body;

    if (localStorage.getItem("fondo") === "1") {
        body.classList.add("modo-oscuro");
        miCheckbox.checked = true;
    }

    miCheckbox.addEventListener("change", () => {
        if (miCheckbox.checked) {
            body.classList.add("modo-oscuro");
            localStorage.setItem("fondo", "1");
        } else {
            body.classList.remove("modo-oscuro");
            localStorage.setItem("fondo", "0");
        }
    });

    const usersData = JSON.parse(localStorage.getItem("usersData")) || {};
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser && usersData[currentUser]) {
        const userData = usersData[currentUser];
        document.getElementById("nombreUsuario").innerText =
            userData.user || userData.email;
    }
});