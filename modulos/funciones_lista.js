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

    // 2. Obtener los alumnos del grado
    const alumnosResponse = await fetch(
      `http://localhost:3000/grados/${idGrado}/alumnos`
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

      contInputs.appendChild(estadoSelect);

      alumnoItem.appendChild(nombreElement);
      alumnoItem.appendChild(contInputs);

      contenedor.appendChild(alumnoItem);
    });
  } catch (error) {
    console.error("Error al cargar alumnos:", error);
    throw error;
  }
}

// Función para guardar la asistencia
export async function guardarAsistencia(contenedor, nombreGrado, fecha) {
  try {
    // 1. Obtener el ID del grado
    const gradoResponse = await fetch(
      `http://localhost:3000/grados/exacto/${encodeURIComponent(nombreGrado)}`
    );

    if (!gradoResponse.ok) {
      throw new Error("Error al obtener el grado");
    }

    const gradoData = await gradoResponse.json();
    const idGrado = gradoData.id_grado;

    // 2. Recoger los datos de asistencia
    const asistencias = [];
    const alumnosItems = contenedor.querySelectorAll(".alumno-item");

    if (alumnosItems.length === 0) {
      throw new Error("No hay alumnos para guardar");
    }

    alumnosItems.forEach((item) => {
      const estadoSelect = item.querySelector(".estado-asistencia");
      const comentario = item.dataset.comentario || null;

      asistencias.push({
        id_alumno: parseInt(estadoSelect.dataset.idAlumno),
        fecha: fecha,
        estado: estadoSelect.value,
        comentario: comentario,
      });
    });

    // 3. Enviar datos al backend
    const saveResponse = await fetch("http://localhost:3000/asistencia/batch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ asistencias }),
    });

    if (!saveResponse.ok) {
      throw new Error("Error al guardar asistencia");
    }

    return await saveResponse.json();
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
    if (!response.ok) return null; // No hay asistencia guardada

    const asistencias = await response.json();
    return asistencias;
  } catch (error) {
    console.error("Error cargando asistencia:", error);
    throw error;
  }
}
