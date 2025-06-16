import {
  cargarGrados,
  cargarAlumnosPorGradoYFecha,
  guardarAsistencia,
  agregarAlumno,
  obtenerAlumnosBasicosPorGrado,
  cargarAsistenciaGuardada,
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

  // Input para nombre de alumno
  let agregar_input = document.createElement("input");
  agregar_input.type = "text";
  agregar_input.className = "agregar_input";
  agregar_input.placeholder = "Ingresa alumno (Nombre Apellido)";
  create_datos.appendChild(agregar_input);

  // Botón para agregar alumno
  let agregar = document.createElement("button");
  agregar.textContent = "+";
  agregar.className = "agregar";
  create_datos.appendChild(agregar);

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

  // Función para crear alumnos con botones
  function crearElementoAlumno(alumno) {
    const alumnoItem = document.createElement("div");
    alumnoItem.className = "alumno-item";
    alumnoItem.dataset.idAlumno = alumno.id_alumno;

    const nombreElement = document.createElement("h1");
    nombreElement.textContent = `${alumno.nombre} ${alumno.apellido}`;

    const contInputs = document.createElement("div");
    contInputs.className = "cont-inputs";

    // Selector de estado de asistencia
    const estadoSelect = document.createElement("select");
    estadoSelect.className = "estado-asistencia";
    estadoSelect.dataset.idAlumno = alumno.id_alumno;

    const opciones = [
      { value: "presente", text: "Presente" },
      { value: "ausente", text: "Ausente", selected: true },
    ];

    opciones.forEach((opcion) => {
      const optionElement = document.createElement("option");
      optionElement.value = opcion.value;
      optionElement.textContent = opcion.text;
      if (opcion.selected) optionElement.selected = true;
      estadoSelect.appendChild(optionElement);
    });

    // Botón uniforme
    const btnUniforme = crearBoton("uniforme", () =>
      abrirModalUniforme(alumno)
    );

    // Botón comentario
    const btnComentario = crearBoton("coment", () =>
      abrirModalComentario(alumno)
    );

    // Botón eliminar
    const btnEliminar = crearBoton(
      "✕",
      () => abrirModalEliminar(alumno),
      "btn-x"
    );

    contInputs.appendChild(estadoSelect);
    contInputs.appendChild(btnUniforme);
    contInputs.appendChild(btnComentario);
    contInputs.appendChild(btnEliminar);

    alumnoItem.appendChild(nombreElement);
    alumnoItem.appendChild(contInputs);

    return alumnoItem;
  }

  // Crear botón reutilizable
  function crearBoton(texto, accion, claseExtra = "") {
    const btn = document.createElement("button");
    btn.textContent = texto;
    btn.className = `btn-modal ${claseExtra}`;
    btn.onclick = accion;
    return btn;
  }

  // Modal base
  function crearModalBase(titulo, contenidoHTML) {
    modalContainer.innerHTML = "";

    const fondo = document.createElement("div");
    fondo.className = "modal";

    const contenido = document.createElement("div");
    contenido.className = "modal-content";
    contenido.innerHTML = `<h3>${titulo}</h3>${contenidoHTML}`;

    const btnCerrar = document.createElement("button");
    btnCerrar.textContent = "Cerrar";
    btnCerrar.onclick = () => (modalContainer.innerHTML = "");

    contenido.appendChild(btnCerrar);
    fondo.appendChild(contenido);
    modalContainer.appendChild(fondo);
  }

  // Modales específicos
  function abrirModalUniforme(alumno) {
    const html = `
      <label><input type="checkbox"> camisa</label><br>
      <label><input type="checkbox"> pantalón</label><br>
      <label><input type="checkbox"> zapatos</label><br>
      <label><input type="checkbox" id="todo"> marcar todo</label>
    `;
    crearModalBase("Uniforme de " + alumno.nombre, html);
  }

  function abrirModalComentario(alumno) {
    const alumnoItem = document.querySelector(
      `.alumno-item[data-id-alumno="${alumno.id_alumno}"]`
    );
    const comentarioActual = alumnoItem.dataset.comentario || "";

    const html = `
      <textarea id="comentario-modal" placeholder="Escribe tu comentario aquí" 
                style="width:90%; height:80px;">${comentarioActual}</textarea><br>
      <button id="guardar-comentario">Guardar</button>
    `;

    crearModalBase("Comentario para " + alumno.nombre, html);

    document
      .getElementById("guardar-comentario")
      .addEventListener("click", () => {
        const nuevoComentario =
          document.getElementById("comentario-modal").value;
        alumnoItem.dataset.comentario = nuevoComentario;
        modalContainer.innerHTML = "";
      });
  }

  function abrirModalEliminar(alumno) {
    const html = `
      <p>¿Desea eliminar a este alumno?</p>
      <input id="texto-eliminar" type="password" placeholder="verificar con pass"><br>
      <button>ok</button>
    `;
    crearModalBase("Eliminar a " + alumno.nombre, html);
  }

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
          datos_lista.appendChild(crearElementoAlumno(alumno));
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

  // Evento único para cambio de fecha
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
            }
          });
        }
      } catch (error) {
        console.error("Error al cargar asistencia:", error);
      }
    }
  });

  create_datos.appendChild(gradoSelect);

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

  // Manejador para agregar alumno
  agregar.addEventListener("click", async () => {
    const nombreCompleto = agregar_input.value.trim();
    const gradoSeleccionado = gradoSelect.value;
    const fechaSeleccionada = fecha_input.value;

    if (!nombreCompleto) {
      alert("Por favor ingresa el nombre completo del alumno");
      return;
    }

    if (!gradoSeleccionado) {
      alert("Por favor selecciona un grado válido");
      return;
    }

    try {
      await agregarAlumno(nombreCompleto, gradoSeleccionado);

      if (fechaSeleccionada) {
        await cargarAlumnosPorGradoYFecha(
          datos_lista,
          gradoSeleccionado,
          fechaSeleccionada
        );
      } else {
        agregar_input.value = "";
        // Refrescar lista
        gradoSelect.dispatchEvent(new Event("change"));
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  });

  // Cargar grados disponibles
  cargarGrados(gradoSelect).catch((error) => {
    alert(error.message);
  });

  return Lista;
}

export { Lista };
