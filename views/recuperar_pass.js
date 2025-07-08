import { Login, fetchBackend } from "./login.js";

function recuperar_pass() {
  const recuperar_pass = document.createElement("div");
  recuperar_pass.className = "recuperar-pass";

  // Obtener el tipo de usuario del localStorage
  const userType = localStorage.getItem("userType") || "profesor";
  recuperar_pass.dataset.userType = userType;

  renderPantallaCorreo(recuperar_pass);
  return recuperar_pass;
}

async function renderPantallaCorreo(container) {
  const userType = container.dataset.userType;
  const baseUrl = "https://backend-listadoscl.onrender.com";
  const endpoint =
    userType === "admin"
      ? "/admin/recuperar-contrasena"
      : "/profesores/recuperarPass";

  container.innerHTML = `
    <div class="recuperar-box ${userType}-mode">
      <img src="assets/images/LogoSCL.png" class="logo-google" />
      <h2>Recuperación de cuenta</h2>
      <p>Ingresa tu dirección de correo electrónico para buscar tu cuenta</p>

      <label for="correo">Correo electrónico</label>
      <input type="email" id="correo" placeholder="tu@correo.com" />
      <p id="error-message" class="error-message"></p>

      <div class="acciones">
        <button class="btn-secundario" id="volver-login">Volver al inicio</button>
        <button class="btn-primario" id="enviar-codigo">Siguiente</button>
      </div>
    </div>
  `;

  container
    .querySelector("#enviar-codigo")
    .addEventListener("click", async () => {
      const correo = container.querySelector("#correo").value.trim();
      const errorMessage = container.querySelector("#error-message");

      // Validación de email
      if (!correo) {
        errorMessage.textContent = "Por favor ingresa un correo electrónico.";
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        errorMessage.textContent =
          "Por favor ingresa un correo electrónico válido.";
        return;
      }

      errorMessage.textContent = "";
      container.querySelector("#enviar-codigo").disabled = true;
      container.querySelector("#enviar-codigo").textContent = "Enviando...";

      try {
        const response = await fetch(baseUrl + endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: correo }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Error al enviar el código");
        }

        renderPantallaCodigo(container, correo);
      } catch (error) {
        console.error("Error:", error);
        errorMessage.textContent =
          error.message || "Error de conexión con el servidor";
      } finally {
        container.querySelector("#enviar-codigo").disabled = false;
        container.querySelector("#enviar-codigo").textContent = "Siguiente";
      }
    });

  container.querySelector("#volver-login").addEventListener("click", () => {
    document.querySelector("#root").innerHTML = "";
    document.querySelector("#root").appendChild(Login());
  });
}

async function renderPantallaCodigo(container, correo) {
  const userType = container.dataset.userType;
  const baseUrl = "https://backend-listadoscl.onrender.com";
  const endpoint =
    userType === "admin"
      ? "/admin/verificar-codigo"
      : "/profesores/verificarCodigo";

  container.innerHTML = `
    <div class="recuperar-box ${userType}-mode">
      <img src="assets/images/LogoSCL.png" class="logo-google" />
      <h2>Recuperación de cuenta</h2>
      <p>Un correo electrónico con un código de verificación se acaba de enviar a <b>${correo}</b></p>

      <label for="codigo">Ingresa código</label>
      <input type="text" id="codigo" maxlength="4" placeholder="1234" />
      <p id="error-message" class="error-message"></p>

      <div class="acciones">
        <button class="btn-secundario" id="intentar-otra">Intenta otra manera</button>
        <button class="btn-primario" id="verificar-codigo">Siguiente</button>
      </div>
    </div>
  `;

  container
    .querySelector("#verificar-codigo")
    .addEventListener("click", async () => {
      const codigo = container.querySelector("#codigo").value.trim();
      const errorMessage = container.querySelector("#error-message");

      if (!codigo) {
        errorMessage.textContent =
          "Por favor ingresa el código de verificación.";
        return;
      }

      if (!/^\d{4}$/.test(codigo)) {
        errorMessage.textContent =
          "El código debe tener exactamente 4 dígitos.";
        return;
      }

      errorMessage.textContent = "";
      container.querySelector("#verificar-codigo").disabled = true;
      container.querySelector("#verificar-codigo").textContent =
        "Verificando...";

      try {
        const response = await fetch(baseUrl + endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: correo,
            codigo: codigo,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Código incorrecto");
        }

        renderPantallaNuevaPassword(container, correo, codigo);
      } catch (error) {
        console.error("Error:", error);
        errorMessage.textContent =
          error.message || "Error de conexión con el servidor";
      } finally {
        container.querySelector("#verificar-codigo").disabled = false;
        container.querySelector("#verificar-codigo").textContent = "Siguiente";
      }
    });

  container.querySelector("#intentar-otra").addEventListener("click", () => {
    renderPantallaCorreo(container);
  });
}

function renderPantallaNuevaPassword(container, correo, codigo) {
  const userType = container.dataset.userType;
  const baseUrl = "https://backend-listadoscl.onrender.com";
  const endpoint =
    userType === "admin"
      ? "/admin/actualizar-contrasena"
      : "/profesores/actualizarPass";

  container.innerHTML = `
    <div class="recuperar-box ${userType}-mode">
      <img src="assets/images/LogoSCL.png" class="logo-google" />
      <h2>Nueva contraseña</h2>
      <p>Escribe tu nueva contraseña para continuar</p>

      <label for="pass1">Nueva contraseña</label>
      <input type="password" id="pass1" placeholder="Mínimo 8 caracteres" />

      <label for="pass2">Confirmar contraseña</label>
      <input type="password" id="pass2" placeholder="Repite tu contraseña" />
      <p id="error-message" class="error-message"></p>

      <div class="acciones">
        <button class="btn-primario" id="guardar-pass">Guardar y volver</button>
      </div>
    </div>
  `;

  container
    .querySelector("#guardar-pass")
    .addEventListener("click", async () => {
      const p1 = container.querySelector("#pass1").value;
      const p2 = container.querySelector("#pass2").value;
      const errorMessage = container.querySelector("#error-message");

      if (!p1 || !p2) {
        errorMessage.textContent = "Completa ambos campos";
        return;
      }

      if (p1.length < 8) {
        errorMessage.textContent =
          "La contraseña debe tener al menos 8 caracteres";
        return;
      }

      if (p1 !== p2) {
        errorMessage.textContent = "Las contraseñas no coinciden";
        return;
      }

      errorMessage.textContent = "";
      container.querySelector("#guardar-pass").disabled = true;
      container.querySelector("#guardar-pass").textContent = "Guardando...";

      try {
        const response = await fetch(baseUrl + endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: correo,
            codigo: codigo,
            nuevaContraseña: p1,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Error al actualizar la contraseña");
        }

        alert("¡Contraseña actualizada correctamente!");
        document.querySelector("#root").innerHTML = "";
        document.querySelector("#root").appendChild(Login());
      } catch (error) {
        console.error("Error:", error);
        errorMessage.textContent =
          error.message || "Error de conexión con el servidor";
      } finally {
        container.querySelector("#guardar-pass").disabled = false;
        container.querySelector("#guardar-pass").textContent =
          "Guardar y volver";
      }
    });
}

export { recuperar_pass };
