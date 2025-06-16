import { desing_inicio } from "./inicio.js";
import { Lista } from "./lista.js";
import { Registro } from "./registro.js";
import { Login } from "./login.js";
import { Perfil } from "./perfil.js";  // Importamos el componente Perfil

function header() {
    let header = document.createElement('header');
    header.className = "header";

    // Botón hamburguesa
    const toggleButton = document.createElement('button');
    toggleButton.className = "menu-toggle";
    toggleButton.innerHTML = "☰";
    toggleButton.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
    header.appendChild(toggleButton);

    // Logo
    let logo = document.createElement('div');
    let img = document.createElement('img');
    img.src = "views/images/LogoSCL.png";
    img.className = "logo";
    logo.appendChild(img);
    header.appendChild(logo);

    // Sidebar (menú lateral)
    let sidebar = document.createElement('div');
    sidebar.className = "sidebar";

    // Botón Inicio
    let buttonInicio = document.createElement('button');
    buttonInicio.textContent = "Inicio";
    buttonInicio.addEventListener('click', () => {
        document.querySelector('.contenido').innerHTML = '';
        document.querySelector('.contenido').appendChild(desing_inicio());
        sidebar.classList.remove('active');
    });

    // Botón Lista
    let buttonLista = document.createElement('button');
    buttonLista.textContent = "Lista";
    buttonLista.addEventListener('click', () => {
        document.querySelector('.contenido').innerHTML = '';
        document.querySelector('.contenido').appendChild(Lista());
        sidebar.classList.remove('active');
    });

    // Botón Registro
    let buttonRegistro = document.createElement('button');
    buttonRegistro.textContent = "Registro";
    buttonRegistro.addEventListener('click', () => {
        document.querySelector('.contenido').innerHTML = '';
        document.querySelector('.contenido').appendChild(Registro());
        sidebar.classList.remove('active');
    });

    // Botón Perfil (actualizado)
    let buttonPerfil = document.createElement('button');
    buttonPerfil.textContent = "Perfil";
    buttonPerfil.addEventListener('click', () => {
        // Obtenemos los datos del profesor del localStorage
        const profesorId = localStorage.getItem('profesorId');
        const profesorNombre = localStorage.getItem('profesorNombre');
        const profesorApellido = localStorage.getItem('profesorApellido');
        
        if (profesorId) {
            // Creamos el objeto con los datos del perfil
            const usuarioData = {
                nombre: `${profesorNombre} ${profesorApellido}`,
                // Estos datos podrían venir de una API en una implementación real
                foto: "img/avatar-profesor.png",
                email: `${profesorNombre.toLowerCase()}.${profesorApellido.toLowerCase()}@escuela.edu`,
                gradoAsignado: "4to Grado - Sección A", // Esto podría ser dinámico
                estadisticas: {
                    alumnosRegistrados: 28,
                    aprobados: 25,
                    reprobados: 3,
                    promedioGeneral: 8.7
                }
            };
            
            document.querySelector('.contenido').innerHTML = '';
            document.querySelector('.contenido').appendChild(Perfil(usuarioData));
            sidebar.classList.remove('active');
        } else {
            alert("Por favor inicie sesión para ver su perfil");
        }
    });

    // Agregamos los botones al sidebar
    sidebar.appendChild(buttonInicio);
    sidebar.appendChild(buttonLista);
    sidebar.appendChild(buttonRegistro);
    sidebar.appendChild(buttonPerfil);

    // Verificamos el estado de login
    const isLoggedIn = localStorage.getItem('profesorId');

    if (isLoggedIn) {
        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = "Cerrar sesión";
        logoutBtn.className = "logout-btn";
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('profesorId');
            localStorage.removeItem('profesorNombre');
            localStorage.removeItem('profesorApellido');
            window.location.reload();
        });
        sidebar.appendChild(logoutBtn);
    } else {
        const loginBtn = document.createElement('button');
        loginBtn.textContent = "Login";
        loginBtn.className = "login-btn";
        loginBtn.addEventListener('click', () => {
            const root = document.querySelector('#root');
            if (root) {
                root.innerHTML = '';
                root.appendChild(Login());
            }
        });
        sidebar.appendChild(loginBtn);
    }

    document.body.appendChild(sidebar);
    return header;
}

export { header };