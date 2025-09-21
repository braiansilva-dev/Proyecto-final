const producto = JSON.parse(localStorage.getItem("productoSeleccionado"));
const detalle = document.getElementById("detalle");
const category = producto?.category || "Categoría desconocida";

// Obtener la lista de productos desde localStorage (guardada por products.js)
const productos = JSON.parse(localStorage.getItem("productos")) || [];

document.addEventListener("DOMContentLoaded", function(){

    if (producto) {
        detalle.innerHTML = ` 
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

                  <!-- Sección de productos relacionados -->
                  <div id="productos-relacionados" class="productos-rel">
                    <h3>Productos relacionados</h3>
                    <div class="productos-rel-container">
                      ${
                        // Buscar el producto completo por id
                        producto.relatedProducts?.map(prod => {
                          const prodCompleto = productos.find(p => p.id === prod.id);
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
                        }).join('') || '<p>No hay productos relacionados.</p>'
                      }
                    </div>
                  </div>
                </div>
            </div>
          `;

          // Evento para productos relacionados
          document.querySelectorAll('.producto-relacionado').forEach(el => {
            el.addEventListener('click', function() {
              const prodId = parseInt(this.getAttribute('data-producto-id'));
              // Hacer fetch para traer el producto completo por su id
              const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/"; 
              const EXT_TYPE = ".json";
              fetch(PRODUCT_INFO_URL + prodId + EXT_TYPE)
                .then(res => res.json())
                .then(productoCompleto => {
                  localStorage.setItem("productoSeleccionado", JSON.stringify(productoCompleto));
                  location.reload();
                })
                .catch(() => {
                  alert("No se pudo cargar el producto.");
                });
            });
          });

        } else {
          detalle.innerHTML = `<p>No se encontró el producto.</p>`;
        }

        });