
function desing_inicio() {
    let section = document.createElement('section');
    section.className = "desing-inicio";

    let h1 = document.createElement('h1');
    
    const nombre = localStorage.getItem('profesorNombre');
    const apellido = localStorage.getItem('profesorApellido');
    
    if (nombre && apellido) {
        h1.textContent = `Bienvenido Profesor: ${nombre} ${apellido}`;
    } else {
        h1.textContent = "Bienvenido";
    }

    section.appendChild(h1);
    return section;
}

export { desing_inicio };

