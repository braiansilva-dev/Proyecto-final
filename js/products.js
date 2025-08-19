const url = `https://japceibal.github.io/emercado-api/cats_products/101.json`;
const lista = document.getElementById("lista");

let productos = [];

async function datos(url) {
    let response = await fetch(url);

    if (response.ok) {
        let data = await response.json();  
        productos = data.products; 

        productos.forEach(element => {
            // Contenedor del producto
            let li = document.createElement("li");
            li.className = "listaP";

            let div = document.createElement("div");
            div.className = "producto";
            
            // AGREGAR CURSOR POINTER Y EVENT LISTENER
            div.style.cursor = "pointer";
            
            // AGREGAR CLICK HANDLER PARA NAVEGACIÓN
            div.addEventListener("click", () => {
                Swal.fire({
                    title: "", // Lo dejamos vacío porque usaremos HTML personalizado
                    html: `
                        <div class="popup">
                            <div class="popup-contenido">
                                <!-- Imagen y botón favorito -->
                                <div class="popup-img">
                                    <img id="producto-imagen" src="${element.image}" alt="${element.name}" />
                                    <input type="checkbox" style="display: none;" id="fav">
                                    <label for="fav" class="fav-btn">
                                        <i class="fa-solid fa-heart"></i>
                                    </label>
                                </div>

                                <!-- Info del producto -->
                                <div class="popup-info">
                                    <h2 id="producto-nombre">${element.name}</h2>
                                    <span id="producto-tag" class="tag">${element.category || "Autos"}</span>
                                    <p id="producto-precio" class="price">${element.currency} ${element.cost}</p>
                                    <p id="producto-vendidos" class="sold">${element.soldCount || 0} vendidos</p>

                                    <!-- Selectores (opciones) -->
                                    <div class="options">
                                        <label>
                                            Modelo
                                            <select>
                                                <option>Standard</option>
                                                ${element.relatedProducts?.map(prod => `<option>${prod.name}</option>`).join('') || ''}
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
                                        <p id="producto-descripcion">${element.description || "No hay descripción disponible."}</p>
                                    </details>
                                </div>
                            </div>
                        </div>
                    `,
                    showConfirmButton: false, // Ocultamos el botón por defecto de SweetAlert
                    showCloseButton: true, // Agregamos el botón de cierre 'x'
                    width: "auto", // Ancho automático
                    padding: "1rem", // Padding personalizado
                    background: "#fff", // Fondo blanco
                    
                });
            });

            // Imagen
            let img = document.createElement("img");
            img.src = element.image;
            img.alt = element.name;

            // Nombre
            let name = document.createElement("div");
            name.textContent = element.name;
            name.className = "producto-nombre";

            // Precio
            let price = document.createElement("div");
            price.textContent = `${element.cost} ${element.currency}`;
            price.className = "producto-precio";

            // Agregar todo al contenedor
            div.appendChild(img);
            div.appendChild(name);
            div.appendChild(price);

            // Agregar div dentro de li
            li.appendChild(div);

            // Agregar al HTML
            lista.appendChild(li);  
        });

    } else {
        swal.fire({
            title: "Error",
            text: "No se pudieron cargar los productos",
            icon: "error",
            confirmButtonText: "Aceptar"
        })
        console.error("Error: " + response.status);
    }
}

// Llamada a la función
datos(url);