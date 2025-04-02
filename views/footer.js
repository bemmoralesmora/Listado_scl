function footer(){
    let footer = document.createElement('footer');
    footer.className = "footer";

    let contenido_f = document.createElement("div");
    contenido_f.className = "contenido-f";
    footer.appendChild(contenido_f);

    let logo = document.createElement('a');

    let logo_img = document.createElement('img');
    logo_img.src = "views/images/GitHub-logo.png"
    logo.className = "logo-git";
    logo.href = "https://github.com/bemmoralesmora/Listado_scl";
    logo.appendChild(logo_img);
    contenido_f.appendChild(logo);

    let nombre = document.createElement('h1');
    nombre.className = "nombre-f";
    nombre.textContent = "bemorales@scl.edu.gt"
    contenido_f.appendChild(nombre);

    let linea_baja = document.createElement('div');
    linea_baja.className = "linea-f";
    footer.appendChild(linea_baja);

    return footer;
}

export {footer};