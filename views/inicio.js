function desing_inicio() {
  let section = document.createElement("section");
  section.className = "desing-inicio";

  let h1 = document.createElement("h1");

  // Verificar si es profesor
  const profesorNombre = localStorage.getItem("profesorNombre");
  const profesorApellido = localStorage.getItem("profesorApellido");

  // Verificar si es administrador
  const adminNombre = localStorage.getItem("adminNombre");
  const adminApellido = localStorage.getItem("adminApellido");

  if (profesorNombre && profesorApellido) {
    h1.textContent = `Bienvenido Profesor: ${profesorNombre} ${profesorApellido}`;
  } else if (adminNombre && adminApellido) {
    h1.textContent = `Bienvenido Administrador: ${adminNombre} ${adminApellido}`;
    // Agregar botón para panel de administración
    const adminBtn = document.createElement("button");
    adminBtn.textContent = "Panel de Administración";
    adminBtn.className = "admin-btn";
    adminBtn.addEventListener("click", () => {
      // Redirigir al panel de admin (debes implementar esta vista)
      console.log("Ir al panel de administración");
    });
    section.appendChild(adminBtn);
  } else {
    h1.textContent = "Bienvenido";
  }

  section.appendChild(h1);
  return section;
}

export { desing_inicio };
