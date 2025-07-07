import {
  crearComponenteBusqueda,
  crearComponenteEstadisticas,
  manejarBusqueda,
} from "../modulos/funciones_registro.js";

function Registro() {
  let Registro = document.createElement("section");
  Registro.className = "registro";

  // Crear componente de búsqueda
  const { searchLabel, searchInput, buscar } = crearComponenteBusqueda();
  Registro.appendChild(searchLabel);

  // Crear componente de estadísticas
  const { datosAlumno, presentesBox, ausentesBox, justificadosBox, totalBox } =
    crearComponenteEstadisticas();
  Registro.appendChild(datosAlumno);

  // --- Botones extra
  const extraButtonsContainer = document.createElement("div");
  extraButtonsContainer.className = "extra-buttons";

  const btnComentarios = document.createElement("button");
  btnComentarios.textContent = "Ver comentarios";
  btnComentarios.className = "btn-extra";

  const btnUniforme = document.createElement("button");
  btnUniforme.textContent = "Uniforme";
  btnUniforme.className = "btn-extra";

  extraButtonsContainer.appendChild(btnComentarios);
  extraButtonsContainer.appendChild(btnUniforme);
  Registro.appendChild(extraButtonsContainer);

  // --- Contenedor de comentarios
  const contenedorComentarios = document.createElement("div");
  contenedorComentarios.className = "contenedor-desplegable oculto";
  contenedorComentarios.innerHTML = `
        <div class="comentario-item">
            <span>Comentario de ejemplo 1</span>
            <span class="fecha">2025-06-01</span>
        </div>
        <div class="comentario-item">
            <span>Comentario de ejemplo 2</span>
            <span class="fecha">2025-06-10</span>
        </div>
        <div class="comentario-item">
            <span>Comentario de ejemplo 3</span>
            <span class="fecha">2025-06-13</span>
        </div>
    `;

  // --- Contenedor de uniforme
  const contenedorUniforme = document.createElement("div");
  contenedorUniforme.className = "contenedor-desplegable2 oculto";
  contenedorUniforme.innerHTML = `
        <div class="uniforme-item">
            <span>Uniforme incompleto</span>
            <div class="iconos-uniforme">
                <div class="camisa">👕<div class="cantidad">5</div></div>
                <div class="pantalon" >👖<div class="cantidad">6</div></div>
                <div class="zapatos">👞<div class="cantidad">8</div></div>
                <div class="calcetines">🧦<div class="cantidad">14</div></div>
            </div>
        </div>
    `;

  Registro.appendChild(contenedorComentarios);
  Registro.appendChild(contenedorUniforme);

  let eliminar_alumno = document.createElement("button");
  eliminar_alumno.className = "eliminar_alumno";
  eliminar_alumno.textContent = "Eliminar";
  Registro.appendChild(eliminar_alumno);

  let currentAlumnoId = null;

  // --- Eventos de despliegue con funcionalidad real
  btnComentarios.addEventListener("click", async () => {
    if (!currentAlumnoId) {
      alert("Primero busca y selecciona un alumno");
      return;
    }

    try {
      const response = await fetch(
        `https://backend-listadoscl.onrender.com/asistencia/${currentAlumnoId}/comentarios`
      );
      const comentarios = await response.json();

      if (!response.ok) {
        throw new Error(comentarios.error || "Error al obtener comentarios");
      }

      // Limpiar contenedor
      contenedorComentarios.innerHTML = "";

      // Agregar cada comentario
      comentarios.forEach((comentario) => {
        const item = document.createElement("div");
        item.className = "comentario-item";
        item.innerHTML = `
          <span>${comentario.comentario}</span>
          <span class="fecha">${new Date(
            comentario.fecha
          ).toLocaleDateString()}</span>
        `;
        contenedorComentarios.appendChild(item);
      });

      contenedorComentarios.classList.toggle("oculto");
      contenedorUniforme.classList.add("oculto");
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    }
  });

  btnUniforme.addEventListener("click", async () => {
    if (!currentAlumnoId) {
      alert("Primero busca y selecciona un alumno");
      return;
    }

    try {
      const response = await fetch(
        `https://backend-listadoscl.onrender.com/asistencia/${currentAlumnoId}/uniforme`
      );
      const uniforme = await response.json();

      if (!response.ok) {
        throw new Error(
          uniforme.error || "Error al obtener datos del uniforme"
        );
      }

      // Limpiar contenedor
      contenedorUniforme.innerHTML = "";

      // Crear elementos del uniforme
      const item = document.createElement("div");
      item.className = "uniforme-item";

      // Determinar estado del uniforme
      const incompleto =
        uniforme.zapatos === 0 ||
        uniforme.playera === 0 ||
        uniforme.pantalon === 0 ||
        uniforme.sueter === 0;

      item.innerHTML = `
        <span>Uniforme ${incompleto ? "incompleto" : "completo"}</span>
        <div class="iconos-uniforme">
          <div class="playera">👕<div class="cantidad">${
            uniforme.playera
          }</div></div>
          <div class="pantalon">👖<div class="cantidad">${
            uniforme.pantalon
          }</div></div>
          <div class="zapatos">👞<div class="cantidad">${
            uniforme.zapatos
          }</div></div>
          <div class="sueter">🧥<div class="cantidad">${
            uniforme.sueter
          }</div></div>
          ${
            uniforme.observacion
              ? `<div class="observacion">Observación: ${uniforme.observacion}</div>`
              : ""
          }
        </div>
      `;

      contenedorUniforme.appendChild(item);
      contenedorUniforme.classList.toggle("oculto");
      contenedorComentarios.classList.add("oculto");
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    }
  });

  // Función para eliminar alumno
  eliminar_alumno.addEventListener("click", async () => {
    if (!currentAlumnoId) {
      alert("Primero busca y selecciona un alumno");
      return;
    }

    // Crear modal de confirmación
    const modal = document.createElement("div");
    modal.className = "modal-eliminar";
    modal.innerHTML = `
      <div class="modal-contenido">
        <h3>Confirmar eliminación</h3>
        <p>Para eliminar este alumno, ingrese las credenciales de profesor:</p>
        
        <div class="form-group">
          <label>Email del profesor:</label>
          <input type="email" id="profesor-email" class="input-modal">
        </div>
        
        <div class="form-group">
          <label>Contraseña:</label>
          <input type="password" id="profesor-password" class="input-modal">
        </div>
        
        <div class="modal-botones">
          <button id="cancelar-eliminar" class="btn-modal btn-cancelar">Cancelar</button>
          <button id="confirmar-eliminar" class="btn-modal btn-confirmar">Eliminar</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Evento para cancelar
    document
      .getElementById("cancelar-eliminar")
      .addEventListener("click", () => {
        document.body.removeChild(modal);
      });

    // Evento para confirmar eliminación
    document
      .getElementById("confirmar-eliminar")
      .addEventListener("click", async () => {
        const email = document.getElementById("profesor-email").value.trim();
        const password = document
          .getElementById("profesor-password")
          .value.trim();

        if (!email || !password) {
          alert("Por favor ingrese email y contraseña de profesor");
          return;
        }

        try {
          const response = await fetch(
            `https://backend-listadoscl.onrender.com/asistencia/${currentAlumnoId}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                profesor_email: email,
                profesor_password: password,
              }),
            }
          );

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || "Error al eliminar alumno");
          }

          alert("Alumno eliminado correctamente");
          // Limpiar la interfaz
          searchInput.value = "";
          presentesBox.querySelector(".stat-value").textContent = "0";
          ausentesBox.querySelector(".stat-value").textContent = "0";
          justificadosBox.querySelector(".stat-value").textContent = "0";
          totalBox.querySelector(".stat-value").textContent = "0";
          currentAlumnoId = null;

          // Cerrar modal
          document.body.removeChild(modal);
        } catch (error) {
          console.error("Error:", error);
          alert(error.message);
        }
      });
  });

  // Modificar la función manejarBusqueda para almacenar el ID del alumno
  buscar.addEventListener("click", async () => {
    const nombre = searchInput.value.trim();
    const alumno = await manejarBusqueda(
      nombre,
      buscar,
      presentesBox,
      ausentesBox,
      justificadosBox,
      totalBox
    );

    if (alumno) {
      currentAlumnoId = alumno.id_alumno;
    }
  });

  return Registro;
}

export { Registro };
