import { inicio } from "./views/inicioView.js";
import { Login } from "./views/login.js";
import { identify } from "./views/identify.js";

const root = document.querySelector("#root");

function cargarAplicacion() {
  root.innerHTML = "";

  if (localStorage.getItem("profesorId")) {
    root.appendChild(inicio());
  } else {
    // Mostrar pantalla de identify antes del login
    root.appendChild(
      identify(() => {
        root.innerHTML = "";
        root.appendChild(Login());
      })
    );
  }
}

document.addEventListener("DOMContentLoaded", cargarAplicacion);

window.addEventListener("storage", (event) => {
  if (event.key === "profesorId") {
    cargarAplicacion();
  }
});
