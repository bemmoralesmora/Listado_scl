// auth.js
export function isAuthenticated() {
  return (
    localStorage.getItem("profesorId") !== null ||
    localStorage.getItem("adminId") !== null
  );
}

export function isAdmin() {
  return localStorage.getItem("adminId") !== null;
}

export function isProfesor() {
  return localStorage.getItem("profesorId") !== null;
}

export function getUserRole() {
  return localStorage.getItem("userRole");
}

export function getAuthToken() {
  return localStorage.getItem("authToken");
}

export function getCurrentUser() {
  if (isAdmin()) {
    return {
      id: localStorage.getItem("adminId"),
      nombre: localStorage.getItem("adminNombre"),
      apellido: localStorage.getItem("adminApellido"),
      role: "admin",
    };
  } else if (isProfesor()) {
    return {
      id: localStorage.getItem("profesorId"),
      nombre: localStorage.getItem("profesorNombre"),
      apellido: localStorage.getItem("profesorApellido"),
      role: "profesor",
    };
  }
  return null;
}

export function checkSession() {
  // Verificar si hay una sesión activa pero no se cargaron los datos correctamente
  if (
    localStorage.getItem("adminSession") === "active" &&
    !localStorage.getItem("adminId")
  ) {
    // Limpiar sesión inválida
    localStorage.removeItem("adminSession");
    return false;
  }

  if (
    localStorage.getItem("profesorSession") === "active" &&
    !localStorage.getItem("profesorId")
  ) {
    // Limpiar sesión inválida
    localStorage.removeItem("profesorSession");
    return false;
  }

  return isAuthenticated();
}

// Función para guardar los datos de sesión del admin
export function saveAdminSession(adminData, token) {
  localStorage.setItem("adminId", adminData.id);
  localStorage.setItem("adminNombre", adminData.nombre);
  localStorage.setItem("adminApellido", adminData.apellido);
  localStorage.setItem("userRole", "admin");
  localStorage.setItem("authToken", token);
  localStorage.setItem("adminSession", "active");
}

// Función para guardar los datos de sesión del profesor
export function saveProfesorSession(profesorData, token) {
  localStorage.setItem("profesorId", profesorData.id);
  localStorage.setItem("profesorNombre", profesorData.nombre);
  localStorage.setItem("profesorApellido", profesorData.apellido);
  localStorage.setItem("userRole", "profesor");
  localStorage.setItem("authToken", token);
  localStorage.setItem("profesorSession", "active");
}

// Función para cerrar sesión
export function logout() {
  // Limpiar todos los items relacionados con la autenticación
  localStorage.removeItem("adminId");
  localStorage.removeItem("adminNombre");
  localStorage.removeItem("adminApellido");
  localStorage.removeItem("profesorId");
  localStorage.removeItem("profesorNombre");
  localStorage.removeItem("profesorApellido");
  localStorage.removeItem("userRole");
  localStorage.removeItem("authToken");
  localStorage.removeItem("adminSession");
  localStorage.removeItem("profesorSession");

  // Redirigir al inicio
  window.location.href = "/";
}
