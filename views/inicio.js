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
  } else {
    h1.textContent = "Bienvenido";
  }

  section.appendChild(h1);
  return section;
}

export { desing_inicio };
