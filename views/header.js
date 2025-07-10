import { desing_inicio } from "./inicio.js";
import { Lista } from "./lista.js";
import { Registro } from "./registro.js";
import { Login } from "./login.js";
import { Perfil } from "./perfil.js";
import { admin } from "./admin.js";
import { isAdmin as checkAdmin } from "./aunt.js";

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
  createMenuButtons(sidebar, true);
  document.body.appendChild(sidebar);

  // Event listener para el botón hamburguesa
  toggleButton.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });

  return header;
}

function createMenuButtons(container, isSidebar) {
  // Botón Inicio (visible para todos)
  let buttonInicio = document.createElement("button");
  buttonInicio.textContent = "Inicio";
  buttonInicio.addEventListener("click", () => {
    const contenido = document.querySelector(".contenido");
    if (contenido) {
      contenido.innerHTML = "";
      contenido.appendChild(desing_inicio());
    }
    if (isSidebar)
      document.querySelector(".sidebar").classList.remove("active");
  });
  container.appendChild(buttonInicio);

  // Obtener información del usuario
  const userIsAdmin = checkAdmin();
  const userIsProfesor = localStorage.getItem("profesorId") !== null;
  const isLoggedIn = userIsAdmin || userIsProfesor;

  // Botón Lista (para profesores y administradores)
  if (userIsProfesor || userIsAdmin) {
    let buttonLista = document.createElement("button");
    buttonLista.textContent = "Lista";
    buttonLista.addEventListener("click", () => {
      const contenido = document.querySelector(".contenido");
      if (contenido) {
        contenido.innerHTML = "";
        contenido.appendChild(Lista());
      }
      if (isSidebar)
        document.querySelector(".sidebar").classList.remove("active");
    });
    container.appendChild(buttonLista);
  }

  // Botón Registro (para profesores y administradores)
  if (userIsProfesor || userIsAdmin) {
    let buttonRegistro = document.createElement("button");
    buttonRegistro.textContent = "Registro";
    buttonRegistro.addEventListener("click", () => {
      const contenido = document.querySelector(".contenido");
      if (contenido) {
        contenido.innerHTML = "";
        contenido.appendChild(Registro());
      }
      if (isSidebar)
        document.querySelector(".sidebar").classList.remove("active");
    });
    container.appendChild(buttonRegistro);
  }

  // Botón Perfil (para ambos roles)
  if (isLoggedIn) {
    let buttonPerfil = document.createElement("button");
    buttonPerfil.textContent = "Perfil";
    buttonPerfil.addEventListener("click", async () => {
      try {
        const contenido = document.querySelector(".contenido");
        if (!contenido) {
          console.error("No se encontró el contenedor de contenido");
          return;
        }

        contenido.innerHTML = '<div class="loader">Cargando perfil...</div>';

        let usuarioData;

        if (userIsAdmin) {
          usuarioData = {
            id: localStorage.getItem("adminId"),
            nombre: localStorage.getItem("adminNombre"),
            apellido: localStorage.getItem("adminApellido"),
            email: "admin@escuela.edu",
            rol: "Administrador",
          };
        } else {
          usuarioData = {
            id: localStorage.getItem("profesorId"),
            nombre: localStorage.getItem("profesorNombre"),
            apellido: localStorage.getItem("profesorApellido"),
            email: `${localStorage
              .getItem("profesorNombre")
              .toLowerCase()}.${localStorage
              .getItem("profesorApellido")
              .toLowerCase()}@escuela.edu`,
            nombre_grado: "4to Grado - Sección A",
            id_grado_asignado: 4,
            rol: "Profesor",
          };
        }

        const perfilComponente = await Perfil(usuarioData);
        contenido.innerHTML = "";
        contenido.appendChild(perfilComponente);

        if (isSidebar)
          document.querySelector(".sidebar").classList.remove("active");
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
        const contenido = document.querySelector(".contenido");
        if (contenido) {
          contenido.innerHTML = `
            <div class="error-message">
              <h3>Error al cargar el perfil</h3>
              <p>${error.message}</p>
            </div>
          `;
        }
      }
    });
    container.appendChild(buttonPerfil);
  }

  // Botón Admin (solo para administradores)
  if (userIsAdmin) {
    let buttonAdmin = document.createElement("button");
    buttonAdmin.textContent = "Admin";
    buttonAdmin.addEventListener("click", async () => {
      try {
        const contenido = document.querySelector(".contenido");
        if (contenido) {
          contenido.innerHTML =
            '<div class="loader">Cargando panel de administración...</div>';
          const adminPanel = await admin();
          contenido.innerHTML = "";
          contenido.appendChild(adminPanel);
        }
        if (isSidebar)
          document.querySelector(".sidebar").classList.remove("active");
      } catch (error) {
        console.error("Error al cargar el panel de administración:", error);
        if (contenido) {
          contenido.innerHTML = `
            <div class="error-message">
              <h3>Error al cargar el panel de administración</h3>
              <p>${error.message}</p>
            </div>
          `;
        }
      }
    });
    container.appendChild(buttonAdmin);
  }

  // Botón Login/Logout
  if (isLoggedIn) {
    const logoutBtn = document.createElement("button");
    logoutBtn.textContent = "Cerrar sesión";
    logoutBtn.className = isSidebar ? "logout-btn" : "";
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
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
