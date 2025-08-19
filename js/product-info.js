/*
// Función para obtener parámetros de la URL
function obtenerParametroURL(nombre) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(nombre);
}

// Función para mostrar mensaje de error
function mostrarError(mensaje) {
    document.getElementById("producto-nombre").textContent = "Error";
    document.getElementById("producto-descripcion").textContent = mensaje;
    document.getElementById("producto-precio").textContent = "";
    document.getElementById("producto-vendidos").textContent = "";
    document.getElementById("producto-imagen").src = "";
}

// Función para cargar la información del producto
function cargarProducto() {
    const idProducto = obtenerParametroURL('id');
    
    // Si no hay ID en la URL, mostramos el primer producto por defecto
    if (!idProducto) {
        cargarProductoPorDefecto();
        return;
    }
    
    // Convertimos el ID a número
    const numeroId = parseInt(idProducto);
    
    // Fetch
    fetch("https://japceibal.github.io/emercado-api/cats_products/101.json")
        .then(res => res.json())
        .then(data => {
            
            const productos = data.products;
            
            // Buscamos el producto que coincida con el ID
            const producto = productos.find(p => p.id === numeroId);
            
            if (producto) {
                mostrarInformacionProducto(producto);
            } else {
                mostrarError(`No se encontró un producto con ID: ${numeroId}`);
            }
        })
        .catch(err => {
            console.error("Error al cargar productos:", err);
            mostrarError("Error al cargar la información del producto");
        });
}

// Función para mostrar la información del producto en la página
function mostrarInformacionProducto(producto) {
    document.getElementById("producto-imagen").src = producto.image;
    document.getElementById("producto-nombre").textContent = producto.name;
    document.getElementById("producto-precio").textContent = `${producto.currency} ${producto.cost}`;
    document.getElementById("producto-vendidos").textContent = `${producto.soldCount} vendidos`;
    document.getElementById("producto-descripcion").textContent = producto.description;
    
    // Agregamos el tag si existe
    const tagElement = document.getElementById("producto-tag");
    if (tagElement) {
        tagElement.textContent = producto.category || "Auto";
    }
}

// Función para cargar producto por defecto (el primero de la lista)
function cargarProductoPorDefecto() {
    fetch("https://japceibal.github.io/emercado-api/cats_products/101.json")
        .then(res => res.json())
        .then(data => {
            
            const productos = data.products;
            const producto = productos[0]; // primer producto por defecto
            mostrarInformacionProducto(producto);
        })
        .catch(err => {
            console.error("Error al cargar productos:", err);
            mostrarError("Error al cargar la información del producto");
        });
}

// Cuando la página se carga, ejecutamos la función
document.addEventListener('DOMContentLoaded', cargarProducto);

document.addEventListener('DOMContentLoaded', function() {
    // Cargar producto
    cargarProducto();
    
    // Event listener para el botón volver
    const btnVolver = document.getElementById("btn-volver");
    if (btnVolver) {
        btnVolver.addEventListener("click", function() {
            window.location.href = "products.html";
        });
    }
});

*/
