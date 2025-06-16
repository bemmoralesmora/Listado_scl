function Perfil(usuarioData) {
  let Perfil = document.createElement("section");
  Perfil.className = "perfil";

  const perfilContainer = document.createElement("div");
  perfilContainer.className = "perfil-container";

  const perfilHeader = document.createElement("div");
  perfilHeader.className = "perfil-header";
  perfilHeader.innerHTML = `<h2>Perfil del Usuario</h2>`;

  const perfilContent = document.createElement("div");
  perfilContent.className = "perfil-content";

  const fotoSection = document.createElement("div");
  fotoSection.className = "perfil-foto";

  const fotoImg = document.createElement("img");
  fotoImg.src = "";
  fotoImg.alt = "Foto de perfil";
  fotoImg.id = "fotoPerfil";

  const btnCambiarFoto = document.createElement("button");
  btnCambiarFoto.className = "btn-cambiar-foto";
  btnCambiarFoto.textContent = "Cambiar Foto";

  fotoSection.appendChild(fotoImg);
  fotoSection.appendChild(btnCambiarFoto);

  //Sección de datos
  const datosSection = document.createElement("div");
  datosSection.className = "perfil-datos";

  datosSection.innerHTML = `
        <h3>${usuarioData.nombre || "Profesor"}</h3>
        <p><strong>Email:</strong> ${usuarioData.email || "No especificado"}</p>
        <p><strong>Grado Asignado:</strong> ${
          usuarioData.gradoAsignado || "No asignado"
        }</p>
    `;

  const btnEditar = document.createElement("button");
  btnEditar.className = "btn-editar";
  btnEditar.textContent = "Editar Datos";
  datosSection.appendChild(btnEditar);

  perfilContent.appendChild(fotoSection);
  perfilContent.appendChild(datosSection);

  //Sección de estadísticas
  const estadisticasSection = document.createElement("div");
  estadisticasSection.className = "perfil-estadisticas";

  estadisticasSection.innerHTML = `
        <h3>Datos Estadísticos del Grado</h3>
        <div class="estadisticas-grid"></div>
    `;

  const estadisticasGrid =
    estadisticasSection.querySelector(".estadisticas-grid");

  //Items de estadísticas
  const estadisticasData = [
    {
      label: "Alumnos Registrados",
      value: usuarioData.estadisticas?.alumnosRegistrados || 0,
    },
    { label: "Aprobados", value: usuarioData.estadisticas?.aprobados || 0 },
    { label: "Reprobados", value: usuarioData.estadisticas?.reprobados || 0 },
    {
      label: "Promedio General",
      value: usuarioData.estadisticas?.promedioGeneral || 0,
    },
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

  perfilContainer.appendChild(perfilHeader);
  perfilContainer.appendChild(perfilContent);
  perfilContainer.appendChild(estadisticasSection);

  Perfil.appendChild(perfilContainer);

  btnCambiarFoto.addEventListener("click", () => {
    console.log("Cambiar foto implementación");
  });

  btnEditar.addEventListener("click", () => {
    console.log("Editar datos implementación");
  });

  return Perfil;
}

export { Perfil };
