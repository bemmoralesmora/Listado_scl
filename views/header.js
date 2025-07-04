import { desing_inicio } from "./inicio.js";
import { Lista } from "./lista.js";
import { Registro } from "./registro.js";
import { Login } from "./login.js";
import { Perfil } from "./perfil.js";

function header() {
  let header = document.createElement("header");
  header.className = "header";

  // Logo
  let logo = document.createElement("div");
  logo.className = "logo";
  let img = document.createElement("img");
  img.src = "assets/images/LogoSCL.png";
  logo.appendChild(img);
  header.appendChild(logo);

  // Menú principal para desktop
  let menuDesktop = document.createElement("div");
  menuDesktop.className = "menu";

  // Botones del menú desktop
  createMenuButtons(menuDesktop, false);

  header.appendChild(menuDesktop);

  // Botón hamburguesa para móvil
  const toggleButton = document.createElement("button");
  toggleButton.className = "menu-toggle";
  toggleButton.innerHTML = "☰";
  header.appendChild(toggleButton);

  // Sidebar (menú lateral para móvil)
  let sidebar = document.createElement("div");
  sidebar.className = "sidebar";

  // Botones del sidebar
  createMenuButtons(sidebar, true);

  document.body.appendChild(sidebar);

  // Event listener para el botón hamburguesa
  toggleButton.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });

  return header;
}

// Función para crear los botones del menú (reutilizable para desktop y móvil)
function createMenuButtons(container, isSidebar) {
  // Botón Inicio
  let buttonInicio = document.createElement("button");
  buttonInicio.textContent = "Inicio";
  buttonInicio.addEventListener("click", () => {
    document.querySelector(".contenido").innerHTML = "";
    document.querySelector(".contenido").appendChild(desing_inicio());
    if (isSidebar)
      document.querySelector(".sidebar").classList.remove("active");
  });

  // Botón Lista
  let buttonLista = document.createElement("button");
  buttonLista.textContent = "Lista";
  buttonLista.addEventListener("click", () => {
    document.querySelector(".contenido").innerHTML = "";
    document.querySelector(".contenido").appendChild(Lista());
    if (isSidebar)
      document.querySelector(".sidebar").classList.remove("active");
  });

  // Botón Registro
  let buttonRegistro = document.createElement("button");
  buttonRegistro.textContent = "Registro";
  buttonRegistro.addEventListener("click", () => {
    document.querySelector(".contenido").innerHTML = "";
    document.querySelector(".contenido").appendChild(Registro());
    if (isSidebar)
      document.querySelector(".sidebar").classList.remove("active");
  });

  // Botón Perfil
  let buttonPerfil = document.createElement("button");
  buttonPerfil.textContent = "Perfil";
  buttonPerfil.addEventListener("click", () => {
    const profesorId = localStorage.getItem("profesorId");
    const profesorNombre = localStorage.getItem("profesorNombre");
    const profesorApellido = localStorage.getItem("profesorApellido");

    if (profesorId) {
      const usuarioData = {
        nombre: `${profesorNombre} ${profesorApellido}`,
        foto: "img/avatar-profesor.png",
        email: `${profesorNombre.toLowerCase()}.${profesorApellido.toLowerCase()}@escuela.edu`,
        gradoAsignado: "4to Grado - Sección A",
        estadisticas: {
          alumnosRegistrados: 28,
          aprobados: 25,
          reprobados: 3,
          promedioGeneral: 8.7,
        },
      };

      document.querySelector(".contenido").innerHTML = "";
      document.querySelector(".contenido").appendChild(Perfil(usuarioData));
      if (isSidebar)
        document.querySelector(".sidebar").classList.remove("active");
    } else {
      alert("Por favor inicie sesión para ver su perfil");
    }
  });

  // Agregar botones comunes al contenedor
  container.appendChild(buttonInicio);
  container.appendChild(buttonLista);
  container.appendChild(buttonRegistro);
  container.appendChild(buttonPerfil);

  // Botones de login/logout según estado
  const isLoggedIn = localStorage.getItem("profesorId");

  if (isLoggedIn) {
    const logoutBtn = document.createElement("button");
    logoutBtn.textContent = "Cerrar sesión";
    logoutBtn.className = isSidebar ? "logout-btn" : "";
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("profesorId");
      localStorage.removeItem("profesorNombre");
      localStorage.removeItem("profesorApellido");
      window.location.reload();
    });
    container.appendChild(logoutBtn);
  } else {
    const loginBtn = document.createElement("button");
    loginBtn.textContent = "Login";
    loginBtn.className = isSidebar ? "login-btn" : "";
    loginBtn.addEventListener("click", () => {
      const root = document.querySelector("#root");
      if (root) {
        root.innerHTML = "";
        root.appendChild(Login());
      }
      if (isSidebar)
        document.querySelector(".sidebar").classList.remove("active");
    });
    container.appendChild(loginBtn);
  }
}

export { header };
