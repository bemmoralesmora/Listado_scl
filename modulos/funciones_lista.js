// Función para cargar grados desde el backend
export async function cargarGrados(selectElement) {
  try {
    const response = await fetch(
      "https://backend-listadoscl.onrender.com/grados"
    );
    const grados = await response.json();

    if (!response.ok) throw new Error(grados.error || "Error al cargar grados");

    // Limpiar select primero
    selectElement.innerHTML = '<option value="">Selecciona un grado</option>';

    grados.forEach((grado) => {
      const option = document.createElement("option");
      option.value = grado.nombre_grado;
      option.textContent = grado.nombre_grado;
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar grados:", error);
    throw new Error("No se pudieron cargar los grados. Recarga la página.");
  }
}

// Función para cargar alumnos por grado y fecha
export async function cargarAlumnosPorGradoYFecha(
  contenedor,
  nombreGrado,
  fecha
) {
  try {
    contenedor.innerHTML = '<div class="loading">Cargando alumnos...</div>';

    // 1. Obtener el ID del grado
    const gradoResponse = await fetch(
      `https://backend-listadoscl.onrender.com/grados/exacto/${encodeURIComponent(
        nombreGrado
      )}`
    );

    if (!gradoResponse.ok) {
      throw new Error(await gradoResponse.text());
    }

    const gradoData = await gradoResponse.json();
    const idGrado = gradoData.id_grado;

    // 2. Obtener los alumnos del grado con sus uniformes
    const alumnosResponse = await fetch(
      `https://backend-listadoscl.onrender.com/grados/${idGrado}/alumnos?fecha=${fecha}`
    );

    if (!alumnosResponse.ok) {
      throw new Error(await alumnosResponse.text());
    }

    const alumnos = await alumnosResponse.json();

    // Limpiar contenedor
    contenedor.innerHTML = "";

    if (alumnos.length === 0) {
      contenedor.innerHTML =
        '<div class="no-alumnos">No hay alumnos en este grado</div>';
      return;
    }

    // 3. Crear elementos para cada alumno
    alumnos.forEach((alumno) => {
      const alumnoItem = document.createElement("div");
      alumnoItem.className = "alumno-item";
      alumnoItem.dataset.idAlumno = alumno.id_alumno;

      if (alumno.id_asistencia) {
        alumnoItem.dataset.idAsistencia = alumno.id_asistencia;
      }

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

      // Establecer estado si ya existe
      if (alumno.estado) {
        estadoSelect.value = alumno.estado;
      }

      // Botones adicionales
      const btnUniforme = document.createElement("button");
      btnUniforme.textContent = "Uniforme";
      btnUniforme.className = "btn-modal";
      btnUniforme.onclick = () => abrirModalUniforme(alumno);

      const btnComentario = document.createElement("button");
      btnComentario.textContent = "Coment";
      btnComentario.className = "btn-modal";
      btnComentario.onclick = () => abrirModalComentario(alumno);

      contInputs.appendChild(estadoSelect);
      contInputs.appendChild(btnUniforme);
      contInputs.appendChild(btnComentario);

      alumnoItem.appendChild(nombreElement);
      alumnoItem.appendChild(contInputs);

      // Guardar datos de uniforme si existen
      if (alumno.zapatos !== undefined) {
        alumnoItem.dataset.uniforme = JSON.stringify({
          zapatos: alumno.zapatos,
          playera: alumno.playera,
          pantalon: alumno.pantalon,
          sueter: alumno.sueter,
          corte_pelo: alumno.corte_pelo,
          observacion: alumno.observacion || "",
        });
      }

      // Guardar comentario si existe
      if (alumno.comentario) {
        alumnoItem.dataset.comentario = alumno.comentario;
      }

      contenedor.appendChild(alumnoItem);
    });
  } catch (error) {
    console.error("Error al cargar alumnos:", error);
    throw error;
  }
}

export async function guardarAsistencia(contenedor, nombreGrado, fecha) {
  try {
    // 1. Obtener el ID del grado
    const gradoResponse = await fetch(
      `https://backend-listadoscl.onrender.com/grados/exacto/${encodeURIComponent(
        nombreGrado
      )}`
    );
    if (!gradoResponse.ok) throw new Error("Error al obtener el grado");
    const gradoData = await gradoResponse.json();

    // 2. Preparar datos
    const alumnosItems = contenedor.querySelectorAll(".alumno-item");
    if (alumnosItems.length === 0)
      throw new Error("No hay alumnos para guardar");

    const asistencias = [];

    for (const item of alumnosItems) {
      const estadoSelect = item.querySelector(".estado-asistencia");
      const asistencia = {
        id_alumno: parseInt(estadoSelect.dataset.idAlumno),
        fecha: fecha,
        estado: estadoSelect.value,
        comentario: item.dataset.comentario || null,
      };

      // Añadir datos de uniforme si existen
      if (item.dataset.uniforme) {
        asistencia.uniforme = JSON.parse(item.dataset.uniforme);
      }

      asistencias.push(asistencia);
    }

    // 3. Enviar al backend
    const response = await fetch(
      "https://backend-listadoscl.onrender.com/asistencia/batch",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ asistencias }),
      }
    );

    if (!response.ok) throw new Error("Error al guardar asistencia");

    // 4. Marcar el grado como completado si es la fecha actual
    const hoy = new Date().toISOString().split("T")[0];
    if (fecha === hoy) {
      const completados = JSON.parse(
        localStorage.getItem("asistenciasCompletadas") || {}
      );
      completados[nombreGrado] = true;
      localStorage.setItem(
        "asistenciasCompletadas",
        JSON.stringify(completados)
      );

      // Actualizar visualmente el select
      const gradoSelect = document.querySelector(".grado");
      if (gradoSelect) {
        const option = gradoSelect.querySelector(
          `option[value="${nombreGrado}"]`
        );
        if (option) {
          option.classList.add("asistencia-completada");
          option.dataset.completado = "true";
        }
      }
    }

    return await response.json();
  } catch (error) {
    console.error("Error al guardar asistencia:", error);
    throw error;
  }
}

// Función para inicializar la verificación de asistencias
export function inicializarVerificadorAsistencias() {
  verificarAsistenciasCompletadas();

  // Escuchar cambios en la fecha
  const fechaInput = document.getElementById("fecha");
  if (fechaInput) {
    fechaInput.addEventListener("change", verificarAsistenciasCompletadas);
  }
}

// Función para verificar asistencias completadas
function verificarAsistenciasCompletadas() {
  const fechaInput = document.getElementById("fecha");
  if (!fechaInput) return;

  const hoy = new Date().toISOString().split("T")[0];
  const fechaSeleccionada = fechaInput.value;

  // Si no es hoy, limpiar las marcas
  if (fechaSeleccionada !== hoy) {
    localStorage.removeItem("asistenciasCompletadas");
    limpiarMarcasAsistencias();
    return;
  }

  // Si es hoy, actualizar las marcas
  actualizarEstiloGrados();
}

// Función para actualizar el estilo de los grados
function actualizarEstiloGrados() {
  const completados =
    JSON.parse(localStorage.getItem("asistenciasCompletadas")) || {};
  const gradoSelect = document.querySelector(".grado");

  if (!gradoSelect) return;

  const options = gradoSelect.querySelectorAll("option");

  options.forEach((option) => {
    if (option.value && completados[option.value]) {
      option.classList.add("asistencia-completada");
      option.dataset.completado = "true";
    } else {
      option.classList.remove("asistencia-completada");
      delete option.dataset.completado;
    }
  });
}

// Función para limpiar las marcas de asistencia
function limpiarMarcasAsistencias() {
  const gradoSelect = document.querySelector(".grado");
  if (!gradoSelect) return;

  const options = gradoSelect.querySelectorAll("option");
  options.forEach((option) => {
    option.classList.remove("asistencia-completada");
    delete option.dataset.completado;
  });
}

// Función para agregar un nuevo alumno
export async function agregarAlumno(
  nombre,
  apellido,
  grado,
  correo,
  contrasena
) {
  try {
    if (!nombre || !apellido || !grado || !correo || !contrasena) {
      throw new Error("Todos los campos son requeridos");
    }

    // Validar formato de email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      throw new Error("Formato de correo electrónico inválido");
    }

    // Validar longitud de contraseña
    if (contrasena.length < 8) {
      throw new Error("La contraseña debe tener al menos 8 caracteres");
    }

    const alumnoResponse = await fetch(
      "https://backend-listadoscl.onrender.com/alumnos",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          apellido,
          grado,
          email: correo,
          contraseña: contrasena, // En producción, esto debería estar hasheado
        }),
      }
    );

    if (!alumnoResponse.ok) {
      const errorData = await alumnoResponse.json();
      throw new Error(errorData.error || "Error al agregar alumno");
    }

    return await alumnoResponse.json();
  } catch (error) {
    console.error("Error al agregar alumno:", error);
    throw error;
  }
}

// Función para obtener alumnos básicos por grado
export async function obtenerAlumnosBasicosPorGrado(nombreGrado) {
  try {
    const gradoResponse = await fetch(
      `https://backend-listadoscl.onrender.com/grados/exacto/${encodeURIComponent(
        nombreGrado
      )}`
    );
    if (!gradoResponse.ok) throw new Error("Grado no encontrado");

    const gradoData = await gradoResponse.json();
    const alumnosResponse = await fetch(
      `https://backend-listadoscl.onrender.com/grados/${gradoData.id_grado}/alumnos`
    );
    if (!alumnosResponse.ok) throw new Error("Error al cargar alumnos");

    return await alumnosResponse.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Función para cargar asistencia guardada
export async function cargarAsistenciaGuardada(grado, fecha) {
  try {
    const response = await fetch(
      `https://backend-listadoscl.onrender.com/asistencia/grado/${encodeURIComponent(
        grado
      )}?fecha=${fecha}`
    );
    if (!response.ok) return null;

    const asistencias = await response.json();
    return asistencias;
  } catch (error) {
    console.error("Error cargando asistencia:", error);
    throw error;
  }
}

// Función para abrir modal de uniforme (versión corregida)
export function abrirModalUniforme(alumno) {
  // Verificar que el alumno tenga los datos necesarios
  if (!alumno || !alumno.id_alumno) {
    console.error("Datos del alumno incompletos:", alumno);
    return;
  }

  const alumnoItem = document.querySelector(
    `.alumno-item[data-id-alumno="${alumno.id_alumno}"]`
  );
  if (!alumnoItem) {
    console.error("No se encontró el elemento del alumno");
    return;
  }

  const modalContainer = document.getElementById("modal-container");
  if (!modalContainer) {
    console.error("No se encontró el contenedor de modales");
    return;
  }

  // Obtener datos actuales del uniforme
  const uniformeActual = alumnoItem.dataset.uniforme
    ? JSON.parse(alumnoItem.dataset.uniforme)
    : {
        zapatos: false,
        playera: false,
        pantalon: false,
        sueter: false,
        corte_pelo: false,
        observacion: "",
      };

  // Limpiar modal container
  modalContainer.innerHTML = "";

  // Crear estructura del modal
  const modal = document.createElement("div");
  modal.className = "modal active"; // Asegurar que está visible
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h3>Uniforme de ${alumno.nombre || "Alumno"}</h3>
      <div class="uniforme-checks">
        <label><input type="checkbox" id="zapatos" ${
          uniformeActual.zapatos ? "checked" : ""
        }> Zapatos</label><br>
        <label><input type="checkbox" id="playera" ${
          uniformeActual.playera ? "checked" : ""
        }> Playera</label><br>
        <label><input type="checkbox" id="pantalon" ${
          uniformeActual.pantalon ? "checked" : ""
        }> Pantalón</label><br>
        <label><input type="checkbox" id="sueter" ${
          uniformeActual.sueter ? "checked" : ""
        }> Suéter</label><br>
        <label><input type="checkbox" id="corte_pelo" ${
          uniformeActual.corte_pelo ? "checked" : ""
        }> Corte de pelo</label><br>
        <textarea id="observacion-uniforme" placeholder="Observaciones">${
          uniformeActual.observacion || ""
        }</textarea>
      </div>
      <button id="guardar-uniforme" class="btn-modal">Guardar</button>
    </div>
  `;

  // Agregar al DOM
  modalContainer.appendChild(modal);

  // Cerrar modal
  modal.querySelector(".close-modal").addEventListener("click", () => {
    modalContainer.innerHTML = "";
  });

  // Guardar cambios
  modal.querySelector("#guardar-uniforme").addEventListener("click", () => {
    const nuevoUniforme = {
      zapatos: document.getElementById("zapatos").checked,
      playera: document.getElementById("playera").checked,
      pantalon: document.getElementById("pantalon").checked,
      sueter: document.getElementById("sueter").checked,
      corte_pelo: document.getElementById("corte_pelo").checked,
      observacion: document.getElementById("observacion-uniforme").value,
    };

    alumnoItem.dataset.uniforme = JSON.stringify(nuevoUniforme);
    modalContainer.innerHTML = "";
  });
}

export async function abrirModalComentario(alumno) {
  if (!alumno || !alumno.id_alumno) {
    console.error("Datos del alumno incompletos:", alumno);
    return;
  }

  const alumnoItem = document.querySelector(
    `.alumno-item[data-id-alumno="${alumno.id_alumno}"]`
  );
  const modalContainer = document.getElementById("modal-container");

  if (!alumnoItem || !modalContainer) {
    console.error("Elementos del DOM no encontrados");
    return;
  }

  // Mostrar loader
  modalContainer.innerHTML = `
    <div class="modal active">
      <div class="modal-content">
        <p>Cargando datos del alumno...</p>
      </div>
    </div>
  `;

  try {
    // Obtener datos actualizados del alumno
    const alumnoData = await obtenerDatosAlumno(alumno.id_alumno);
    const nombreCompleto = `${alumnoData.nombre} ${alumnoData.apellido}`.trim();

    // Limpiar y crear el modal
    modalContainer.innerHTML = "";
    const modal = document.createElement("div");
    modal.className = "modal active";
    modal.innerHTML = crearHTMLModal(
      alumnoData,
      nombreCompleto,
      alumnoItem.dataset.comentario || ""
    );
    modalContainer.appendChild(modal);

    // Configurar eventos
    configurarEventosModal(
      modal,
      modalContainer,
      alumnoItem,
      alumnoData.email,
      nombreCompleto
    );
  } catch (error) {
    console.error("Error:", error);
    modalContainer.innerHTML = `
      <div class="modal active">
        <div class="modal-content">
          <span class="close-modal">&times;</span>
          <h3>Error</h3>
          <p>${error.message || "Error al cargar datos del alumno"}</p>
          <button class="btn-modal" onclick="document.getElementById('modal-container').innerHTML = ''">Cerrar</button>
        </div>
      </div>
    `;
    modalContainer
      .querySelector(".close-modal")
      .addEventListener("click", () => {
        modalContainer.innerHTML = "";
      });
  }
}

// Funciones auxiliares
function crearHTMLModal(alumnoData, nombreCompleto, comentarioActual) {
  const tieneEmail = !!alumnoData.email;

  return `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h3>Comentario para ${nombreCompleto || "Alumno"}</h3>
      <p class="grado-info">Grado: ${
        alumnoData.nombre_grado || "No especificado"
      }</p>
      
      <div class="form-group">
        <label for="comentario-modal">Comentario:</label>
        <textarea id="comentario-modal" rows="5">${comentarioActual}</textarea>
      </div>
      
      <div class="email-options">
        <label>
          <input type="checkbox" id="enviar-email" ${
            tieneEmail ? "" : "disabled"
          }>
          Enviar comentario por correo
        </label>
        ${
          tieneEmail
            ? `
          <div class="email-info">
            Se enviará a: <strong>${alumnoData.email}</strong>
          </div>`
            : `
          <div class="email-warning">
            No hay correo registrado para este alumno
          </div>`
        }
      </div>
      
      <div class="modal-buttons">
        <button id="guardar-comentario" class="btn-modal">Guardar</button>
        ${
          tieneEmail
            ? '<button id="guardar-enviar" class="btn-modal enviar-btn">Guardar y Enviar</button>'
            : ""
        }
      </div>
    </div>
  `;
}

function configurarEventosModal(
  modal,
  modalContainer,
  alumnoItem,
  emailAlumno,
  nombreAlumno
) {
  // Cerrar modal
  modal.querySelector(".close-modal").addEventListener("click", () => {
    modalContainer.innerHTML = "";
  });

  // Guardar comentario
  modal.querySelector("#guardar-comentario").addEventListener("click", () => {
    alumnoItem.dataset.comentario =
      modal.querySelector("#comentario-modal").value;
    modalContainer.innerHTML = "";
  });

  // Guardar y enviar
  if (emailAlumno) {
    modal
      .querySelector("#guardar-enviar")
      .addEventListener("click", async () => {
        const comentario = modal.querySelector("#comentario-modal").value;
        const enviarEmail = modal.querySelector("#enviar-email").checked;

        alumnoItem.dataset.comentario = comentario;

        if (enviarEmail) {
          const boton = modal.querySelector("#guardar-enviar");
          boton.textContent = "Enviando...";
          boton.disabled = true;

          try {
            await enviarComentarioPorEmail({
              email: emailAlumno,
              alumno: nombreAlumno,
              comentario: comentario,
            });
            alert("Comentario guardado y correo enviado con éxito");
          } catch (error) {
            alert(
              "Comentario guardado, pero hubo un error al enviar el correo"
            );
          }
        }
        modalContainer.innerHTML = "";
      });
  }
}

async function obtenerDatosAlumno(idAlumno) {
  const response = await fetch(
    `https://backend-listadoscl.onrender.com/alumnos/${idAlumno}`
  );
  if (!response.ok) {
    throw new Error((await response.text()) || "Error al obtener alumno");
  }
  return await response.json();
}

async function enviarComentarioPorEmail({ email, alumno, comentario }) {
  const response = await fetch(
    "https://backend-listadoscl.onrender.com/asistencia/enviar-email",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        destinatario: email,
        asunto: `Nuevo comentario sobre ${alumno}`,
        mensaje: `Estimado/a,\n\nSe ha registrado un nuevo comentario sobre el alumno ${alumno}:\n\n${comentario}\n\n--\nSistema de Gestión Escolar`,
      }),
    }
  );

  if (!response.ok) {
    throw new Error((await response.text()) || "Error al enviar correo");
  }
  return await response.json();
}
