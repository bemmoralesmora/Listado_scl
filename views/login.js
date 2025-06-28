import { cargarSignup } from "./signup.js";
import { inicio } from "./inicioView.js";
import { handleLogin } from "../modulos/funciones_login.js";
import { recuperar_pass } from "./recuperar_pass.js";

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
  recuperarBtn.className = "recuperar-btn"; // Añade estilos CSS para este botón

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

      // Validación frontend
      if (!email || !password) {
        throw new Error("Por favor completa todos los campos");
      }

      // Mostrar en consola lo que se enviará
      console.log("Enviando:", { email, password });

      const data = await handleLogin(email, password);

      // Redirigir después de login exitoso
      document.querySelector("#root").innerHTML = "";
      document.querySelector("#root").appendChild(inicio());
    } catch (error) {
      console.error("Error en login:", error);
      errorElement.textContent = error.message;
      errorElement.style.display = "block";

      // Enfocar el campo con error
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

export { Login };
