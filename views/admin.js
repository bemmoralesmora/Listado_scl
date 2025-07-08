function admin() {
  let adminSection = document.createElement("div");
  adminSection.className = "admin";

  // Cabecera de administración
  const header = document.createElement("h2");
  header.textContent = "Panel de Administración";
  adminSection.appendChild(header);

  // Contenedor de opciones
  const optionsContainer = document.createElement("div");
  optionsContainer.className = "admin-options";

  // Opción 1: Gestión de Usuarios
  const userManagement = createAdminOption(
    "👥 Gestión de profesores",
    "Administra los profesores del sistema"
  );
  userManagement.addEventListener("click", showTeacherManagement);
  optionsContainer.appendChild(userManagement);

  // Opción 2: Configuración
  const settings = createAdminOption("⚙️ Configuración", "Ajustes del sistema");
  optionsContainer.appendChild(settings);

  // Opción 3: Estadísticas
  const stats = createAdminOption(
    "📊 Estadísticas",
    "Visualiza datos del sistema"
  );
  optionsContainer.appendChild(stats);

  adminSection.appendChild(optionsContainer);

  return adminSection;
}

function showTeacherManagement() {
  // Crear el overlay
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  // Crear la ventana flotante
  const modal = document.createElement("div");
  modal.className = "teacher-modal";

  // Título de la ventana
  const title = document.createElement("h2");
  title.textContent = "Gestión de Profesores";
  modal.appendChild(title);

  // Lista de profesores (datos simulados)
  const teachers = [
    { id: 1, name: "María García", grade: "Matemáticas 10°" },
    { id: 2, name: "Carlos López", grade: "Ciencias 8°" },
    { id: 3, name: "Ana Martínez", grade: "Literatura 11°" },
    { id: 4, name: "Pedro Sánchez", grade: "Historia 9°" },
  ];

  // Crear tabla para mostrar profesores
  const table = document.createElement("table");
  table.className = "teachers-table";

  // Cabecera de la tabla
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const thName = document.createElement("th");
  thName.textContent = "Nombre";

  const thGrade = document.createElement("th");
  thGrade.textContent = "Grado Asignado";

  const thActions = document.createElement("th");
  thActions.textContent = "Acciones";

  headerRow.appendChild(thName);
  headerRow.appendChild(thGrade);
  headerRow.appendChild(thActions);
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Cuerpo de la tabla
  const tbody = document.createElement("tbody");

  teachers.forEach((teacher) => {
    const row = document.createElement("tr");

    const tdName = document.createElement("td");
    tdName.textContent = teacher.name;

    const tdGrade = document.createElement("td");
    tdGrade.textContent = teacher.grade;

    const tdActions = document.createElement("td");

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-delete";
    deleteBtn.textContent = "Eliminar";

    deleteBtn.addEventListener("click", () => {
      verifyAdminPassword().then((verified) => {
        if (verified) {
          row.style.backgroundColor = "#ffebee";
          setTimeout(() => {
            tbody.removeChild(row);
            console.log(`Profesor ${teacher.name} eliminado`);
          }, 300);
        }
      });
    });

    tdActions.appendChild(deleteBtn);
    row.appendChild(tdName);
    row.appendChild(tdGrade);
    row.appendChild(tdActions);
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  modal.appendChild(table);

  const closeBtn = document.createElement("button");
  closeBtn.className = "btn-close-x";
  closeBtn.innerHTML = "&times;"; // Esto muestra el símbolo de multiplicación (X)
  closeBtn.addEventListener("click", () => {
    document.body.removeChild(overlay);
  });
  modal.appendChild(closeBtn);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

function verifyAdminPassword() {
  return new Promise((resolve) => {
    const passOverlay = document.createElement("div");
    passOverlay.className = "modal-overlay";
    passOverlay.style.backgroundColor = "rgba(0,0,0,0.7)";
    passOverlay.style.zIndex = "1001";

    const passModal = document.createElement("div");
    passModal.className = "password-modal";

    const passTitle = document.createElement("h3");
    passTitle.textContent = "Verificación de Administrador";
    passModal.appendChild(passTitle);

    const passLabel = document.createElement("label");
    passLabel.textContent = "Contraseña:";
    passModal.appendChild(passLabel);

    const passInput = document.createElement("input");
    passInput.type = "password";
    passModal.appendChild(passInput);

    const btnContainer = document.createElement("div");
    btnContainer.className = "btn-container";

    const cancelBtn = document.createElement("button");
    cancelBtn.className = "btn btn-cancel";
    cancelBtn.textContent = "Cancelar";
    cancelBtn.addEventListener("click", () => {
      document.body.removeChild(passOverlay);
      resolve(false);
    });

    const confirmBtn = document.createElement("button");
    confirmBtn.className = "btn btn-confirm";
    confirmBtn.textContent = "Confirmar";
    confirmBtn.addEventListener("click", () => {
      if (passInput.value === "admin123") {
        document.body.removeChild(passOverlay);
        resolve(true);
      } else {
        alert("Contraseña incorrecta");
        passInput.value = "";
      }
    });

    btnContainer.appendChild(cancelBtn);
    btnContainer.appendChild(confirmBtn);
    passModal.appendChild(btnContainer);
    passOverlay.appendChild(passModal);
    document.body.appendChild(passOverlay);

    passInput.focus();
  });
}

function createAdminOption(title, description) {
  const option = document.createElement("div");
  option.className = "admin-option";

  const titleEl = document.createElement("h3");
  titleEl.textContent = title;

  const descEl = document.createElement("p");
  descEl.textContent = description;

  option.appendChild(titleEl);
  option.appendChild(descEl);

  return option;
}

export { admin };
