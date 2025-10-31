const url = PRODUCTS_URL + localStorage.getItem("catID") + EXT_TYPE;
const lista = document.getElementById("lista");

let productos = [];
let category = "";

const precioAsc = document.getElementById('asc');
const precioDes = document.getElementById('des');
const sortByCount = document.getElementById('relevancia');
const min = document.getElementById('filterMin')
const max = document.getElementById('filterMax');
const filtrar = document.getElementById('filter');
const limpiar = document.getElementById('clear')
const buscadorInput = document.getElementById('buscadorInput');

// FUNCIONES DE FILTRADO Y ORDENAMIENTO
function filtrarPorPrecio() {
    const precioMin = parseInt(min.value) || 0;
    const precioMax = parseInt(max.value) || 9999999;
    
    // Filtramos los productos
    const productosFiltrados = productos.filter(producto => {
        return producto.cost >= precioMin && producto.cost <= precioMax;
    });
    
    // Mostramos los productos filtrados
    mostrarProductos(productosFiltrados);
}

function ordenarPorPrecioAsc() {
    const productosOrdenados = [...productos].sort((a, b) => a.cost - b.cost);
    mostrarProductos(productosOrdenados);
}

function ordenarPorPrecioDesc() {
    const productosOrdenados = [...productos].sort((a, b) => b.cost - a.cost);
    mostrarProductos(productosOrdenados);
}

function ordenarPorRelevancia() {
    const productosOrdenados = [...productos].sort((a, b) => b.soldCount - a.soldCount);
    mostrarProductos(productosOrdenados);
}

function limpiarFiltros() {
    min.value = '';
    max.value = '';
    mostrarProductos(productos); 
}

// Función para buscar productos en tiempo real
function buscarProductos() {
    const textoBusqueda = buscadorInput.value.toLowerCase().trim();
    
    if (textoBusqueda === '') {
        mostrarProductos(productos);
        return;
    }
    
    const productosFiltrados = productos.filter(producto => {

        const enNombre = producto.name.toLowerCase().includes(textoBusqueda);
        const enDescripcion = producto.description.toLowerCase().includes(textoBusqueda);
        
        return enNombre || enDescripcion;
    });
    
    mostrarProductos(productosFiltrados);
}

// Función para mostrar productos
function mostrarProductos(productosAMostrar) {
    lista.innerHTML = ''; 
    
    if (productosAMostrar.length === 0) {
        lista.innerHTML = `
            <li class="listaP">
                <div class="producto">
                    <p>No se encontraron productos que coincidan con los filtros.</p>
                </div>
            </li>
        `;
        return;
    }

    productosAMostrar.forEach(element => {
        // Contenedor del producto
        let li = document.createElement("li");
        li.className = "listaP";

        let div = document.createElement("div");
        div.className = "producto";
        
        // AGREGAR CURSOR POINTER Y EVENT LISTENER
        div.style.cursor = "pointer";
        
        // AGREGAR CLICK HANDLER PARA NAVEGACIÓN
        div.addEventListener("click", () => {
          
          const productoID = element.id;
          const productoURL = PRODUCT_INFO_URL + productoID + EXT_TYPE;

          fetch(productoURL)
            .then(res => res.json())
            .then(element => {
          Swal.fire({
                title: "", // Lo dejamos vacío porque usaremos HTML personalizado
                html: `
                    <div class="popup">
                        <div class="popup-contenido">
                            <!-- Imagenes y botón favorito -->
                            <div class="popup-img">

                                <!-- Carousel de imagenes -->
                                <div id="carousel-${element.id}" class="carousel slide">
                                    <div class="carousel-inner"> 
                                        ${element.images?.map((img, i) => `
                                            <div class="carousel-item ${i === 0 ? 'active' : ''}">
                                                <img src="${img}" class="d-block w-100" alt="...">
                                            </div>
                                        `).join('') || `
                                            <div class="carousel-item active">
                                                <img src="${element.image}" class="d-block w-100" alt="...">
                                            </div>
                                        `}
                                    </div>
                                    
                                    <!-- Botones del carousel prev/next -->
                                    <a class="carousel-control-prev" href="#carousel-${element.id}" role="button" data-slide="prev">
                                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                        <span class="sr-only">Anterior</span>
                                    </a>
                                    <a class="carousel-control-next" href="#carousel-${element.id}" role="button" data-slide="next">
                                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                        <span class="sr-only">Siguiente</span>
                                    </a>
                                </div>

                                <!-- Botón favorito -->
                                <input type="checkbox" style="display: none;" id="fav">
                                <label for="fav" class="fav-btn">
                                    <i class="fa-solid fa-heart"></i>
                                </label>
                            </div>

                            <!-- Info del producto -->
                            <div class="popup-info">
                                <h2 id="producto-nombre">${element.name}</h2>
                                <span id="producto-tag" class="tag">${category || "Categoría desconocida"}</span>
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

                                <!-- Descripción (acordeón) -->
                                <details open>
                                    <summary>Descripción</summary>
                                    <p id="producto-descripcion">${element.description || "No hay descripción disponible."}</p>
                                </details>
                                <a href="#" id="vermas" class="fw-bold">Ver más</a>
                            </div>
                        </div>
                    </div>
                `,
                showConfirmButton: false, // Ocultamos el botón por defecto de SweetAlert
                showCloseButton: true, // Agregamos el botón de cierre 'x'
                width: "auto", // Ancho automático
                padding: "1rem", // Padding personalizado
                background: "#fff", // Fondo blanco
                //Evento de abrir el ver mas 
                didOpen: () => {
                    const ver = document.getElementById('vermas');
                    ver.addEventListener("click", (e) => {
                        e.preventDefault();

                        // Guardamos el producto en localStorage
                        localStorage.setItem("productoSeleccionado", JSON.stringify(element));

                        // Redirigimos a la página de detalle
                        window.location.href = "product-info.html";
                    });
                }
                
            });
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
}

async function datos(url) {
    let response = await fetch(url);

    if (response.ok) {
        let data = await response.json();  
        productos = data.products;
        category = data.catName;

        mostrarProductos(productos);
        document.getElementById("Catalogo").textContent = `Catálogo de ${category}` || "Catálogo";

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

// AGREGAR EVENT LISTENERS A LOS BOTONES
precioAsc.addEventListener('click', ordenarPorPrecioAsc);
precioDes.addEventListener('click', ordenarPorPrecioDesc);
sortByCount.addEventListener('click', ordenarPorRelevancia);
filtrar.addEventListener('click', filtrarPorPrecio);
limpiar.addEventListener('click', limpiarFiltros);
buscadorInput.addEventListener('input', buscarProductos);

// Llamada a la función
datos(url);

