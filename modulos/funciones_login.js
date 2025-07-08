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
    "https://backend-listadoscl.onrender.com/admin/login", // Ruta corregida
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

export function saveSessionData(profesorData) {
  localStorage.setItem("profesorId", profesorData.id);
  localStorage.setItem("profesorNombre", profesorData.nombre);
  localStorage.setItem("profesorApellido", profesorData.apellido);
}

export function saveAdminSessionData(adminData) {
  localStorage.setItem("adminId", adminData.id);
  localStorage.setItem("adminNombre", adminData.nombre);
  localStorage.setItem("adminApellido", adminData.apellido);
}
