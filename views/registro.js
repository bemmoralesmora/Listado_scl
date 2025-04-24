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

    // Evento de búsqueda
    buscar.addEventListener('click', async () => {
        const nombre = searchInput.value.trim();
        await manejarBusqueda(nombre, buscar, presentesBox, ausentesBox, justificadosBox, totalBox);
    });

    // También buscar al presionar Enter
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            buscar.click();
        }
    });

    return Registro;
}

export { Registro };