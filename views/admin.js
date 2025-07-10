import { isAdmin, getAuthToken } from "./aunt.js";
import { showNotification } from "./notifications.js";

async function admin() {
  console.log("Inicializando panel de administración");

  // Verificación de permisos
  if (!isAdmin()) {
    console.error("Intento de acceso no autorizado al panel de admin");
    showNotification("Acceso no autorizado", "error");
    logout();
    return null;
  }

  const token = getAuthToken();
  if (!token) {
    console.error("No se encontró token de autenticación");
    showNotification("Sesión inválida", "error");
    logout();
    return null;
  }

  try {
    // Crear contenedor principal
    let adminSection = document.createElement("div");
    adminSection.className = "admin";

    // 1. Obtener información del admin
    const adminInfo = await fetchAdminInfo(token);
    if (!adminInfo) {
      throw new Error("No se pudo cargar la información del administrador");
    }

    // 2. Crear cabecera
    adminSection.appendChild(createAdminHeader(adminInfo));

    // 3. Crear opciones
    const optionsContainer = createAdminOptions();
    adminSection.appendChild(optionsContainer);

    console.log("Panel de administración cargado correctamente");
    return adminSection;
  } catch (error) {
    console.error("Error en admin():", error);
    showNotification(error.message || "Error al cargar el panel", "error");
    return createErrorPanel(error.message);
  }
}

async function fetchAdminInfo(token) {
  try {
    const response = await fetch(
      "https://backend-listadoscl.onrender.com/admin/info",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Error al cargar información");
    }

    const adminData = await response.json();
    localStorage.setItem("adminNombre", adminData.nombre);
    localStorage.setItem("adminApellido", adminData.apellido);

    return adminData;
  } catch (error) {
    console.error("Error fetching admin info:", error);
    throw error;
  }
}

function createAdminHeader(adminData) {
  const header = document.createElement("div");
  header.className = "admin-header";

  const title = document.createElement("h2");
  title.textContent = `Panel de Administración - ${adminData.nombre} ${adminData.apellido}`;
  header.appendChild(title);

  return header;
}

function createAdminOptions() {
  const optionsContainer = document.createElement("div");
  optionsContainer.className = "admin-options";

  const options = [
    {
      icon: "👥",
      title: "Gestión de profesores",
      description: "Administra los profesores del sistema",
      handler: showTeacherManagement,
    },
    {
      icon: "⚙️",
      title: "Configuración del sistema",
      description: "Ajustes generales de la plataforma",
      handler: () => showNotification("Funcionalidad en desarrollo"),
    },
    {
      icon: "📊",
      title: "Reportes y estadísticas",
      description: "Visualiza datos del sistema",
      handler: () => showNotification("Funcionalidad en desarrollo"),
    },
    {
      icon: "💾",
      title: "Copias de seguridad",
      description: "Gestiona respaldos del sistema",
      handler: () => showNotification("Funcionalidad en desarrollo"),
    },
  ];

  options.forEach((opt) => {
    const option = createAdminOption(opt.icon, opt.title, opt.description);
    option.addEventListener("click", opt.handler);
    optionsContainer.appendChild(option);
  });

  return optionsContainer;
}

function createErrorPanel(message) {
  const errorPanel = document.createElement("div");
  errorPanel.className = "admin-error-panel";
  errorPanel.innerHTML = `
    <h2>Error en el panel de administración</h2>
    <p>${message}</p>
    <div class="error-actions">
      <button id="retry-btn">Reintentar</button>
      <button id="logout-btn">Cerrar sesión</button>
    </div>
  `;

  errorPanel.querySelector("#retry-btn").addEventListener("click", () => {
    window.location.reload();
  });

  errorPanel.querySelector("#logout-btn").addEventListener("click", () => {
    logout();
  });

  return errorPanel;
}

async function showTeacherManagement() {
  if (!isAdmin()) {
    alert("Sesión no válida");
    logout();
    return;
  }

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

  // Botón para agregar nuevo profesor
  const addTeacherBtn = document.createElement("button");
  addTeacherBtn.className = "btn-add-teacher";
  addTeacherBtn.textContent = "+ Agregar Profesor";
  addTeacherBtn.addEventListener("click", () => showAddTeacherForm(modal));
  modal.appendChild(addTeacherBtn);

  // Cargar profesores desde el backend
  try {
    const response = await fetch(
      "https://backend-listadoscl.onrender.com/admin/profesores",
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );

    if (!response.ok) throw new Error("Error al cargar profesores");

    const teachers = await response.json();

    // Crear tabla para mostrar profesores
    const table = document.createElement("table");
    table.className = "teachers-table";

    // Cabecera de la tabla
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    ["Nombre", "Email", "Grado Asignado", "Acciones"].forEach((text) => {
      const th = document.createElement("th");
      th.textContent = text;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Cuerpo de la tabla
    const tbody = document.createElement("tbody");

    teachers.forEach((teacher) => {
      const row = document.createElement("tr");

      // Celda Nombre
      const tdName = document.createElement("td");
      tdName.textContent = `${teacher.nombre} ${teacher.apellido}`;

      // Celda Email
      const tdEmail = document.createElement("td");
      tdEmail.textContent = teacher.email;

      // Celda Grado
      const tdGrade = document.createElement("td");
      tdGrade.textContent = teacher.id_grado_asignado
        ? `Grado ${teacher.id_grado_asignado}`
        : "Sin asignar";

      // Celda Acciones
      const tdActions = document.createElement("td");
      tdActions.className = "actions-cell";

      // Botón Editar
      const editBtn = document.createElement("button");
      editBtn.className = "btn btn-edit";
      editBtn.innerHTML = '<i class="fas fa-edit"></i>';
      editBtn.addEventListener("click", () =>
        editTeacher(teacher, modal, table)
      );

      // Botón Eliminar
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "btn btn-delete";
      deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
      deleteBtn.addEventListener("click", () =>
        deleteTeacher(teacher.id_profesor, row)
      );

      tdActions.appendChild(editBtn);
      tdActions.appendChild(deleteBtn);

      row.appendChild(tdName);
      row.appendChild(tdEmail);
      row.appendChild(tdGrade);
      row.appendChild(tdActions);
      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    modal.appendChild(table);
  } catch (error) {
    console.error("Error:", error);
    showNotification("Error al cargar la lista de profesores");
    modal.appendChild(
      (document.createElement("p").textContent = "Error al cargar profesores")
    );
  }

  // Botón de cierre
  const closeBtn = document.createElement("button");
  closeBtn.className = "btn-close-x";
  closeBtn.innerHTML = "&times;";
  closeBtn.addEventListener("click", () => {
    document.body.removeChild(overlay);
  });
  modal.appendChild(closeBtn);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

async function deleteTeacher(teacherId, row) {
  try {
    const verified = await verifyAdminPassword();
    if (!verified) return;

    const response = await fetch(
      `https://backend-listadoscl.onrender.com/admin/profesores/${teacherId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );

    if (!response.ok) throw new Error("Error al eliminar profesor");

    row.style.backgroundColor = "#ffebee";
    setTimeout(() => {
      row.remove();
      showNotification("Profesor eliminado correctamente");
    }, 300);
  } catch (error) {
    console.error("Error:", error);
    showNotification("Error al eliminar profesor");
  }
}

async function showAddTeacherForm(modal) {
  const formContainer = document.createElement("div");
  formContainer.className = "add-teacher-form";

  const formTitle = document.createElement("h3");
  formTitle.textContent = "Agregar Nuevo Profesor";
  formContainer.appendChild(formTitle);

  const form = document.createElement("form");

  // Campos del formulario
  const fields = [
    { type: "text", id: "teacher-name", label: "Nombre", required: true },
    { type: "text", id: "teacher-lastname", label: "Apellido", required: true },
    {
      type: "email",
      id: "teacher-email",
      label: "Correo electrónico",
      required: true,
    },
    {
      type: "number",
      id: "teacher-grade",
      label: "ID de Grado Asignado",
      required: false,
    },
    {
      type: "password",
      id: "teacher-password",
      label: "Contraseña temporal",
      required: true,
    },
  ];

  fields.forEach((field) => {
    const div = document.createElement("div");
    div.className = "form-group";

    const label = document.createElement("label");
    label.htmlFor = field.id;
    label.textContent = field.label;

    const input = document.createElement("input");
    input.type = field.type;
    input.id = field.id;
    input.required = field.required || false;

    div.appendChild(label);
    div.appendChild(input);
    form.appendChild(div);
  });

  // Botones del formulario
  const buttonGroup = document.createElement("div");
  buttonGroup.className = "form-buttons";

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.className = "btn btn-cancel";
  cancelBtn.textContent = "Cancelar";
  cancelBtn.addEventListener("click", () => {
    modal.removeChild(formContainer);
  });

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.className = "btn btn-submit";
  submitBtn.textContent = "Guardar Profesor";

  buttonGroup.appendChild(cancelBtn);
  buttonGroup.appendChild(submitBtn);
  form.appendChild(buttonGroup);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const newTeacher = {
        nombre: document.getElementById("teacher-name").value,
        apellido: document.getElementById("teacher-lastname").value,
        email: document.getElementById("teacher-email").value,
        id_grado_asignado:
          document.getElementById("teacher-grade").value || null,
        contraseña: document.getElementById("teacher-password").value,
      };

      const response = await fetch(
        "https://backend-listadoscl.onrender.com/admin/profesores",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
          body: JSON.stringify(newTeacher),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al agregar profesor");
      }

      showNotification("Profesor agregado correctamente");
      modal.removeChild(formContainer);
      // Recargar la tabla de profesores
      const table = modal.querySelector("table");
      if (table) {
        const overlay = modal.parentElement;
        document.body.removeChild(overlay);
        showTeacherManagement();
      }
    } catch (error) {
      console.error("Error:", error);
      showNotification(error.message || "Error al agregar profesor");
    }
  });

  formContainer.appendChild(form);
  modal.appendChild(formContainer);
}

async function editTeacher(teacher, modal, table) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  const editModal = document.createElement("div");
  editModal.className = "edit-teacher-modal";

  const title = document.createElement("h2");
  title.textContent = `Editar Profesor: ${teacher.nombre} ${teacher.apellido}`;
  editModal.appendChild(title);

  const form = document.createElement("form");

  const fields = [
    { id: "edit-name", label: "Nombre", value: teacher.nombre },
    { id: "edit-lastname", label: "Apellido", value: teacher.apellido },
    { id: "edit-email", label: "Email", value: teacher.email },
    {
      id: "edit-grade",
      label: "ID de Grado",
      value: teacher.id_grado_asignado || "",
    },
  ];

  fields.forEach((field) => {
    const div = document.createElement("div");
    div.className = "form-group";

    const label = document.createElement("label");
    label.htmlFor = field.id;
    label.textContent = field.label;

    const input = document.createElement("input");
    input.type = field.id.includes("grade") ? "number" : "text";
    input.id = field.id;
    input.value = field.value;

    div.appendChild(label);
    div.appendChild(input);
    form.appendChild(div);
  });

  const buttonGroup = document.createElement("div");
  buttonGroup.className = "form-buttons";

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.className = "btn btn-cancel";
  cancelBtn.textContent = "Cancelar";
  cancelBtn.addEventListener("click", () => {
    document.body.removeChild(overlay);
  });

  const saveBtn = document.createElement("button");
  saveBtn.type = "submit";
  saveBtn.className = "btn btn-save";
  saveBtn.textContent = "Guardar Cambios";

  buttonGroup.appendChild(cancelBtn);
  buttonGroup.appendChild(saveBtn);
  form.appendChild(buttonGroup);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const verified = await verifyAdminPassword();
      if (!verified) return;

      const updatedTeacher = {
        nombre: document.getElementById("edit-name").value,
        apellido: document.getElementById("edit-lastname").value,
        email: document.getElementById("edit-email").value,
        id_grado_asignado: document.getElementById("edit-grade").value || null,
      };

      const response = await fetch(
        `https://backend-listadoscl.onrender.com/admin/profesores/${teacher.id_profesor}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
          body: JSON.stringify(updatedTeacher),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar profesor");
      }

      showNotification("Cambios guardados correctamente");
      document.body.removeChild(overlay);

      // Recargar la tabla de profesores
      const parentOverlay = modal.parentElement;
      document.body.removeChild(parentOverlay);
      showTeacherManagement();
    } catch (error) {
      console.error("Error:", error);
      showNotification(error.message || "Error al actualizar profesor");
    }
  });

  const closeBtn = document.createElement("button");
  closeBtn.className = "btn-close-x";
  closeBtn.innerHTML = "&times;";
  closeBtn.addEventListener("click", () => {
    document.body.removeChild(overlay);
  });

  editModal.appendChild(closeBtn);
  editModal.appendChild(form);
  overlay.appendChild(editModal);
  document.body.appendChild(overlay);
}

// Resto de las funciones (verifyAdminPassword, createAdminOption) permanecen igual
// Solo necesitan pequeñas modificaciones para usar fetch en verifyAdminPassword

async function verifyAdminPassword() {
  return new Promise(async (resolve) => {
    const passOverlay = document.createElement("div");
    passOverlay.className = "modal-overlay";
    passOverlay.style.zIndex = "1001";

    const passModal = document.createElement("div");
    passModal.className = "password-modal";

    const passTitle = document.createElement("h3");
    passTitle.textContent = "Verificación de Identidad";
    passModal.appendChild(passTitle);

    const passLabel = document.createElement("label");
    passLabel.textContent = "Ingrese su contraseña de administrador:";
    passModal.appendChild(passLabel);

    const passInput = document.createElement("input");
    passInput.type = "password";
    passInput.placeholder = "Contraseña";
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
    confirmBtn.textContent = "Verificar";
    confirmBtn.addEventListener("click", async () => {
      const password = passInput.value.trim();
      if (!password) {
        alert("La contraseña no puede estar vacía");
        passInput.focus();
        return;
      }

      try {
        const response = await fetch(
          "https://backend-listadoscl.onrender.com/admin/verify-password",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getAuthToken()}`,
            },
            body: JSON.stringify({ password }),
          }
        );

        if (response.ok) {
          document.body.removeChild(passOverlay);
          resolve(true);
        } else {
          alert("Contraseña incorrecta");
          passInput.focus();
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error al verificar contraseña");
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

export { admin };
