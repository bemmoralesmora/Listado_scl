export async function handleLogin(email, contraseña) {
    const response = await fetch('http://localhost:3000/login-profesor', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, contraseña }),
    });

    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.error || 'Credenciales incorrectas');
    }

    // Guardar datos de sesión
    localStorage.setItem('profesorId', data.profesor.id);
    localStorage.setItem('profesorNombre', data.profesor.nombre);
    localStorage.setItem('profesorApellido', data.profesor.apellido);
    
    return data;
}

export function saveSessionData(profesorData) {
    localStorage.setItem('profesorId', profesorData.id);
    localStorage.setItem('profesorNombre', profesorData.nombre);
    localStorage.setItem('profesorApellido', profesorData.apellido);
}