function identify(callback) {
  let identifyContainer = document.createElement("div");
  identifyContainer.className = "identify";

  let content_identify = document.createElement("div");
  content_identify.className = "content_identify";
  identifyContainer.appendChild(content_identify);

  let title = document.createElement("h1");
  title.className = "title";
  title.textContent = "¿Cuál es tu rol?";
  content_identify.appendChild(title);

  // Crear el select con las opciones de rol
  const rolSelect = document.createElement("select");
  rolSelect.className = "estado-identify";

  const opciones = [
    { value: "admin", text: "Admin" },
    { value: "profesor", text: "Profesor" },
    { value: "alumno", text: "Alumno", selected: true },
  ];

  opciones.forEach((opcion) => {
    const optionElement = document.createElement("option");
    optionElement.value = opcion.value;
    optionElement.textContent = opcion.text;
    if (opcion.selected) optionElement.selected = true;
    rolSelect.appendChild(optionElement);
  });

  content_identify.appendChild(rolSelect);

  // Crear botón de confirmar
  let button_confirmar = document.createElement("button");
  button_confirmar.className = "button_confirmar";
  button_confirmar.textContent = "Confirmar";

  // Añadir el evento de callback al botón confirmar
  button_confirmar.addEventListener("click", function () {
    // Puedes pasar el valor seleccionado si lo necesitas
    const selectedRole = rolSelect.value;
    callback(selectedRole);
  });

  content_identify.appendChild(button_confirmar);

  return identifyContainer;
}

export { identify };
