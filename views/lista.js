import { 
    cargarGrados, 
    cargarAlumnosPorGradoYFecha, 
    guardarAsistencia,
    agregarAlumno,
    obtenerAlumnosBasicosPorGrado,
    cargarAsistenciaGuardada
} from '../modulos/funciones_lista.js';

function Lista() {
    let Lista = document.createElement('section');
    Lista.className = "lista";

    let create_datos = document.createElement('div');
    create_datos.className = "create-datos";
    Lista.appendChild(create_datos);

    // Selector de fecha
    let fecha_input = document.createElement('input');
    fecha_input.type = "date";
    fecha_input.id = "fecha";
    fecha_input.className = "icono-fecha";
    
    let mostrar_fecha = document.createElement('div');
    mostrar_fecha.className = "mostrar-fecha";
    mostrar_fecha.textContent = "Fecha: No seleccionada";

    create_datos.appendChild(fecha_input);
    create_datos.appendChild(mostrar_fecha);

    // Input para nombre de alumno
    let agregar_input = document.createElement('input');
    agregar_input.type = "text";
    agregar_input.className = "agregar_input";
    agregar_input.placeholder = "Ingresa alumno (Nombre Apellido)";
    create_datos.appendChild(agregar_input);

    // Botón para agregar alumno
    let agregar = document.createElement('button');
    agregar.textContent = "+";
    agregar.className = "agregar";
    create_datos.appendChild(agregar);

    // Selector de grados
    let gradoSelect = document.createElement('select');
    gradoSelect.className = "grado";
    gradoSelect.innerHTML = '<option value="">Selecciona un grado</option>';
    
    // Contenedor para la lista de alumnos
    let datos_lista = document.createElement('div');
    datos_lista.className = "datos-lista";
    Lista.appendChild(datos_lista);

    // Función para crear elementos de alumno
    function crearElementoAlumno(alumno) {
        const alumnoItem = document.createElement('div');
        alumnoItem.className = 'alumno-item';
        
        const nombreElement = document.createElement('h1');
        nombreElement.textContent = `${alumno.nombre} ${alumno.apellido}`;
        
        const contInputs = document.createElement('div');
        contInputs.className = 'cont-inputs';
        
        const estadoSelect = document.createElement('select');
        estadoSelect.className = 'estado-asistencia';
        estadoSelect.dataset.idAlumno = alumno.id_alumno;
        
        const opciones = [
            { value: 'presente', text: 'Presente' },
            { value: 'ausente', text: 'Ausente', selected: true },
            { value: 'justificado', text: 'Justificado' }
        ];
        
        opciones.forEach(opcion => {
            const optionElement = document.createElement('option');
            optionElement.value = opcion.value;
            optionElement.textContent = opcion.text;
            if (opcion.selected) optionElement.selected = true;
            estadoSelect.appendChild(optionElement);
        });
        
        const comentarioInput = document.createElement('input');
        comentarioInput.type = 'text';
        comentarioInput.placeholder = 'Comentario';
        comentarioInput.className = 'comentario-asistencia';
        comentarioInput.dataset.idAlumno = alumno.id_alumno;
        
        contInputs.appendChild(estadoSelect);
        contInputs.appendChild(comentarioInput);
        
        alumnoItem.appendChild(nombreElement);
        alumnoItem.appendChild(contInputs);
        
        return alumnoItem;
    }

    // Evento para cambio de grado
    gradoSelect.addEventListener('change', async function() {
        const grado = this.value;
        
        if (grado) {
            try {
                datos_lista.innerHTML = '<div class="loading">Cargando alumnos...</div>';
                const alumnos = await obtenerAlumnosBasicosPorGrado(grado);
                
                datos_lista.innerHTML = '';
                
                if (alumnos.length === 0) {
                    datos_lista.innerHTML = '<div class="no-alumnos">No hay alumnos en este grado</div>';
                    return;
                }
                
                alumnos.forEach(alumno => {
                    datos_lista.appendChild(crearElementoAlumno(alumno));
                });
                
                // Si hay fecha seleccionada, cargar asistencia
                if (fecha_input.value) {
                    const asistencias = await cargarAsistenciaGuardada(grado, fecha_input.value);
                    if (asistencias) {
                        asistencias.forEach(asistencia => {
                            const select = datos_lista.querySelector(`select[data-id-alumno="${asistencia.id_alumno}"]`);
                            const input = datos_lista.querySelector(`input.comentario-asistencia[data-id-alumno="${asistencia.id_alumno}"]`);
                            if (select) select.value = asistencia.estado;
                            if (input) input.value = asistencia.comentario || '';
                        });
                    }
                }
            } catch (error) {
                datos_lista.innerHTML = `<div class="error">${error.message}</div>`;
            }
        } else {
            datos_lista.innerHTML = '';
        }
    });

    // Evento único para cambio de fecha
    fecha_input.addEventListener('change', async function() {
        mostrar_fecha.textContent = this.value ? "Fecha: " + this.value : "Fecha: No seleccionada";
        
        if (gradoSelect.value && this.value) {
            try {
                const asistencias = await cargarAsistenciaGuardada(gradoSelect.value, this.value);
                if (asistencias) {
                    asistencias.forEach(asistencia => {
                        const select = datos_lista.querySelector(`select[data-id-alumno="${asistencia.id_alumno}"]`);
                        const input = datos_lista.querySelector(`input.comentario-asistencia[data-id-alumno="${asistencia.id_alumno}"]`);
                        if (select) select.value = asistencia.estado;
                        if (input) input.value = asistencia.comentario || '';
                    });
                }
            } catch (error) {
                console.error("Error al cargar asistencia:", error);
            }
        }
    });

    create_datos.appendChild(gradoSelect);

    let agregarAsistencia = document.createElement('button');
    agregarAsistencia.textContent = "Guardar Asistencia";
    agregarAsistencia.className = "agregarAsistencia";
    
    agregarAsistencia.addEventListener('click', async () => {
        const fecha = fecha_input.value;
        const grado = gradoSelect.value;
        
        if (!fecha) {
            alert("Debes seleccionar una fecha primero");
            return;
        }
        
        if (!grado) {
            alert("Debes seleccionar un grado primero");
            return;
        }
        
        try {
            agregarAsistencia.disabled = true;
            agregarAsistencia.textContent = "Guardando...";
            
            await guardarAsistencia(datos_lista, grado, fecha);
            alert("¡Asistencia guardada correctamente!");
        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            agregarAsistencia.disabled = false;
            agregarAsistencia.textContent = "Guardar Asistencia";
        }
    });
    
    create_datos.appendChild(agregarAsistencia);

    // Manejador para agregar alumno
    agregar.addEventListener('click', async () => {
        const nombreCompleto = agregar_input.value.trim();
        const gradoSeleccionado = gradoSelect.value;
        const fechaSeleccionada = fecha_input.value;

        if (!nombreCompleto) {
            alert("Por favor ingresa el nombre completo del alumno");
            return;
        }

        if (!gradoSeleccionado) {
            alert("Por favor selecciona un grado válido");
            return;
        }

        try {
            await agregarAlumno(nombreCompleto, gradoSeleccionado);
            
            if (fechaSeleccionada) {
                await cargarAlumnosPorGradoYFecha(datos_lista, gradoSeleccionado, fechaSeleccionada);
            } else {
                agregar_input.value = '';
                // Refrescar lista
                gradoSelect.dispatchEvent(new Event('change'));
            }
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    });

    // Cargar grados disponibles
    cargarGrados(gradoSelect).catch(error => {
        alert(error.message);
    });

    return Lista;
}

export { Lista };