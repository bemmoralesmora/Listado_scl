function identify(callback) {
  let identify = document.createElement("div");
  identify.className = "identify";

  const roles = [
    { rol: "administrador", img: "assets/images/user.png" },
    { rol: "profesor", img: "assets/images/user.png" },
    { rol: "alumno", img: "assets/images/user.png" },
  ];

  roles.forEach(({ rol, img }) => {
    let button = document.createElement("button");
    button.className = rol;

    // Crear imagen
    let image = document.createElement("img");
    image.src = img;
    image.alt = rol;

    // Texto del botón
    let text = document.createElement("span");
    text.textContent = rol.charAt(0).toUpperCase() + rol.slice(1);

    button.appendChild(image);
    button.appendChild(text);
    button.addEventListener("click", callback);

    identify.appendChild(button);
  });

  return identify;
}

export { identify };
