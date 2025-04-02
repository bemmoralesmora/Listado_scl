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

    fecha_input.addEventListener('change', function() {
        mostrar_fecha.textContent = this.value ? "Fecha: " + this.value : "Fecha: No seleccionada";
    });

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
    
    // Evento para cargar alumnos cuando se selecciona un grado
    gradoSelect.addEventListener('change', async function() {
        const fecha = fecha_input.value;
        const grado = this.value;
        
        if (!fecha) {
            alert("Primero selecciona una fecha");
            this.value = "";
            return;
        }
        
        if (grado) {
            await cargarAlumnosPorGradoYFecha(datos_lista, grado, fecha);
        }
    });
    
    create_datos.appendChild(gradoSelect);

    let agregarAsistencia = document.createElement('button');
    agregarAsistencia.textContent = "Guardar Asistencia";
    agregarAsistencia.className = "agregarAsistencia";
    
    // Evento para guardar asistencia (con alerta de éxito)
    agregarAsistencia.addEventListener('click', async () => {
        const fecha = fecha_input.value;
        const grado = gradoSelect.value;
        
        if (!fecha || !grado) {
            alert("Selecciona fecha y grado primero");
            return;
        }
        
        try {
            agregarAsistencia.disabled = true;
            agregarAsistencia.textContent = "Guardando...";
            
            await guardarAsistencia(datos_lista, grado, fecha);
            
            // Alerta de éxito
            alert("¡Asistencia guardada correctamente!");
        } catch (error) {
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
        } finally {
            agregarAsistencia.disabled = false;
            agregarAsistencia.textContent = "Guardar Asistencia";
        }
    });
    
    create_datos.appendChild(agregarAsistencia);

    // Contenedor para la lista de alumnos
    let datos_lista = document.createElement('div');
    datos_lista.className = "datos-lista";
    Lista.appendChild(datos_lista);

    // Cargar grados disponibles desde el backend
    cargarGrados(gradoSelect);

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
            // Dividir nombre completo (primera palabra = nombre, resto = apellido)
            const [nombre, ...apellidos] = nombreCompleto.split(' ');
            const apellido = apellidos.join(' ');

            if (!nombre || !apellido) {
                throw new Error("Formato incorrecto. Usa: Nombre Apellido");
            }

            // 1. Agregar alumno a la base de datos
            const alumnoResponse = await fetch('http://localhost:3000/alumnos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre,
                    apellido,
                    grado: gradoSeleccionado
                })
            });

            const alumnoData = await alumnoResponse.json();

            if (!alumnoResponse.ok) {
                throw new Error(alumnoData.error || 'Error al agregar alumno');
            }

            // 2. Si hay fecha seleccionada y grado, actualizar la lista
            if (fechaSeleccionada && gradoSeleccionado) {
                await cargarAlumnosPorGradoYFecha(datos_lista, gradoSeleccionado, fechaSeleccionada);
            }

            // Limpiar input
            agregar_input.value = '';

        } catch (error) {
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
        }
    });

    return Lista;
}

// ... (el resto de tus funciones permanecen igual)
// Función para cargar grados desde el backend
async function cargarGrados(selectElement) {
    try {
        const response = await fetch('http://localhost:3000/grados');
        const grados = await response.json();

        if (!response.ok) throw new Error(grados.error || 'Error al cargar grados');

        // Limpiar select primero
        selectElement.innerHTML = '<option value="">Selecciona un grado</option>';
        
        grados.forEach(grado => {
            const option = document.createElement('option');
            option.value = grado.nombre_grado;
            option.textContent = grado.nombre_grado;
            selectElement.appendChild(option);
        });

    } catch (error) {
        console.error('Error al cargar grados:', error);
        alert('No se pudieron cargar los grados. Recarga la página.');
    }
}

// Función para cargar alumnos por grado y fecha
async function cargarAlumnosPorGradoYFecha(contenedor, nombreGrado, fecha) {
    try {
        contenedor.innerHTML = '<div class="loading">Cargando alumnos...</div>';
        
        // 1. Obtener el ID del grado
        const gradoResponse = await fetch(`http://localhost:3000/grados/exacto/${encodeURIComponent(nombreGrado)}`);
        
        if (!gradoResponse.ok) {
            throw new Error(await gradoResponse.text());
        }
        
        const gradoData = await gradoResponse.json();
        const idGrado = gradoData.id_grado;
        
        // 2. Obtener SOLO los alumnos del grado (sin datos de asistencia)
        const alumnosResponse = await fetch(`http://localhost:3000/grados/${idGrado}/alumnos`);
        
        if (!alumnosResponse.ok) {
            throw new Error(await alumnosResponse.text());
        }
        
        const alumnos = await alumnosResponse.json();
        
        // Limpiar contenedor
        contenedor.innerHTML = '';
        
        if (alumnos.length === 0) {
            contenedor.innerHTML = '<div class="no-alumnos">No hay alumnos en este grado</div>';
            return;
        }
        
        // 3. Crear elementos para cada alumno con estado por defecto (ausente)
        alumnos.forEach(alumno => {
            const alumnoItem = document.createElement('div');
            alumnoItem.className = 'alumno-item';
            
            // Nombre del alumno
            const nombreElement = document.createElement('h1');
            nombreElement.textContent = `${alumno.nombre} ${alumno.apellido}`;
            
            // Contenedor de inputs
            const contInputs = document.createElement('div');
            contInputs.className = 'cont-inputs';
            
            // Selector de estado (valor por defecto: ausente)
            const estadoSelect = document.createElement('select');
            estadoSelect.className = 'estado-asistencia';
            estadoSelect.dataset.idAlumno = alumno.id_alumno;
            
            const opciones = [
                { value: 'presente', text: 'Presente' },
                { value: 'ausente', text: 'Ausente', selected: true }, // Por defecto ausente
                { value: 'justificado', text: 'Justificado' }
            ];
            
            opciones.forEach(opcion => {
                const optionElement = document.createElement('option');
                optionElement.value = opcion.value;
                optionElement.textContent = opcion.text;
                if (opcion.selected) optionElement.selected = true;
                estadoSelect.appendChild(optionElement);
            });
            
            // Input para comentario (vacío por defecto)
            const comentarioInput = document.createElement('input');
            comentarioInput.type = 'text';
            comentarioInput.placeholder = 'Comentario';
            comentarioInput.className = 'comentario-asistencia';
            comentarioInput.dataset.idAlumno = alumno.id_alumno;
            
            contInputs.appendChild(estadoSelect);
            contInputs.appendChild(comentarioInput);
            
            alumnoItem.appendChild(nombreElement);
            alumnoItem.appendChild(contInputs);
            
            contenedor.appendChild(alumnoItem);
        });
        
    } catch (error) {
        console.error('Error al cargar alumnos:', error);
        contenedor.innerHTML = `<div class="error">Error al cargar alumnos: ${error.message}</div>`;
    }
}

// Función para guardar la asistencia
async function guardarAsistencia(contenedor, nombreGrado, fecha) {
    try {
        // 1. Obtener el ID del grado
        const gradoResponse = await fetch(`http://localhost:3000/grados/exacto/${encodeURIComponent(nombreGrado)}`);
        
        if (!gradoResponse.ok) {
            const errorData = await gradoResponse.json();
            throw new Error(errorData.error || 'Error al obtener el grado');
        }
        
        const gradoData = await gradoResponse.json();
        const idGrado = gradoData.id_grado;
        
        // 2. Recoger los datos de asistencia del formulario
        const asistencias = [];
        const alumnosItems = contenedor.querySelectorAll('.alumno-item');
        
        if (alumnosItems.length === 0) {
            throw new Error("No hay alumnos para guardar");
        }
        
        alumnosItems.forEach(item => {
            const estadoSelect = item.querySelector('.estado-asistencia');
            const comentarioInput = item.querySelector('.comentario-asistencia');
            
            asistencias.push({
                id_alumno: parseInt(estadoSelect.dataset.idAlumno), // Asegurar que sea número
                fecha: fecha,
                estado: estadoSelect.value.toLowerCase(), // Convertir a minúsculas
                comentario: comentarioInput.value || null // Usar null si está vacío
            });
        });
        
        // 3. Enviar datos al backend con mejor manejo de errores
        const saveResponse = await fetch('http://localhost:3000/asistencia/batch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ asistencias })
        });
        
        const saveData = await saveResponse.json();
        
        if (!saveResponse.ok) {
            // Mostrar detalles del error si están disponibles
            const errorMsg = saveData.details || saveData.error || saveData.sqlMessage || 'Error desconocido';
            throw new Error(errorMsg);
        }
        
        return saveData;
    } catch (error) {
        console.error('Error completo al guardar asistencia:', error);
        throw new Error(`No se pudo guardar la asistencia: ${error.message}`);
    }
}

export { Lista };