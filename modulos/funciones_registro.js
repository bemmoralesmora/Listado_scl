// Función para crear el componente de búsqueda
export function crearComponenteBusqueda() {
  let searchLabel = document.createElement("label");

  // Icono de búsqueda
  let searchIcon = document.createElement("i");
  searchIcon.className = "fas fa-search";
  searchLabel.appendChild(searchIcon);

  // Input de búsqueda
  let searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Busca un alumno";
  searchInput.className = "input-fecha-r";
  searchLabel.appendChild(searchInput);

  // Botón de búsqueda
  let buscar = document.createElement("button");
  buscar.className = "buscar";
  buscar.textContent = "Buscar";
  searchLabel.appendChild(buscar);

  return { searchLabel, searchInput, buscar };
}

// Función para crear el componente de estadísticas
export function crearComponenteEstadisticas() {
  let datosAlumno = document.createElement("div");
  datosAlumno.className = "datos_alumno";

  let ausentesBox = document.createElement("div");
  ausentesBox.className = "stat-box";
  ausentesBox.innerHTML = `
        <span class="stat-label">Ausentes</span>
        <span class="stat-value">0</span>
    `;

  let presentesBox = document.createElement("div");
  presentesBox.className = "stat-box";
  presentesBox.innerHTML = `
        <span class="stat-label">Presentes</span>
        <span class="stat-value">0</span>
    `;

  let justificadosBox = document.createElement("div");
  justificadosBox.className = "stat-box";
  justificadosBox.innerHTML = `
        <span class="stat-label">Justificados</span>
        <span class="stat-value">0</span>
    `;

  let totalBox = document.createElement("div");
  totalBox.className = "stat-box";
  totalBox.innerHTML = `
        <span class="stat-label">Total</span>
        <span class="stat-value">0</span>
    `;

  datosAlumno.appendChild(presentesBox);
  datosAlumno.appendChild(ausentesBox);
  datosAlumno.appendChild(justificadosBox);
  datosAlumno.appendChild(totalBox);

  return { datosAlumno, presentesBox, ausentesBox, justificadosBox, totalBox };
}

// Función para manejar la búsqueda (modificada para devolver el alumno encontrado)
export async function manejarBusqueda(
  nombre,
  buscar,
  presentesBox,
  ausentesBox,
  justificadosBox,
  totalBox
) {
  if (nombre.length < 3) {
    alert("Ingresa al menos 3 caracteres para buscar");
    return null; // Devuelve null cuando no hay búsqueda válida
  }

  try {
    buscar.disabled = true;
    buscar.textContent = "Buscando...";

    const response = await fetch(
      `https://backend-listadoscl.onrender.com/asistencia/buscar?nombre=${encodeURIComponent(
        nombre
      )}`
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error en la búsqueda");
    }

    if (data.length === 0) {
      throw new Error("No se encontraron alumnos");
    }

    // Mostrar resultados del primer alumno encontrado
    const alumno = data[0];
    presentesBox.querySelector(".stat-value").textContent =
      alumno.total_presentes || "0";
    ausentesBox.querySelector(".stat-value").textContent =
      alumno.total_ausentes || "0";
    justificadosBox.querySelector(".stat-value").textContent =
      alumno.total_justificados || "0";
    totalBox.querySelector(".stat-value").textContent =
      alumno.total_asistencias || "0";

    return alumno; // Devuelve el alumno encontrado
  } catch (error) {
    console.error("Error:", error);
    // Restablecer valores a 0 en caso de error
    presentesBox.querySelector(".stat-value").textContent = "0";
    ausentesBox.querySelector(".stat-value").textContent = "0";
    justificadosBox.querySelector(".stat-value").textContent = "0";
    totalBox.querySelector(".stat-value").textContent = "0";

    alert(error.message);
    return null; // Devuelve null en caso de error
  } finally {
    buscar.disabled = false;
    buscar.textContent = "Buscar";
  }
}
