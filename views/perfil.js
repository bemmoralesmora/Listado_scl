function Perfil(usuarioData) {
    let Perfil = document.createElement('section');
    Perfil.className = "perfil";
    
    const perfilContainer = document.createElement('div');
    perfilContainer.className = "perfil-container";
    
    const perfilHeader = document.createElement('div');
    perfilHeader.className = "perfil-header";
    perfilHeader.innerHTML = `<h2>Perfil del Usuario</h2>`;
    
    const perfilContent = document.createElement('div');
    perfilContent.className = "perfil-content";
    
    const fotoSection = document.createElement('div');
    fotoSection.className = "perfil-foto";
    
    const fotoImg = document.createElement('img');
    fotoImg.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAM1BMVEXk5ueutLfn6eqrsbTp6+zg4uOwtrnJzc/j5earsbW0uby4vcDQ09XGyszU19jd3+G/xMamCvwDAAAFLklEQVR4nO2d2bLbIAxAbYE3sDH//7WFbPfexG4MiCAcnWmnrzkjIRaD2jQMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMw5wQkHJczewxZh2lhNK/CBOQo1n0JIT74/H/qMV0Z7GU3aCcVPuEE1XDCtVLAhgtpme7H0s1N1U7QjO0L8F7llzGeh1hEG/8Lo7TUmmuSrOfns9xnGXpXxsONPpA/B6OqqstjC6Ax/0ujkNdYQQbKNi2k64qiiEZ+ohi35X+2YcZw/WujmslYewiAliVYrxgJYrdwUmwXsU+RdApUi83oNIE27YvrfB/ZPg8+BJETXnqh9CVzBbTQHgojgiCvtqU9thFJg/CKz3VIMKMEkIXxIWqIpIg2SkjYj+xC816mrJae2aiWGykxRNsW0UwiJghJDljYI5CD8GRiCtIsJxizYUPQ2pzItZy5pcisTRdk/a9m4amtNNfBuQkdVhSaYqfpNTSFGfb9GRIakrE2Pm+GFLaCQPqiu0OpWP+HMPQQcgQMiQprWXNmsVwIjQjYi/ZrhAqNTCgr2gu0Jnz85RSSjso0HkMFZ0YZjKkc26a/jlmh9JiDyDxi9oeorTYAzZkwwoMz19pzj9bnH/GP/+qbchjSGflneWYhtTuKdMOmNKZcJ5TjInQKcYXnESd/jQxy0ENpULTNGOGgxpap/oyw9pbUAqhfx2Dbkhovvfgz4iUzoM9+GlK6/Mh4q29hyC1mwro30hpVVLPF9wYQr71RazOeM5/cw81iBRD+A03aM9/C/obbrKjbYSpCmIVG3qT/Q8oeUo3Rz0IL7vI1tEbCB9pSiu8I/aV8x3Kg/BGWrWp4ZVs0nZfmAoEG4h/61yHYIJiFSl6Q0Vk6tTW1N8kYp8hdOkfHYYMXd2Qft+8CYwqYDSKvqIh+MCF8Wgca2u/cwdgeW3TtuVn6+1oBs3yLo5C2JpK6CvQzGpfUkz9UG/87gCsi5o2LIXolxN0FbwAsjOLEr+YJmXn7iR6N0BCt5p5cMxm7eAsfS+/CACQf4CTpKjzgkvr2cVarVTf96372yut7XLJ1sa7lv6VcfgYrWaxqr3Wlo1S6pvStr22sxOtTNPLzdY3nj20bPP+ejFdJYkLsjGLdtPBEbe/mr2bQKiXWJDroA+vtzc0p9aahuwqHMDYrQEXHEw9jwQl3drMpts9JBU1SdktPe5FBRdJQ6bwXBpa57ib2A8kukQDzMjh++Uo7Fo6Wd02Pkf4fknqoo4HtvAIjsqUcjx6DIPgWCaOML9rKI/oqD9/lgNrn+eF+p7j8tnzHBiR7+kdUGw/+V1Kzkc75mMy6U+FMaxjPibiM1U1uGM+puInHpmALZCgP4pt7i840MV8+0R1zPsRB6UTcqpizncYwZ89syDydfyWCwXB1l8/zRNGWbTG/GHKUm9AkxHMc/EGSk3z2+ArEhPEV5TUBLEvUGFcjEUH80J/jveTGOAJEljJbILWGQT3zRYiwuKsUXN1EEJAzBhRJFll7mBUG7KD8EqPkKekBREaL8hMDZLQSG6AQjtHPYmvTQnX0TtpC1SYCe2YdkkyLP3jj5BSbKiuR585eQhTgoje6yIb0Yb0C+mV6EYvebqw5SDy2WmubogZiF2AVxPC2FpDf8H2Q9QWo6IkjUxTWVEI3WY/wrCeSuqJ+eRWzXR/JXwgVjUMozbCOfoEZiSiKVGepqv5CJ8RyR4D7xBeamqa7z3BJ/z17JxuBPdv93d/a2Ki878MMAzDMAzDMAzDMAzDMF/KP09VUmxBAiI3AAAAAElFTkSuQmCC";
    fotoImg.alt = "Foto de perfil";
    fotoImg.id = "fotoPerfil";
    
    const btnCambiarFoto = document.createElement('button');
    btnCambiarFoto.className = "btn-cambiar-foto";
    btnCambiarFoto.textContent = "Cambiar Foto";
    
    fotoSection.appendChild(fotoImg);
    fotoSection.appendChild(btnCambiarFoto);
    
    //Sección de datos
    const datosSection = document.createElement('div');
    datosSection.className = "perfil-datos";
    
    datosSection.innerHTML = `
        <h3>${usuarioData.nombre || "Profesor"}</h3>
        <p><strong>Email:</strong> ${usuarioData.email || "No especificado"}</p>
        <p><strong>Grado Asignado:</strong> ${usuarioData.gradoAsignado || "No asignado"}</p>
    `;
    
    const btnEditar = document.createElement('button');
    btnEditar.className = "btn-editar";
    btnEditar.textContent = "Editar Datos";
    datosSection.appendChild(btnEditar);
    
    perfilContent.appendChild(fotoSection);
    perfilContent.appendChild(datosSection);
    
    //Sección de estadísticas
    const estadisticasSection = document.createElement('div');
    estadisticasSection.className = "perfil-estadisticas";
    
    estadisticasSection.innerHTML = `
        <h3>Datos Estadísticos del Grado</h3>
        <div class="estadisticas-grid"></div>
    `;
    
    const estadisticasGrid = estadisticasSection.querySelector('.estadisticas-grid');
    
    //Items de estadísticas
    const estadisticasData = [
        { label: "Alumnos Registrados", value: usuarioData.estadisticas?.alumnosRegistrados || 0 },
        { label: "Aprobados", value: usuarioData.estadisticas?.aprobados || 0 },
        { label: "Reprobados", value: usuarioData.estadisticas?.reprobados || 0 },
        { label: "Promedio General", value: usuarioData.estadisticas?.promedioGeneral || 0 }
    ];
    
    estadisticasData.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = "estadistica-item";
        itemElement.innerHTML = `
            <span class="estadistica-valor">${item.value}</span>
            <span class="estadistica-label">${item.label}</span>
        `;
        estadisticasGrid.appendChild(itemElement);
    });
    
    perfilContainer.appendChild(perfilHeader);
    perfilContainer.appendChild(perfilContent);
    perfilContainer.appendChild(estadisticasSection);
    
    Perfil.appendChild(perfilContainer);
    
    btnCambiarFoto.addEventListener('click', () => {
        console.log("Cambiar foto implementación");
    });
    
    btnEditar.addEventListener('click', () => {
        console.log("Editar datos implementación");
    });
    
    return Perfil;
}

export { Perfil };