function cargarProfesorDesdeDB(h1Element) {
    const profesorId = localStorage.getItem('profesorId') || 1;
    
    fetch(`http://localhost:3000/profesores/${profesorId}`)
        .then(response => {
            if (!response.ok) {
                // Si la respuesta no es 2xx, lanzar error con el status
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(profesor => {
            // Verificar si el objeto profesor tiene los campos esperados
            if (!profesor || !profesor.nombre || !profesor.apellido) {
                throw new Error('Datos del profesor incompletos');
            }
            h1Element.textContent = `Bienvenido Profesor: ${profesor.nombre} ${profesor.apellido}`;
        })
        .catch(error => {
            console.error('Error al cargar profesor:', error);
            // Mostrar mensaje más descriptivo
            h1Element.textContent = "Bienvenido Profesor (modo offline)";
           
            h1Element.parentNode.appendChild(errorMsg);
        });
}

export {cargarProfesorDesdeDB};