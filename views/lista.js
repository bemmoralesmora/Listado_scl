import {
  cargarGrados,
  cargarAlumnosPorGradoYFecha,
  guardarAsistencia,
  agregarAlumno,
  obtenerAlumnosBasicosPorGrado,
  cargarAsistenciaGuardada,
  abrirModalUniforme,
  abrirModalComentario,
} from "../modulos/funciones_lista.js";

function Lista() {
  let Lista = document.createElement("section");
  Lista.className = "lista";

  let create_datos = document.createElement("div");
  create_datos.className = "create-datos";
  Lista.appendChild(create_datos);

  // Selector de fecha
  let fecha_input = document.createElement("input");
  fecha_input.type = "date";
  fecha_input.id = "fecha";
  fecha_input.className = "icono-fecha";

  let mostrar_fecha = document.createElement("div");
  mostrar_fecha.className = "mostrar-fecha";
  mostrar_fecha.textContent = "Fecha: No seleccionada";

  create_datos.appendChild(fecha_input);
  create_datos.appendChild(mostrar_fecha);

  // Botón para agregar alumno (reemplaza al input)
  let agregarBtn = document.createElement("button");
  agregarBtn.textContent = "Agregar Nuevo Alumno";
  agregarBtn.className = "agregar-btn";
  create_datos.appendChild(agregarBtn);

  // Selector de grados
  let gradoSelect = document.createElement("select");
  gradoSelect.className = "grado";
  gradoSelect.innerHTML = '<option value="">Selecciona un grado</option>';

  // Contenedor para la lista de alumnos
  let datos_lista = document.createElement("div");
  datos_lista.className = "datos-lista";
  Lista.appendChild(datos_lista);

  // Crear contenedor de modales
  const modalContainer = document.createElement("div");
  modalContainer.id = "modal-container";
  document.body.appendChild(modalContainer);

  // Crear modal para agregar alumno
  const modalAgregarAlumno = document.createElement("div");
  modalAgregarAlumno.className = "modal";
  modalAgregarAlumno.style.display = "none";
  modalAgregarAlumno.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h2>Agregar Nuevo Alumno</h2>
      <div class="modal-body">
        <!-- Aquí irá el formulario para agregar alumno -->
        <p>Formulario para agregar nuevo alumno</p>
      </div>
    </div>
  `;
  document.body.appendChild(modalAgregarAlumno);

  // Manejador para abrir modal
  agregarBtn.addEventListener("click", function () {
    modalAgregarAlumno.style.display = "block";
  });

  // Manejador para cerrar modal
  modalAgregarAlumno
    .querySelector(".close-modal")
    .addEventListener("click", function () {
      modalAgregarAlumno.style.display = "none";
    });

  // Cerrar modal al hacer clic fuera del contenido
  modalAgregarAlumno.addEventListener("click", function (event) {
    if (event.target === modalAgregarAlumno) {
      modalAgregarAlumno.style.display = "none";
    }
  });

  // Evento para cambio de grado
  gradoSelect.addEventListener("change", async function () {
    const grado = this.value;

    if (grado) {
      try {
        datos_lista.innerHTML =
          '<div class="loading">Cargando alumnos...</div>';
        const alumnos = await obtenerAlumnosBasicosPorGrado(grado);

        datos_lista.innerHTML = "";

        if (alumnos.length === 0) {
          datos_lista.innerHTML =
            '<div class="no-alumnos">No hay alumnos en este grado</div>';
          return;
        }

        alumnos.forEach((alumno) => {
          const alumnoItem = document.createElement("div");
          alumnoItem.className = "alumno-item";
          alumnoItem.dataset.idAlumno = alumno.id_alumno;

          const nombreElement = document.createElement("h1");
          nombreElement.textContent = `${alumno.nombre} ${alumno.apellido}`;

          const contInputs = document.createElement("div");
          contInputs.className = "cont-inputs";

          const estadoSelect = document.createElement("select");
          estadoSelect.className = "estado-asistencia";
          estadoSelect.dataset.idAlumno = alumno.id_alumno;

          const opciones = [
            { value: "presente", text: "Presente" },
            { value: "ausente", text: "Ausente", selected: true },
            { value: "justificado", text: "Justificado" },
          ];

          opciones.forEach((opcion) => {
            const optionElement = document.createElement("option");
            optionElement.value = opcion.value;
            optionElement.textContent = opcion.text;
            if (opcion.selected) optionElement.selected = true;
            estadoSelect.appendChild(optionElement);
          });

          // Botón uniforme
          const btnUniforme = document.createElement("button");
          btnUniforme.textContent = "Uniforme";
          btnUniforme.className = "btn-modal";
          btnUniforme.onclick = () => abrirModalUniforme(alumno);

          // Botón comentario
          const btnComentario = document.createElement("button");
          btnComentario.textContent = "Coment";
          btnComentario.className = "btn-modal";
          btnComentario.onclick = () => abrirModalComentario(alumno);

          contInputs.appendChild(estadoSelect);
          contInputs.appendChild(btnUniforme);
          contInputs.appendChild(btnComentario);

          alumnoItem.appendChild(nombreElement);
          alumnoItem.appendChild(contInputs);

          datos_lista.appendChild(alumnoItem);
        });

        // Si hay fecha seleccionada, cargar asistencia
        if (fecha_input.value) {
          const asistencias = await cargarAsistenciaGuardada(
            grado,
            fecha_input.value
          );
          if (asistencias) {
            asistencias.forEach((asistencia) => {
              const alumnoItem = datos_lista.querySelector(
                `.alumno-item[data-id-alumno="${asistencia.id_alumno}"]`
              );
              if (alumnoItem) {
                const select = alumnoItem.querySelector(".estado-asistencia");
                if (select) select.value = asistencia.estado;

                if (asistencia.comentario) {
                  alumnoItem.dataset.comentario = asistencia.comentario;
                }

                if (asistencia.zapatos !== undefined) {
                  alumnoItem.dataset.uniforme = JSON.stringify({
                    zapatos: asistencia.zapatos,
                    playera: asistencia.playera,
                    pantalon: asistencia.pantalon,
                    sueter: asistencia.sueter,
                    corte_pelo: asistencia.corte_pelo,
                    observacion: asistencia.observacion || "",
                  });
                }
              }
            });
          }
        }
      } catch (error) {
        datos_lista.innerHTML = `<div class="error">${error.message}</div>`;
      }
    } else {
      datos_lista.innerHTML = "";
    }
  });

  // Evento para cambio de fecha
  fecha_input.addEventListener("change", async function () {
    mostrar_fecha.textContent = this.value
      ? "Fecha: " + this.value
      : "Fecha: No seleccionada";

    if (gradoSelect.value && this.value) {
      try {
        const asistencias = await cargarAsistenciaGuardada(
          gradoSelect.value,
          this.value
        );
        if (asistencias) {
          asistencias.forEach((asistencia) => {
            const alumnoItem = datos_lista.querySelector(
              `.alumno-item[data-id-alumno="${asistencia.id_alumno}"]`
            );
            if (alumnoItem) {
              const select = alumnoItem.querySelector(".estado-asistencia");
              if (select) select.value = asistencia.estado;

              if (asistencia.comentario) {
                alumnoItem.dataset.comentario = asistencia.comentario;
              }

              if (asistencia.zapatos !== undefined) {
                alumnoItem.dataset.uniforme = JSON.stringify({
                  zapatos: asistencia.zapatos,
                  playera: asistencia.playera,
                  pantalon: asistencia.pantalon,
                  sueter: asistencia.sueter,
                  corte_pelo: asistencia.corte_pelo,
                  observacion: asistencia.observacion || "",
                });
              }
            }
          });
        }
      } catch (error) {
        console.error("Error al cargar asistencia:", error);
      }
    }
  });

  create_datos.appendChild(gradoSelect);

  // Botón para guardar asistencia
  let agregarAsistencia = document.createElement("button");
  agregarAsistencia.textContent = "Guardar Asistencia";
  agregarAsistencia.className = "agregarAsistencia";

  agregarAsistencia.addEventListener("click", async () => {
    const fecha = fecha_input.value;
    const grado = gradoSelect.value;

    if (!fecha) {
      alert("Debes seleccionar una fecha primero");
      return;
    }

    if (!grado) {
      alert("Debes seleccionar un grado primero");
      return;
    }

    try {
      agregarAsistencia.disabled = true;
      agregarAsistencia.textContent = "Guardando...";

      await guardarAsistencia(datos_lista, grado, fecha);
      alert("¡Asistencia guardada correctamente!");
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      agregarAsistencia.disabled = false;
      agregarAsistencia.textContent = "Guardar Asistencia";
    }
  });

  create_datos.appendChild(agregarAsistencia);

  // Cargar grados disponibles
  cargarGrados(gradoSelect).catch((error) => {
    alert(error.message);
  });

  return Lista;
}

export { Lista };
