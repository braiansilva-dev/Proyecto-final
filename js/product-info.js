const producto = JSON.parse(localStorage.getItem("productoSeleccionado"));
const detalle = document.getElementById("detalle");
const category = producto?.category || "Categoría desconocida"; // si tenías category
const starInputs = document.querySelectorAll("input[name='star']");

    document.addEventListener("DOMContentLoaded", function(){

    if (producto) {
        detalle.insertAdjacentHTML("afterbegin",` 
            <!-- Imagenes y botón favorito -->
            <div id="elementos-product-info">
                <div class="popup-img">

               <!-- Carousel de imagenes -->
                  <div id="carousel-${producto.id}" class="carousel slide">
                    <div class="carousel-inner"> 
                      ${producto.images?.map((img, i) => `
                        <div class="carousel-item ${i === 0 ? 'active' : ''}">
                          <img src="${img}" class="d-block w-100" alt="...">
                        </div>
                      `).join('') || `
                        <div class="carousel-item active">
                          <img src="${producto.image}" class="d-block w-100" alt="...">
                        </div>
                      `}
                    </div>
                    
                    <!-- Botones del carousel prev/next -->
                    <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${producto.id}" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Anterior</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carousel-${producto.id}" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Siguiente</span>
                    </button>


                  <!-- Botón favorito -->
                  <input type="checkbox" style="display: none;" id="fav">
                  <label for="fav" class="fav-btn">
                    <i class="fa-solid fa-heart"></i>
                  </label>
                </div>

                <!-- Info del producto -->
                <div class="popup-info">
                  <h2 id="producto-nombre">${producto.name}</h2>
                  <span id="producto-tag" class="tag">${category}</span>
                  <p id="producto-precio" class="price">${producto.currency} ${producto.cost}</p>
                  <p id="producto-vendidos" class="sold">${producto.soldCount || 0} vendidos</p>

                  <!-- Selectores (opciones) -->
                  <div class="options">
                    <label>
                      Modelo
                      <select>
                        <option>Standard</option>
                        ${producto.relatedProducts?.map(prod => `<option>${prod.name}</option>`).join('') || ''}
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

                  <!-- Botón de compra -->
                  <button class="buy-btn">Comprar</button>

                  <!-- Descripción (acordeón) -->
                  <details>
                    <summary>Descripción</summary>
                    <p id="producto-descripcion">${producto.description || "No hay descripción disponible."}</p>
                  </details>
                </div>
            </div>
          `)
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
  });