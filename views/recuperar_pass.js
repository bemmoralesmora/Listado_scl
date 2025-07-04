import { Login } from "./login.js";

function recuperar_pass() {
  const recuperar_pass = document.createElement("div");
  recuperar_pass.className = "recuperar-pass";
  renderPantallaCodigo(recuperar_pass);
  return recuperar_pass;
}

function renderPantallaCodigo(container) {
  container.innerHTML = `
    <div class="recuperar-box dark-mode">
      <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" class="logo-google" />
      <h2>Recuperación de cuentas</h2>
      <p>Un correo electrónico con un código de verificación se acaba de enviar a <b>correo@gmail.com</b></p>

      <label for="codigo">Entrar código</label>
      <input type="text" id="codigo" maxlength="4" placeholder="1234" />

      <div class="acciones">
        <button class="btn-secundario" id="intentar-otra">Intenta otra manera</button>
        <button class="btn-primario" id="verificar-codigo">Siguiente</button>
      </div>
    </div>
  `;

  container.querySelector("#verificar-codigo").addEventListener("click", () => {
    const codigo = container.querySelector("#codigo").value;
    if (/^\d{4}$/.test(codigo)) {
      renderPantallaNuevaPassword(container);
    } else {
      alert("El código debe tener exactamente 4 dígitos.");
    }
  });

  container.querySelector("#intentar-otra").addEventListener("click", () => {
    alert("Esta función aún no está disponible.");
  });
}

function renderPantallaNuevaPassword(container) {
  container.innerHTML = `
    <div class="recuperar-box dark-mode">
      <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" class="logo-google" />
      <h2>Nueva contraseña</h2>
      <p>Escribe tu nueva contraseña para continuar</p>

      <label for="pass1">Nueva contraseña</label>
      <input type="password" id="pass1" />

      <label for="pass2">Confirmar contraseña</label>
      <input type="password" id="pass2" />

      <div class="acciones">
        <button class="btn-primario" id="guardar-pass">Guardar y volver</button>
      </div>
    </div>
  `;

  container.querySelector("#guardar-pass").addEventListener("click", () => {
    const p1 = container.querySelector("#pass1").value;
    const p2 = container.querySelector("#pass2").value;

    if (!p1 || !p2) {
      alert("Completa ambos campos");
    } else if (p1 !== p2) {
      alert("Las contraseñas no coinciden");
    } else {
      alert("Contraseña actualizada (simulado)");
      document.querySelector("#root").innerHTML = "";
      document.querySelector("#root").appendChild(Login());
          }
  });
}

export { recuperar_pass };
