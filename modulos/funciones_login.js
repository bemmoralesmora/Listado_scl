export async function handleLogin(email, contraseña) {
  const response = await fetch(
    "https://backend-listadoscl.onrender.com/profesores/login-profesor",
    {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, contraseña }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Credenciales incorrectas");
  }

  return data;
}

export async function handleAdminLogin(email, contraseña) {
  const response = await fetch(
    "https://backend-listadoscl.onrender.com/admin/login",
    {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, contraseña }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Credenciales incorrectas");
  }

  return data;
}

export function saveAdminSessionData(adminData, token) {
  try {
    if (!adminData?.id || !token) {
      throw new Error("Datos de administrador incompletos");
    }

    localStorage.setItem("adminId", adminData.id);
    localStorage.setItem("adminNombre", adminData.nombre);
    localStorage.setItem("adminApellido", adminData.apellido);
    localStorage.setItem("userRole", "admin");
    localStorage.setItem("authToken", token);
    localStorage.setItem("lastLogin", new Date().toISOString());
  } catch (error) {
    console.error("Error guardando sesión de admin:", error);
    throw error;
  }
}

// Función adicional recomendada
export function clearSessionData() {
  localStorage.removeItem("profesorId");
  localStorage.removeItem("profesorNombre");
  localStorage.removeItem("profesorApellido");
  localStorage.removeItem("adminId");
  localStorage.removeItem("adminNombre");
  localStorage.removeItem("adminApellido");
  localStorage.removeItem("userRole");
  localStorage.removeItem("authToken");
  localStorage.removeItem("lastLogin");
}
