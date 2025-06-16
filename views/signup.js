import { Login } from "./login.js";

function cargarSignup() {
  let signup = document.createElement("section");
  signup.className = "signup";

  // Crear elementos del logo
  const logoDiv = document.createElement("div");
  const logoImg = document.createElement("img");
  logoImg.src = "assets/images/LogoSCL.png";
  logoImg.alt = "";
  logoDiv.appendChild(logoImg);

  const logoContainer = document.createElement("div");
  logoContainer.className = "logo-signup";
  logoContainer.appendChild(logoDiv);

  // Crear elementos del formulario
  const formTitle = document.createElement("h1");
  formTitle.textContent = "Create new account";

  const loginLinkText = document.createElement("p");
  const loginLink = document.createElement("a");
  loginLink.href = "#";
  loginLink.textContent = "Iniciar Sesión";
  loginLinkText.appendChild(document.createTextNode("¿Ya tienes una cuenta? "));
  loginLinkText.appendChild(loginLink);

  const volverLogin = document.createElement("div");
  volverLogin.className = "volver-login";
  volverLogin.appendChild(loginLinkText);

  // Campos de entrada
  const nombreInput = document.createElement("input");
  nombreInput.type = "text";
  nombreInput.id = "nombre";
  nombreInput.placeholder = "Nombre";
  nombreInput.required = true;

  const apellidoInput = document.createElement("input");
  apellidoInput.type = "text";
  apellidoInput.id = "apellido";
  apellidoInput.placeholder = "Apellido";
  apellidoInput.required = true;

  const contNP = document.createElement("div");
  contNP.className = "cont_n_p";
  contNP.appendChild(nombreInput);
  contNP.appendChild(apellidoInput);

  const correoInput = document.createElement("input");
  correoInput.type = "email";
  correoInput.id = "correo";
  correoInput.placeholder = "Correo electrónico";
  correoInput.required = true;

  const passwordInput = document.createElement("input");
  passwordInput.type = "password";
  passwordInput.id = "contraseña";
  passwordInput.placeholder = "Contraseña";
  passwordInput.required = true;

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = "Registrarse";

  // Construir el formulario
  const formSignup = document.createElement("form");
  formSignup.className = "form-signup";
  formSignup.appendChild(formTitle);
  formSignup.appendChild(volverLogin);
  formSignup.appendChild(contNP);
  formSignup.appendChild(correoInput);
  formSignup.appendChild(passwordInput);
  formSignup.appendChild(submitButton);

  // Agregar todo al contenedor principal
  signup.appendChild(logoContainer);
  signup.appendChild(formSignup);

  // Manejar el clic en el enlace "Iniciar Sesión"
  loginLink.addEventListener("click", function (event) {
    event.preventDefault();
    let root = document.querySelector("#root");
    root.innerHTML = "";
    root.appendChild(Login());
  });

  // Manejar el envío del formulario de registro
  formSignup.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nombre = nombreInput.value;
    const correo = correoInput.value;
    const contraseña = passwordInput.value;

    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, contraseña, correo }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Registro exitoso:", data);
        alert("Registro exitoso");
        let root = document.querySelector("#root");
        root.innerHTML = "";
        root.appendChild(Login());
      } else {
        throw new Error(data.error || "Error en el registro");
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      alert("Error en el registro: " + error.message);
    }
  });

  return signup;
}

export { cargarSignup };
