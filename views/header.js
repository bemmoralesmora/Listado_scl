import { desing_inicio } from "./inicio.js";
import { Lista } from "./lista.js";
import { Registro } from "./registro.js";
import { Login } from "./login.js";

function header() {
  let header = document.createElement("header");
  header.className = "header";

  // Logo
  let logo = document.createElement("div");
  let img = document.createElement("img");
  img.src = "assets/images/LogoSCL.png";
  img.className = "logo";
  logo.appendChild(img);
  header.appendChild(logo);

  // Menú principal
  let menu = document.createElement("div");
  menu.className = "menu";

  let buttonInicio = document.createElement("button");
  buttonInicio.textContent = "Inicio";
  buttonInicio.addEventListener("click", () => {
    const contenido = document.querySelector(".contenido");
    if (contenido) {
      contenido.innerHTML = "";
      contenido.appendChild(desing_inicio());
    }
  });

  let buttonLista = document.createElement("button");
  buttonLista.textContent = "Lista";
  buttonLista.addEventListener("click", () => {
    const contenido = document.querySelector(".contenido");
    if (contenido) {
      contenido.innerHTML = "";
      contenido.appendChild(Lista());
    }
  });

  let buttonRegistro = document.createElement("button");
  buttonRegistro.textContent = "Registro";
  buttonRegistro.addEventListener("click", () => {
    const contenido = document.querySelector(".contenido");
    if (contenido) {
      contenido.innerHTML = "";
      contenido.appendChild(Registro());
    }
  });

  menu.appendChild(buttonInicio);
  menu.appendChild(buttonLista);
  menu.appendChild(buttonRegistro);
  header.appendChild(menu);

  // Contenedor de usuario/logout
  let userContainer = document.createElement("div");
  userContainer.className = "user-container";

  // Verificar si el usuario está logueado
  const isLoggedIn = localStorage.getItem("profesorId");

  if (isLoggedIn) {
    // Mostrar botón de logout si está logueado
    const logoutBtn = document.createElement("button");
    logoutBtn.textContent = "Cerrar sesión";
    logoutBtn.className = "logout-btn";
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("profesorId");
      localStorage.removeItem("profesorNombre");
      localStorage.removeItem("profesorApellido");
      window.location.reload(); // Recargar para actualizar la UI
    });
    userContainer.appendChild(logoutBtn);
  } else {
    // Mostrar botón de login si no está logueado
    const loginBtn = document.createElement("button");
    loginBtn.textContent = "Login";
    loginBtn.className = "login-btn";
    loginBtn.addEventListener("click", () => {
      const root = document.querySelector("#root");
      if (root) {
        root.innerHTML = "";
        root.appendChild(Login());
      }
    });
    userContainer.appendChild(loginBtn);
  }

  header.appendChild(userContainer);

  return header;
}

export { header };
