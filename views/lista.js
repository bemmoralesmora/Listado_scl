import {
  cargarGrados,
  cargarAlumnosPorGradoYFecha,
  guardarAsistencia,
  agregarAlumno,
  obtenerAlumnosBasicosPorGrado,
  cargarAsistenciaGuardada,
  abrirModalUniforme,
  abrirModalComentario,
  inicializarVerificadorAsistencias,
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

  // Botón para agregar alumno
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

  // Modal para agregar alumno (versión mejorada)
  const modalAgregarAlumno = document.createElement("div");
  modalAgregarAlumno.className = "modal";
  modalAgregarAlumno.style.display = "none";
  modalAgregarAlumno.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h2>Agregar Nuevo Alumno</h2>
      <div class="modal-body">
        <form class="form-alumno">
          <div class="form-group">
            <label for="nombre">Nombre</label>
            <input type="text" id="nombre" name="nombre" placeholder="Ej: María" required />
          </div>
          
          <div class="form-group">
            <label for="apellido">Apellido</label>
            <input type="text" id="apellido" name="apellido" placeholder="Ej: Gómez" required />
          </div>
          
          <div class="form-group">
            <label for="grado-modal">Grado</label>
            <select id="grado-modal" name="grado" required>
              <option value="">Seleccione un grado</option>
            </select>
          </div>
        
          <div class="form-group">
            <label for="correo">Correo electrónico</label>
            <input type="email" id="correo" name="correo" placeholder="Ej: maria@gmail.com" required />
          </div>
        
          <div class="form-group">
            <label for="contrasena">Contraseña</label>
            <input type="password" id="contrasena" name="contrasena" placeholder="Contraseña segura" required minlength="8" />
          </div>
        
          <div class="form-footer">
            <button type="submit" id="btn-guardar-alumno">Guardar alumno</button>
          </div>
        </form>      
      </div>
    </div>
  `;
  document.body.appendChild(modalAgregarAlumno);

  // Referencias a elementos del modal
  const formAlumno = modalAgregarAlumno.querySelector(".form-alumno");
  const selectGradoModal = modalAgregarAlumno.querySelector("#grado-modal");

  // Manejador para abrir modal
  agregarBtn.addEventListener("click", async function () {
    modalAgregarAlumno.style.display = "block";
    try {
      // Cargar grados en el select del modal
      await cargarGrados(selectGradoModal);
    } catch (error) {
      console.error("Error al cargar grados:", error);
      alert("Error al cargar los grados. Por favor intenta nuevamente.");
    }
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

  // Manejar envío del formulario de alumno
  formAlumno.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = formAlumno.querySelector("#nombre").value.trim();
    const apellido = formAlumno.querySelector("#apellido").value.trim();
    const grado = formAlumno.querySelector("#grado-modal").value;
    const correo = formAlumno.querySelector("#correo").value.trim();
    const contrasena = formAlumno.querySelector("#contrasena").value;

    try {
      // Validaciones básicas
      if (!nombre || !apellido || !grado || !correo || !contrasena) {
        throw new Error("Todos los campos son obligatorios");
      }

      if (contrasena.length < 8) {
        throw new Error("La contraseña debe tener al menos 8 caracteres");
      }

      // Llamar a la función para agregar alumno
      await agregarAlumno(nombre, apellido, grado, correo, contrasena);

      // Cerrar y limpiar el modal
      modalAgregarAlumno.style.display = "none";
      formAlumno.reset();

      // Si el grado seleccionado es el mismo que el del nuevo alumno, actualizar la lista
      if (gradoSelect.value === grado) {
        datos_lista.innerHTML =
          '<div class="loading">Actualizando lista...</div>';
        const alumnos = await obtenerAlumnosBasicosPorGrado(grado);
        renderAlumnos(alumnos);
      }

      alert("Alumno agregado correctamente");
    } catch (error) {
      console.error("Error al agregar alumno:", error);
      alert("Error al agregar alumno: " + error.message);
    }
  });

  function renderAlumnos(alumnos) {
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

      // Botón uniforme - modificado para pasar solo los datos necesarios
      const btnUniforme = document.createElement("button");
      btnUniforme.textContent = "Uniforme";
      btnUniforme.className = "btn-modal";
      btnUniforme.onclick = () =>
        abrirModalUniforme({
          id_alumno: alumno.id_alumno,
          nombre: `${alumno.nombre} ${alumno.apellido}`,
        });

      // Botón comentario - modificado para pasar solo los datos necesarios
      const btnComentario = document.createElement("button");
      btnComentario.textContent = "Coment";
      btnComentario.className = "btn-modal";
      btnComentario.onclick = () =>
        abrirModalComentario({
          id_alumno: alumno.id_alumno,
          nombre: `${alumno.nombre} ${alumno.apellido}`,
        });

      contInputs.appendChild(estadoSelect);
      contInputs.appendChild(btnUniforme);
      contInputs.appendChild(btnComentario);

      alumnoItem.appendChild(nombreElement);
      alumnoItem.appendChild(contInputs);

      datos_lista.appendChild(alumnoItem);
    });
  }

  // Evento para cambio de grado (similar al original pero usando renderAlumnos)
  gradoSelect.addEventListener("change", async function () {
    const grado = this.value;

    if (grado) {
      try {
        datos_lista.innerHTML =
          '<div class="loading">Cargando alumnos...</div>';
        const alumnos = await obtenerAlumnosBasicosPorGrado(grado);
        renderAlumnos(alumnos);

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

  // Botones para marcar todos
  let marcar_todos_presente = document.createElement("button");
  marcar_todos_presente.className = "marcar_todos_presente";
  marcar_todos_presente.textContent = "🗸 ";
  marcar_todos_presente.title = "Marcar todos como presentes";
  create_datos.appendChild(marcar_todos_presente);

  let marcar_todos_ausente = document.createElement("button");
  marcar_todos_ausente.className = "marcar_todos_ausente";
  marcar_todos_ausente.textContent = "x";
  marcar_todos_ausente.title = "Marcar todos como ausentes";
  create_datos.appendChild(marcar_todos_ausente);

  // Función para marcar todos los alumnos de un grado
  function marcarTodos(grado, estado) {
    if (!grado) {
      alert("Por favor selecciona un grado primero");
      return;
    }

    const alumnosItems = document.querySelectorAll(".alumno-item");
    if (alumnosItems.length === 0) {
      alert("No hay alumnos en este grado");
      return;
    }

    alumnosItems.forEach((item) => {
      const select = item.querySelector(".estado-asistencia");
      if (select) {
        select.value = estado;

        // Opcional: Añadir clase CSS para feedback visual inmediato
        item.classList.remove(
          "estado-presente",
          "estado-ausente",
          "estado-justificado"
        );
        item.classList.add(`estado-${estado}`);
      }
    });
  }

  // Event listeners para los botones
  marcar_todos_presente.addEventListener("click", () => {
    const gradoSeleccionado = gradoSelect.value;
    marcarTodos(gradoSeleccionado, "presente");
  });

  marcar_todos_ausente.addEventListener("click", () => {
    const gradoSeleccionado = gradoSelect.value;
    marcarTodos(gradoSeleccionado, "ausente");
  });

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

inicializarVerificadorAsistencias();

export { Lista };
