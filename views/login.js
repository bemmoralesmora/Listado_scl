import { cargarSignup } from "./signup.js";
import { inicio } from "./inicioView.js";

function Login() {
    let login = document.createElement('section');
    login.className = "login";

    // Logo
    const logoDiv = document.createElement('div');
    const logoImg = document.createElement('img');
    logoImg.src = "views/images/LogoSCL.png";
    logoImg.alt = "Logo";
    logoDiv.appendChild(logoImg);

    const logoLogin = document.createElement('div');
    logoLogin.className = "logo-login";
    logoLogin.appendChild(logoDiv);
    login.appendChild(logoLogin);

    // Formulario
    let form = document.createElement('form');
    form.className = "form";

    let inputEmail = document.createElement('input');
    inputEmail.type = "email";
    inputEmail.id = "email";
    inputEmail.placeholder = "Correo electrónico";
    inputEmail.required = true;

    let inputPassword = document.createElement('input');
    inputPassword.type = "password";
    inputPassword.id = "contraseña";
    inputPassword.placeholder = "Contraseña";
    inputPassword.required = true;

    let botonLogin = document.createElement('button');
    botonLogin.type = "submit";
    botonLogin.textContent = "Iniciar Sesión >";
    botonLogin.className = "login-btn";

    form.appendChild(inputEmail);
    form.appendChild(inputPassword);
    form.appendChild(botonLogin);
    login.appendChild(form);

    // Enlace Sign Up
    const signupText = document.createElement('p');
    const signupLink = document.createElement('a');
    signupLink.href = "#";
    signupLink.textContent = "Sign Up";
    signupText.appendChild(document.createTextNode("¿No tienes cuenta? "));
    signupText.appendChild(signupLink);

    const crearCuenta = document.createElement('div');
    crearCuenta.className = "crear";
    crearCuenta.appendChild(signupText);
    login.appendChild(crearCuenta);

    // Manejador de login
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        botonLogin.disabled = true;
        botonLogin.textContent = "Verificando...";
        
        const email = inputEmail.value;
        const contraseña = inputPassword.value;

        try {
            const response = await fetch('http://localhost:3000/login-profesor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, contraseña }),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Credenciales incorrectas');
            }

            // Guardar datos de sesión
            localStorage.setItem('profesorId', data.profesor.id);
            localStorage.setItem('profesorNombre', data.profesor.nombre);
            localStorage.setItem('profesorApellido', data.profesor.apellido);
            
            // Redirigir
            document.querySelector("#root").innerHTML = "";
            document.querySelector("#root").appendChild(inicio());
            
        } catch (error) {
            const errorElement = document.createElement('p');
            errorElement.className = 'error-message';
            errorElement.textContent = error.message;
            
            const existingError = form.querySelector('.error-message');
            if (existingError) form.removeChild(existingError);
            
            form.appendChild(errorElement);
        } finally {
            botonLogin.disabled = false;
            botonLogin.textContent = "Iniciar Sesión >";
        }
    });

    // Manejador Sign Up
    signupLink.addEventListener('click', function(event) {
        event.preventDefault();
        document.querySelector("#root").innerHTML = "";
        document.querySelector("#root").appendChild(cargarSignup());
    });

    return login;
}

export { Login };