import { inicio } from "./views/inicioView.js";
import { Login } from "./views/login.js";

function cargarAplicacion() {
    const root = document.querySelector("#root");
    root.innerHTML = "";

    if (localStorage.getItem('profesorId')) {
        root.appendChild(inicio());
    } else {
        root.appendChild(Login());
    }
}

// Iniciar la aplicación al cargar
document.addEventListener('DOMContentLoaded', cargarAplicacion);

// Escuchar cambios en el localStorage para actualizar la UI
window.addEventListener('storage', (event) => {
    if (event.key === 'profesorId') {
        cargarAplicacion();
    }
});