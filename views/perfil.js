async function fetchDatosProfesor(idProfesor) {
  try {
    if (!idProfesor) {
      console.error("ID de profesor no proporcionado");
      throw new Error("ID de profesor inválido");
    }

    console.log(`Fetching profesor data for ID: ${idProfesor}`);
    const response = await fetch(
      `https://backend-listadoscl.onrender.com/perfil/profesor/${idProfesor}`
    );

    if (!response.ok) {
      console.error(`Error en respuesta: ${response.status}`);
      throw new Error("Error al obtener datos del profesor");
    }

    const data = await response.json();
    console.log("Datos del profesor recibidos:", data);
    return data;
  } catch (error) {
    console.error("Error en fetchDatosProfesor:", error);
    return {
      nombre: "Error",
      apellido: "",
      email: "No se pudo cargar la información",
      nombre_grado: "No asignado",
      id_grado_asignado: null,
    };
  }
}

async function Perfil(usuarioData) {
  console.log("Iniciando creación de perfil con datos:", usuarioData);

  // Verificar que usuarioData tenga id_profesor
  if (!usuarioData || !usuarioData.id_profesor) {
    console.error("Datos de usuario inválidos o falta id_profesor");
    const errorSection = document.createElement("section");
    errorSection.className = "perfil error";
    errorSection.innerHTML = `
      <div class="error-message">
        <h3>Error en los datos</h3>
        <p>No se proporcionó un ID de profesor válido.</p>
      </div>
    `;
    return errorSection;
  }

  let perfilSection = document.createElement("section");
  perfilSection.className = "perfil";

  try {
    const profesorData = await fetchDatosProfesor(usuarioData.id_profesor);
    console.log("Datos del profesor a mostrar:", profesorData);

    const perfilContainer = document.createElement("div");
    perfilContainer.className = "perfil-container";

    const perfilContent = document.createElement("div");
    perfilContent.className = "perfil-content";

    // Sección de foto
    const fotoSection = document.createElement("div");
    fotoSection.className = "perfil-foto";

    const fotoImg = document.createElement("img");
    fotoImg.src = "https://cdn-icons-png.flaticon.com/512/12225/12225881.png";
    fotoImg.alt = "Foto de perfil";
    fotoImg.id = "fotoPerfil";

    const btnCambiarFoto = document.createElement("button");
    btnCambiarFoto.className = "btn-cambiar-foto";
    btnCambiarFoto.textContent = "Cambiar Foto";

    fotoSection.appendChild(fotoImg);
    fotoSection.appendChild(btnCambiarFoto);

    // Sección de datos
    const datosSection = document.createElement("div");
    datosSection.className = "perfil-datos";

    datosSection.innerHTML = `
      <h3>${profesorData.nombre || "Profesor"} ${
      profesorData.apellido || ""
    }</h3>
      <p><strong>Email:</strong> ${profesorData.email || "No especificado"}</p>
      <p><strong>Grado Asignado:</strong> ${
        profesorData.nombre_grado || "No asignado"
      }</p>
    `;

    const btnEditar = document.createElement("button");
    btnEditar.className = "btn-editar";
    btnEditar.textContent = "Editar Datos";
    datosSection.appendChild(btnEditar);

    perfilContent.appendChild(fotoSection);
    perfilContent.appendChild(datosSection);

    // Sección de estadísticas
    const estadisticasSection = document.createElement("div");
    estadisticasSection.className = "perfil-estadisticas";
    estadisticasSection.innerHTML = `
      <h3>Datos Estadísticos del Grado</h3>
      <div class="estadisticas-grid"></div>
      <div class="visualizaciones-container">
        <div class="visualizacion-asistencia-container"></div>
        <div class="visualizacion-uniforme-container"></div>
      </div>
    `;

    const estadisticasGrid =
      estadisticasSection.querySelector(".estadisticas-grid");

    // Items de estadísticas básicas
    const estadisticasData = [
      { label: "Grado Asignado", value: profesorData.nombre_grado || "N/A" },
    ];

    estadisticasData.forEach((item) => {
      const itemElement = document.createElement("div");
      itemElement.className = "estadistica-item";
      itemElement.innerHTML = `
        <span class="estadistica-valor">${item.value}</span>
        <span class="estadistica-label">${item.label}</span>
      `;
      estadisticasGrid.appendChild(itemElement);
    });

    // Solo intentar obtener estadísticas si hay grado asignado
    if (profesorData.id_grado_asignado) {
      try {
        const asistenciaData = await fetchEstadisticasAsistencia(
          profesorData.id_grado_asignado
        );
        if (asistenciaData) {
          crearVisualizacionAsistencia(
            estadisticasSection.querySelector(
              ".visualizacion-asistencia-container"
            ),
            asistenciaData
          );

          // Agregar estadísticas adicionales
          const estadisticasAdicionales = [
            {
              label: "Alumnos Registrados",
              value: asistenciaData.totalAlumnos || 0,
            },
            { label: "Presentes", value: asistenciaData.presentes || 0 },
            { label: "Ausentes", value: asistenciaData.ausentes || 0 },
          ];

          estadisticasAdicionales.forEach((item) => {
            const elem = document.createElement("div");
            elem.className = "estadistica-item";
            elem.innerHTML = `
              <span class="estadistica-valor">${item.value}</span>
              <span class="estadistica-label">${item.label}</span>
            `;
            estadisticasGrid.appendChild(elem);
          });
        }

        const uniformeData = await fetchEstadisticasUniforme(
          profesorData.id_grado_asignado
        );
        if (uniformeData) {
          crearVisualizacionUniforme(
            estadisticasSection.querySelector(
              ".visualizacion-uniforme-container"
            ),
            uniformeData
          );
        }
      } catch (error) {
        console.error("Error al obtener estadísticas:", error);
        const errorElem = document.createElement("div");
        errorElem.className = "error-message";
        errorElem.textContent = "Error al cargar estadísticas del grado";
        estadisticasSection.appendChild(errorElem);
      }
    } else {
      const noGradoElem = document.createElement("div");
      noGradoElem.className = "info-message";
      noGradoElem.textContent =
        "No hay grado asignado para mostrar estadísticas";
      estadisticasSection.appendChild(noGradoElem);
    }

    perfilContainer.appendChild(perfilContent);
    perfilContainer.appendChild(estadisticasSection);
    perfilSection.appendChild(perfilContainer);
  } catch (error) {
    console.error("Error crítico al crear perfil:", error);
    perfilSection.innerHTML = `
      <div class="error-message">
        <h3>Error inesperado</h3>
        <p>Ocurrió un error al cargar el perfil. Por favor recarga la página.</p>
      </div>
    `;
  }

  return perfilSection;
}

// Funciones para obtener estadísticas (agregar al inicio del archivo)
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

// Funciones para crear visualizaciones (agregar antes de la función Perfil)
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
