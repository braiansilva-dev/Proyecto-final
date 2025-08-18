const url = "https://japceibal.github.io/emercado-api/cats_products/101.json";
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
                // Redirigir a product-info.html con el ID del producto
                window.location.href = `product-info.html?id=${element.id}`;
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
        console.error("Error: " + response.status);
    }
}

// Llamada a la función
datos(url);

document.getElementById("btn-logout").addEventListener("click", () => {
  localStorage.removeItem("loggedIn");
  localStorage.setItem("logoutMessage", "true");
  window.location.href = "login.html";
});