// Función para cargar grados desde el backend
export async function cargarGrados(selectElement) {
  try {
    const response = await fetch("http://localhost:3000/grados");
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
      `http://localhost:3000/grados/exacto/${encodeURIComponent(nombreGrado)}`
    );

    if (!gradoResponse.ok) {
      throw new Error(await gradoResponse.text());
    }

    const gradoData = await gradoResponse.json();
    const idGrado = gradoData.id_grado;

    // 2. Obtener los alumnos del grado con sus uniformes
    const alumnosResponse = await fetch(
      `http://localhost:3000/grados/${idGrado}/alumnos?fecha=${fecha}`
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
      `http://localhost:3000/grados/exacto/${encodeURIComponent(nombreGrado)}`
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
    const response = await fetch("http://localhost:3000/asistencia/batch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ asistencias }),
    });

    if (!response.ok) throw new Error("Error al guardar asistencia");

    return await response.json();
  } catch (error) {
    console.error("Error al guardar asistencia:", error);
    throw error;
  }
}

// Función para agregar un nuevo alumno
export async function agregarAlumno(nombreCompleto, gradoSeleccionado) {
  try {
    const [nombre, ...apellidos] = nombreCompleto.split(" ");
    const apellido = apellidos.join(" ");

    if (!nombre || !apellido) {
      throw new Error("Formato incorrecto. Usa: Nombre Apellido");
    }

    const alumnoResponse = await fetch("http://localhost:3000/alumnos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre,
        apellido,
        grado: gradoSeleccionado,
      }),
    });

    if (!alumnoResponse.ok) {
      throw new Error("Error al agregar alumno");
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
      `http://localhost:3000/grados/exacto/${encodeURIComponent(nombreGrado)}`
    );
    if (!gradoResponse.ok) throw new Error("Grado no encontrado");

    const gradoData = await gradoResponse.json();
    const alumnosResponse = await fetch(
      `http://localhost:3000/grados/${gradoData.id_grado}/alumnos`
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
      `http://localhost:3000/asistencia/grado/${encodeURIComponent(
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

// Función para abrir modal de uniforme (para usar en lista.js)
export function abrirModalUniforme(alumno) {
  const alumnoItem = document.querySelector(
    `.alumno-item[data-id-alumno="${alumno.id_alumno}"]`
  );
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

  const modalContainer = document.getElementById("modal-container");
  modalContainer.innerHTML = "";

  const fondo = document.createElement("div");
  fondo.className = "modal";

  const contenido = document.createElement("div");
  contenido.className = "modal-content";
  contenido.innerHTML = `
    <h3>Uniforme de ${alumno.nombre}</h3>
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
    <button id="guardar-uniforme">Guardar</button>
    <button id="cerrar-modal">Cerrar</button>
  `;

  fondo.appendChild(contenido);
  modalContainer.appendChild(fondo);

  document.getElementById("guardar-uniforme").addEventListener("click", () => {
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

  document.getElementById("cerrar-modal").addEventListener("click", () => {
    modalContainer.innerHTML = "";
  });
}

// Función para abrir modal de comentario (para usar en lista.js)
export function abrirModalComentario(alumno) {
  const alumnoItem = document.querySelector(
    `.alumno-item[data-id-alumno="${alumno.id_alumno}"]`
  );
  const comentarioActual = alumnoItem.dataset.comentario || "";

  const modalContainer = document.getElementById("modal-container");
  modalContainer.innerHTML = "";

  const fondo = document.createElement("div");
  fondo.className = "modal";

  const contenido = document.createElement("div");
  contenido.className = "modal-content";
  contenido.innerHTML = `
    <h3>Comentario para ${alumno.nombre}</h3>
    <textarea id="comentario-modal" style="width:90%; height:80px;">${comentarioActual}</textarea><br>
    <button id="guardar-comentario">Guardar</button>
    <button id="cerrar-modal">Cerrar</button>
  `;

  fondo.appendChild(contenido);
  modalContainer.appendChild(fondo);

  document
    .getElementById("guardar-comentario")
    .addEventListener("click", () => {
      const nuevoComentario = document.getElementById("comentario-modal").value;
      alumnoItem.dataset.comentario = nuevoComentario;
      modalContainer.innerHTML = "";
    });

  document.getElementById("cerrar-modal").addEventListener("click", () => {
    modalContainer.innerHTML = "";
  });
}
