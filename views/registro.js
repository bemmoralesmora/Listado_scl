import { 
    crearComponenteBusqueda, 
    crearComponenteEstadisticas, 
    manejarBusqueda 
} from '../modulos/funciones_registro.js';

function Registro() {
    let Registro = document.createElement('section');
    Registro.className = "registro";
    
    // Crear componente de búsqueda
    const { searchLabel, searchInput, buscar } = crearComponenteBusqueda();
    Registro.appendChild(searchLabel);
    
    // Crear componente de estadísticas
    const { datosAlumno, presentesBox, ausentesBox, justificadosBox, totalBox } = crearComponenteEstadisticas();
    Registro.appendChild(datosAlumno);

    // --- Botones extra
    const extraButtonsContainer = document.createElement('div');
    extraButtonsContainer.className = "extra-buttons";

    const btnComentarios = document.createElement('button');
    btnComentarios.textContent = "Ver comentarios";
    btnComentarios.className = "btn-extra";
    
    const btnUniforme = document.createElement('button');
    btnUniforme.textContent = "Uniforme";
    btnUniforme.className = "btn-extra";
    
    extraButtonsContainer.appendChild(btnComentarios);
    extraButtonsContainer.appendChild(btnUniforme);
    Registro.appendChild(extraButtonsContainer);

    // --- Contenedor de comentarios
    const contenedorComentarios = document.createElement('div');
    contenedorComentarios.className = "contenedor-desplegable oculto";
    contenedorComentarios.innerHTML = `
        <div class="comentario-item">
            <span>Comentario de ejemplo 1</span>
            <span class="fecha">2025-06-01</span>
        </div>
        <div class="comentario-item">
            <span>Comentario de ejemplo 2</span>
            <span class="fecha">2025-06-10</span>
        </div>
        <div class="comentario-item">
            <span>Comentario de ejemplo 3</span>
            <span class="fecha">2025-06-13</span>
        </div>
    `;

    // --- Contenedor de uniforme
    const contenedorUniforme = document.createElement('div');
    contenedorUniforme.className = "contenedor-desplegable2 oculto";
    contenedorUniforme.innerHTML = `
        <div class="uniforme-item">
            <span>Uniforme incompleto</span>
            <div class="iconos-uniforme">
                <div class="parte">👕</div>
                <div class="parte">👖</div>
                <div class="parte">👞</div>
                <div class="parte">🧦</div>
            </div>
            <span class="fecha">2025-06-13</span>
        </div>
    `;

    Registro.appendChild(contenedorComentarios);
    Registro.appendChild(contenedorUniforme);

    // --- Eventos de despliegue
    btnComentarios.addEventListener('click', () => {
        contenedorComentarios.classList.toggle("oculto");
        contenedorUniforme.classList.add("oculto");
    });

    btnUniforme.addEventListener('click', () => {
        contenedorUniforme.classList.toggle("oculto");
        contenedorComentarios.classList.add("oculto");
    });

    // --- Búsqueda
    buscar.addEventListener('click', async () => {
        const nombre = searchInput.value.trim();
        await manejarBusqueda(nombre, buscar, presentesBox, ausentesBox, justificadosBox, totalBox);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            buscar.click();
        }
    });

    return Registro;
}

export { Registro };
