import { header } from "./header.js";
import { footer } from "./footer.js";
import { desing_inicio } from "./inicio.js";

function inicio() {
  let section = document.createElement("section");
  section.className = "inicio";

  section.appendChild(header());

  // Cambiar a clase en lugar de ID para mantener consistencia
  let contenido = document.createElement("div");
  contenido.className = "contenido";
  contenido.appendChild(desing_inicio());

  section.appendChild(contenido);
  section.appendChild(footer());

  return section;
}

export { inicio };
