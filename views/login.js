import { inicio } from "./inicioView.js";
import { handleLogin, handleAdminLogin } from "../modulos/funciones_login.js";
import { recuperar_pass } from "./recuperar_pass.js";

async function fetchBackend(userType, endpoint, data) {
  try {
    const baseUrl = "https://backend-listadoscl.onrender.com";
    const url = `${baseUrl}/${userType}/${endpoint}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "Error de conexión" };
  }
}

function Login() {
  const login = document.createElement("section");
  login.className = "login";

  // Logo
  const logoDiv = document.createElement("div");
  const logoImg = document.createElement("img");
  logoImg.src = "assets/images/LogoSCL.png";
  logoImg.alt = "Logo";
  logoDiv.appendChild(logoImg);

  const logoLogin = document.createElement("div");
  logoLogin.className = "logo-login";
  logoLogin.appendChild(logoDiv);
  login.appendChild(logoLogin);

  // Selector de tipo de usuario
  const userTypeDiv = document.createElement("div");
  userTypeDiv.className = "user-type-selector";

  const userTypeLabel = document.createElement("label");
  userTypeLabel.textContent = "Tipo de usuario: ";

  const userTypeSelect = document.createElement("select");
  userTypeSelect.id = "userType";

  const optionProfesor = document.createElement("option");
  optionProfesor.value = "profesor";
  optionProfesor.textContent = "Profesor";

  const optionAdmin = document.createElement("option");
  optionAdmin.value = "admin";
  optionAdmin.textContent = "Administrador";

  userTypeSelect.appendChild(optionProfesor);
  userTypeSelect.appendChild(optionAdmin);

  userTypeDiv.appendChild(userTypeLabel);
  userTypeDiv.appendChild(userTypeSelect);
  login.appendChild(userTypeDiv);

  // Formulario
  const form = document.createElement("form");
  form.className = "form";

  const inputEmail = document.createElement("input");
  inputEmail.type = "email";
  inputEmail.id = "email";
  inputEmail.placeholder = "Correo electrónico";
  inputEmail.required = true;

  const inputPassword = document.createElement("input");
  inputPassword.type = "password";
  inputPassword.id = "password";
  inputPassword.placeholder = "Contraseña";
  inputPassword.required = true;

  const botonLogin = document.createElement("button");
  botonLogin.type = "submit";
  botonLogin.textContent = "Iniciar Sesión >";
  botonLogin.className = "login-btn";

  // Mensaje de error
  const errorElement = document.createElement("p");
  errorElement.className = "error-message";
  errorElement.style.color = "red";
  errorElement.style.minHeight = "20px";
  errorElement.style.visibility = "hidden";

  form.appendChild(inputEmail);
  form.appendChild(inputPassword);
  form.appendChild(errorElement);
  form.appendChild(botonLogin);
  login.appendChild(form);

  // Botón Recuperar Contraseña
  const recuperarBtn = document.createElement("button");
  recuperarBtn.textContent = "¿No recuerdas tu Contraseña?";
  recuperarBtn.className = "recuperar-btn";

  const crearCuenta = document.createElement("div");
  crearCuenta.className = "crear";
  crearCuenta.appendChild(recuperarBtn);
  login.appendChild(crearCuenta);

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Limpiar errores anteriores
    errorElement.textContent = "";
    errorElement.style.display = "none";

    // Deshabilitar botón durante la petición
    botonLogin.disabled = true;
    botonLogin.textContent = "Verificando...";

    try {
      const email = inputEmail.value.trim();
      const password = inputPassword.value.trim();
      const userType = userTypeSelect.value;

      // Validación frontend
      if (!email || !password) {
        throw new Error("Por favor completa todos los campos");
      }

      let data;
      if (userType === "admin") {
        data = await handleAdminLogin(email, password);
        // Guardar datos de sesión de admin de manera robusta
        localStorage.setItem("adminId", data.admin.id);
        localStorage.setItem("adminNombre", data.admin.nombre);
        localStorage.setItem("adminApellido", data.admin.apellido);
        localStorage.setItem("userRole", "admin");
        localStorage.setItem("userType", "admin");
        window.localStorage.setItem("adminSession", "active");
      } else {
        data = await handleLogin(email, password);
        // Guardar datos de sesión de profesor
        localStorage.setItem("profesorId", data.profesor.id);
        localStorage.setItem("profesorNombre", data.profesor.nombre);
        localStorage.setItem("profesorApellido", data.profesor.apellido);
        localStorage.setItem("userRole", "profesor");
        localStorage.setItem("userType", "profesor");
        window.localStorage.setItem("profesorSession", "active");
      }

      // Redirigir después de asegurar que los datos están guardados
      setTimeout(() => {
        document.querySelector("#root").innerHTML = "";
        document.querySelector("#root").appendChild(inicio());
      }, 100);
    } catch (error) {
      console.error("Error en login:", error);
      errorElement.textContent = error.message;
      errorElement.style.display = "block";

      if (error.message.includes("email")) {
        inputEmail.focus();
      } else {
        inputPassword.focus();
      }
    } finally {
      botonLogin.disabled = false;
      botonLogin.textContent = "Iniciar Sesión >";
    }
  });

  // Manejador Recuperar Contraseña
  recuperarBtn.addEventListener("click", function (event) {
    event.preventDefault();
    document.querySelector("#root").innerHTML = "";
    document.querySelector("#root").appendChild(recuperar_pass());
  });

  return login;
}

export { Login, fetchBackend };
