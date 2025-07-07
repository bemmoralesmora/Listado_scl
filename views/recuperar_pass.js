import { Login, fetchBackend } from "./login.js";

function recuperar_pass() {
  const recuperar_pass = document.createElement("div");
  recuperar_pass.className = "recuperar-pass";
  renderPantallaCorreo(recuperar_pass);
  return recuperar_pass;
}

async function renderPantallaCorreo(container) {
  container.innerHTML = `
    <div class="recuperar-box dark-mode">
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
      const correo = container.querySelector("#correo").value;
      const errorMessage = container.querySelector("#error-message");

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        errorMessage.textContent =
          "Por favor ingresa un correo electrónico válido.";
        return;
      }

      errorMessage.textContent = "";
      const response = await fetchBackend("recuperarPass", { email: correo });

      if (response.success) {
        renderPantallaCodigo(container, correo);
      } else {
        errorMessage.textContent =
          response.message || "Error al enviar el código";
      }
    });

  container.querySelector("#volver-login").addEventListener("click", () => {
    document.querySelector("#root").innerHTML = "";
    document.querySelector("#root").appendChild(Login());
  });
}

async function renderPantallaCodigo(container, correo) {
  container.innerHTML = `
    <div class="recuperar-box dark-mode">
      <img src="assets/images/LogoSCL.png" class="logo-google" />
      <h2>Recuperación de cuentas</h2>
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
      const codigo = container.querySelector("#codigo").value;
      const errorMessage = container.querySelector("#error-message");

      if (!/^\d{4}$/.test(codigo)) {
        errorMessage.textContent =
          "El código debe tener exactamente 4 dígitos.";
        return;
      }

      errorMessage.textContent = "";
      const response = await fetchBackend("verificarCodigo", {
        email: correo,
        codigo: codigo,
      });

      if (response.success) {
        renderPantallaNuevaPassword(container, correo, codigo);
      } else {
        errorMessage.textContent = response.message || "Código incorrecto";
      }
    });

  container.querySelector("#intentar-otra").addEventListener("click", () => {
    renderPantallaCorreo(container);
  });
}

function renderPantallaNuevaPassword(container, correo, codigo) {
  container.innerHTML = `
    <div class="recuperar-box dark-mode">
      <img src="assets/images/LogoSCL.png" class="logo-google" />
      <h2>Nueva contraseña</h2>
      <p>Escribe tu nueva contraseña para continuar</p>

      <label for="pass1">Nueva contraseña</label>
      <input type="password" id="pass1" />

      <label for="pass2">Confirmar contraseña</label>
      <input type="password" id="pass2" />
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
      } else if (p1 !== p2) {
        errorMessage.textContent = "Las contraseñas no coinciden";
        return;
      }

      errorMessage.textContent = "";
      const response = await fetchBackend("actualizarPass", {
        email: correo,
        codigo: codigo,
        nuevaContraseña: p1,
      });

      if (response.success) {
        alert("Contraseña actualizada correctamente");
        document.querySelector("#root").innerHTML = "";
        document.querySelector("#root").appendChild(Login());
      } else {
        errorMessage.textContent =
          response.message || "Error al actualizar la contraseña";
      }
    });
}

export { recuperar_pass };
