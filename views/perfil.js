import { isAdmin } from "./aunt.js";

async function fetchDatosUsuario(idUsuario) {
  try {
    if (!idUsuario) {
      console.error("ID de usuario no proporcionado");
      throw new Error("ID de usuario inválido");
    }

    const endpoint = isAdmin()
      ? `https://backend-listadoscl.onrender.com/perfil/admin/${idUsuario}`
      : `https://backend-listadoscl.onrender.com/perfil/profesor/${idUsuario}`;

    console.log(`Fetching user data from: ${endpoint}`);
    const response = await fetch(endpoint);

    if (!response.ok) {
      console.error(`Error en respuesta: ${response.status}`);
      throw new Error("Error al obtener datos del usuario");
    }

    const data = await response.json();
    console.log("Datos del usuario recibidos:", data);
    return data;
  } catch (error) {
    console.error("Error en fetchDatosUsuario:", error);
    return {
      nombre: "Error",
      apellido: "",
      email: "No se pudo cargar la información",
      nombre_grado: "No asignado",
      id_grado_asignado: null,
      rol: isAdmin() ? "Administrador" : "Profesor",
    };
  }
}

async function Perfil(usuarioData) {
  console.log("Iniciando creación de perfil con datos:", usuarioData);

  if (!usuarioData || !usuarioData.id) {
    console.error("Datos de usuario inválidos o falta id");
    const errorSection = document.createElement("section");
    errorSection.className = "perfil error";
    errorSection.innerHTML = `
      <div class="error-message">
        <h3>Error en los datos</h3>
        <p>No se proporcionó un ID de usuario válido.</p>
      </div>
    `;
    return errorSection;
  }

  let perfilSection = document.createElement("section");
  perfilSection.className = "perfil";

  try {
    const userData = await fetchDatosUsuario(usuarioData.id);
    console.log("Datos del usuario a mostrar:", userData);

    const perfilContainer = document.createElement("div");
    perfilContainer.className = "perfil-container";

    // Contenido principal del perfil
    const perfilContent = document.createElement("div");
    perfilContent.className = "perfil-content";

    // Sección de foto
    const fotoSection = document.createElement("div");
    fotoSection.className = "perfil-foto";

    const fotoImg = document.createElement("img");
    fotoImg.src =
      userData.foto ||
      "https://cdn-icons-png.flaticon.com/512/12225/12225881.png";
    fotoImg.alt = "Foto de perfil";
    fotoImg.id = "fotoPerfil";

    const btnCambiarFoto = document.createElement("button");
    btnCambiarFoto.className = "btn-cambiar-foto";
    btnCambiarFoto.textContent = "Cambiar Foto";
    btnCambiarFoto.style.display = isAdmin() ? "none" : "block";

    fotoSection.appendChild(fotoImg);
    fotoSection.appendChild(btnCambiarFoto);

    // Sección de datos
    const datosSection = document.createElement("div");
    datosSection.className = "perfil-datos";

    const nombreCompleto = document.createElement("h3");
    nombreCompleto.textContent = `${userData.nombre || "Usuario"} ${
      userData.apellido || ""
    }`;

    const rolElement = document.createElement("p");
    rolElement.innerHTML = `<strong>Rol:</strong> ${
      userData.rol || (isAdmin() ? "Administrador" : "Profesor")
    }`;

    const emailElement = document.createElement("p");
    emailElement.innerHTML = `<strong>Email:</strong> ${
      userData.email || "No especificado"
    }`;

    datosSection.appendChild(nombreCompleto);
    datosSection.appendChild(rolElement);
    datosSection.appendChild(emailElement);

    if (!isAdmin()) {
      const gradoElement = document.createElement("p");
      gradoElement.innerHTML = `<strong>Grado Asignado:</strong> ${
        userData.nombre_grado || "No asignado"
      }`;
      datosSection.appendChild(gradoElement);
    }

    const btnEditar = document.createElement("button");
    btnEditar.className = "btn-editar";
    btnEditar.textContent = "Editar Datos";
    datosSection.appendChild(btnEditar);

    perfilContent.appendChild(fotoSection);
    perfilContent.appendChild(datosSection);
    perfilContainer.appendChild(perfilContent);

    // Sección de estadísticas (solo para profesores con grado asignado)
    if (!isAdmin() && userData.id_grado_asignado) {
      const estadisticasSection = document.createElement("div");
      estadisticasSection.className = "perfil-estadisticas";

      const tituloEstadisticas = document.createElement("h3");
      tituloEstadisticas.textContent = "Datos Estadísticos del Grado";
      estadisticasSection.appendChild(tituloEstadisticas);

      const estadisticasGrid = document.createElement("div");
      estadisticasGrid.className = "estadisticas-grid";

      // Item de grado asignado
      const gradoItem = document.createElement("div");
      gradoItem.className = "estadistica-item";
      gradoItem.innerHTML = `
        <span class="estadistica-valor">${userData.nombre_grado || "N/A"}</span>
        <span class="estadistica-label">Grado Asignado</span>
      `;
      estadisticasGrid.appendChild(gradoItem);

      try {
        const asistenciaData = await fetchEstadisticasAsistencia(
          userData.id_grado_asignado
        );
        if (asistenciaData) {
          // Agregar estadísticas de asistencia
          const alumnosItem = document.createElement("div");
          alumnosItem.className = "estadistica-item";
          alumnosItem.innerHTML = `
            <span class="estadistica-valor">${
              asistenciaData.totalAlumnos || 0
            }</span>
            <span class="estadistica-label">Alumnos Registrados</span>
          `;
          estadisticasGrid.appendChild(alumnosItem);

          const presentesItem = document.createElement("div");
          presentesItem.className = "estadistica-item";
          presentesItem.innerHTML = `
            <span class="estadistica-valor">${
              asistenciaData.presentes || 0
            }</span>
            <span class="estadistica-label">Presentes</span>
          `;
          estadisticasGrid.appendChild(presentesItem);

          const ausentesItem = document.createElement("div");
          ausentesItem.className = "estadistica-item";
          ausentesItem.innerHTML = `
            <span class="estadistica-valor">${
              asistenciaData.ausentes || 0
            }</span>
            <span class="estadistica-label">Ausentes</span>
          `;
          estadisticasGrid.appendChild(ausentesItem);

          // Visualización de asistencia
          const visualizacionesContainer = document.createElement("div");
          visualizacionesContainer.className = "visualizaciones-container";

          const asistenciaContainer = document.createElement("div");
          asistenciaContainer.className = "visualizacion-asistencia-container";

          crearVisualizacionAsistencia(asistenciaContainer, asistenciaData);
          visualizacionesContainer.appendChild(asistenciaContainer);

          const uniformeData = await fetchEstadisticasUniforme(
            userData.id_grado_asignado
          );
          if (uniformeData) {
            const uniformeContainer = document.createElement("div");
            uniformeContainer.className = "visualizacion-uniforme-container";
            crearVisualizacionUniforme(uniformeContainer, uniformeData);
            visualizacionesContainer.appendChild(uniformeContainer);
          }

          estadisticasSection.appendChild(estadisticasGrid);
          estadisticasSection.appendChild(visualizacionesContainer);
        }
      } catch (error) {
        console.error("Error al obtener estadísticas:", error);
        const errorElem = document.createElement("div");
        errorElem.className = "error-message";
        errorElem.textContent = "Error al cargar estadísticas del grado";
        estadisticasSection.appendChild(errorElem);
      }

      perfilContainer.appendChild(estadisticasSection);
    } else if (!isAdmin()) {
      const noGradoElem = document.createElement("div");
      noGradoElem.className = "info-message";
      noGradoElem.textContent =
        "No hay grado asignado para mostrar estadísticas";
      perfilContainer.appendChild(noGradoElem);
    }

    perfilSection.appendChild(perfilContainer);
  } catch (error) {
    console.error("Error crítico al crear perfil:", error);
    perfilSection.innerHTML = `
      <div class="error-message">
        <h3>Error inesperado</h3>
        <p>Ocurrió un error al cargar el perfil. Por favor recarga la página.</p>
        <p>${error.message}</p>
      </div>
    `;
  }

  return perfilSection;
}

// Funciones para obtener estadísticas
async function fetchEstadisticasAsistencia(idGrado) {
  try {
    console.log(`Fetching asistencia data for grado ID: ${idGrado}`);
    const response = await fetch(
      `https://backend-listadoscl.onrender.com/perfil/grado/${idGrado}/asistencia`
    );

    if (!response.ok) {
      console.error(`Error en respuesta: ${response.status}`);
      throw new Error("Error al obtener estadísticas de asistencia");
    }

    const data = await response.json();
    console.log("Datos de asistencia recibidos:", data);
    return data;
  } catch (error) {
    console.error("Error en fetchEstadisticasAsistencia:", error);
    return null;
  }
}

async function fetchEstadisticasUniforme(idGrado) {
  try {
    console.log(`Fetching uniforme data for grado ID: ${idGrado}`);
    const response = await fetch(
      `https://backend-listadoscl.onrender.com/perfil/grado/${idGrado}/uniforme`
    );

    if (!response.ok) {
      console.error(`Error en respuesta: ${response.status}`);
      throw new Error("Error al obtener estadísticas de uniforme");
    }

    const data = await response.json();
    console.log("Datos de uniforme recibidos:", data);
    return data;
  } catch (error) {
    console.error("Error en fetchEstadisticasUniforme:", error);
    return null;
  }
}

// Funciones para crear visualizaciones
function crearVisualizacionAsistencia(container, data) {
  if (!container || !data) return;

  const vizContainer = document.createElement("div");
  vizContainer.className = "visualizacion-asistencia";

  const titulo = document.createElement("h4");
  titulo.textContent = `Asistencia (${
    data.porcentajePresentes || 0
  }% presentes)`;
  vizContainer.appendChild(titulo);

  // Gráfica de barras horizontal
  const barContainer = document.createElement("div");
  barContainer.className = "bar-container";

  const barPresentes = document.createElement("div");
  barPresentes.className = "bar presentes";
  barPresentes.style.width = `${data.porcentajePresentes || 0}%`;
  barPresentes.title = `Presentes: ${data.presentes || 0} (${
    data.porcentajePresentes || 0
  }%)`;

  const barAusentes = document.createElement("div");
  barAusentes.className = "bar ausentes";
  barAusentes.style.width = `${data.porcentajeAusentes || 0}%`;
  barAusentes.title = `Ausentes: ${data.ausentes || 0} (${
    data.porcentajeAusentes || 0
  }%)`;

  barContainer.appendChild(barPresentes);
  barContainer.appendChild(barAusentes);
  vizContainer.appendChild(barContainer);

  // Leyenda
  const leyenda = document.createElement("div");
  leyenda.className = "leyenda";

  const leyendaPresentes = document.createElement("span");
  leyendaPresentes.innerHTML = `<span class="color-box presentes"></span> Presentes`;

  const leyendaAusentes = document.createElement("span");
  leyendaAusentes.innerHTML = `<span class="color-box ausentes"></span> Ausentes`;

  leyenda.appendChild(leyendaPresentes);
  leyenda.appendChild(document.createTextNode(" "));
  leyenda.appendChild(leyendaAusentes);
  vizContainer.appendChild(leyenda);

  container.appendChild(vizContainer);
}

function crearVisualizacionUniforme(container, data) {
  if (!container || !data) return;

  const vizContainer = document.createElement("div");
  vizContainer.className = "visualizacion-uniforme";

  const titulo = document.createElement("h4");
  titulo.textContent = "Incumplimiento de Uniforme";
  vizContainer.appendChild(titulo);

  // Gráfica de barras vertical
  const itemsContainer = document.createElement("div");
  itemsContainer.className = "uniforme-items";

  const items = [
    { label: "Zapatos", value: data.zapatos || 0 },
    { label: "Playera", value: data.playera || 0 },
    { label: "Pantalón", value: data.pantalon || 0 },
    { label: "Suéter", value: data.sueter || 0 },
    { label: "Corte Pelo", value: data.corte_pelo || 0 },
  ];

  items.forEach((item) => {
    const itemContainer = document.createElement("div");
    itemContainer.className = "uniforme-item";

    const label = document.createElement("div");
    label.className = "uniforme-label";
    label.textContent = item.label;

    const barContainer = document.createElement("div");
    barContainer.className = "uniforme-bar-container";

    const bar = document.createElement("div");
    bar.className = "uniforme-bar";
    bar.style.height = `${item.value}%`;
    bar.title = `${item.value}% correcto`;

    const value = document.createElement("div");
    value.className = "uniforme-value";
    value.textContent = `${item.value}%`;

    barContainer.appendChild(bar);
    itemContainer.appendChild(label);
    itemContainer.appendChild(barContainer);
    itemContainer.appendChild(value);
    itemsContainer.appendChild(itemContainer);
  });

  vizContainer.appendChild(itemsContainer);
  container.appendChild(vizContainer);
}

export { Perfil };
