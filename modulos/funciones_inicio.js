function cargarUsuarioDesdeDB(h1Element) {
  const profesorId = localStorage.getItem("profesorId");
  const adminId = localStorage.getItem("adminId");

  if (profesorId) {
    cargarProfesor(h1Element, profesorId);
  } else if (adminId) {
    cargarAdministrador(h1Element, adminId);
  } else {
    h1Element.textContent = "Bienvenido (modo offline)";
  }
}

async function cargarProfesor(h1Element, profesorId) {
  try {
    const response = await fetch(
      `https://backend-listadoscl.onrender.com/profesores/${profesorId}`
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const profesor = await response.json();

    if (!profesor || !profesor.nombre || !profesor.apellido) {
      throw new Error("Datos del profesor incompletos");
    }

    h1Element.textContent = `Bienvenido Profesor: ${profesor.nombre} ${profesor.apellido}`;
  } catch (error) {
    console.error("Error al cargar profesor:", error);
    h1Element.textContent = "Bienvenido Profesor (modo offline)";
  }
}

async function cargarAdministrador(h1Element, adminId) {
  try {
    const response = await fetch(
      `https://backend-listadoscl.onrender.com/admin/${adminId}`
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const admin = await response.json();

    if (!admin || !admin.nombre || !admin.apellido) {
      throw new Error("Datos del administrador incompletos");
    }

    h1Element.textContent = `Bienvenido Administrador: ${admin.nombre} ${admin.apellido}`;

    // Agregar botón de panel de administración
    const adminBtn = document.createElement("button");
    adminBtn.textContent = "Panel de Administración";
    adminBtn.className = "admin-btn";
    adminBtn.addEventListener("click", () => {
      // Redirigir al panel de admin
      console.log("Ir al panel de administración");
    });
    h1Element.parentNode.appendChild(adminBtn);
  } catch (error) {
    console.error("Error al cargar administrador:", error);
    h1Element.textContent = "Bienvenido Administrador (modo offline)";
  }
}

export { cargarUsuarioDesdeDB };
