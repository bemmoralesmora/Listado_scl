// notifications.js
export function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  // Estilos básicos para las notificaciones
  notification.style.position = "fixed";
  notification.style.bottom = "20px";
  notification.style.right = "20px";
  notification.style.padding = "15px 20px";
  notification.style.backgroundColor = type === "error" ? "#ff4444" : "#4CAF50";
  notification.style.color = "white";
  notification.style.borderRadius = "4px";
  notification.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
  notification.style.zIndex = "1000";
  notification.style.animation = "slideIn 0.3s ease-out";

  document.body.appendChild(notification);

  // Animación para desaparecer
  setTimeout(() => {
    notification.style.animation = "fadeOut 0.5s ease-out";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 500);
  }, 3000);

  // Agregar estilos CSS para las animaciones
  const style = document.createElement("style");
  style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    `;
  document.head.appendChild(style);
}

// Versión alternativa con opciones más configurables
export function showAdvancedNotification(options) {
  const {
    message,
    type = "success",
    position = "bottom-right",
    duration = 3000,
    onClose = () => {},
  } = options;

  const notification = document.createElement("div");
  notification.className = `notification ${type} ${position}`;
  notification.textContent = message;

  // Configuración de estilos según el tipo
  const typeStyles = {
    success: {
      backgroundColor: "#4CAF50",
      color: "white",
    },
    error: {
      backgroundColor: "#ff4444",
      color: "white",
    },
    warning: {
      backgroundColor: "#ffbb33",
      color: "black",
    },
    info: {
      backgroundColor: "#33b5e5",
      color: "white",
    },
  };

  // Configuración de posición
  const positionStyles = {
    "top-right": {
      top: "20px",
      right: "20px",
      bottom: "auto",
      left: "auto",
    },
    "top-left": {
      top: "20px",
      left: "20px",
      bottom: "auto",
      right: "auto",
    },
    "bottom-right": {
      bottom: "20px",
      right: "20px",
      top: "auto",
      left: "auto",
    },
    "bottom-left": {
      bottom: "20px",
      left: "20px",
      top: "auto",
      right: "auto",
    },
  };

  // Aplicar estilos
  Object.assign(notification.style, {
    position: "fixed",
    padding: "15px 20px",
    borderRadius: "4px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    zIndex: "1000",
    animation: "slideIn 0.3s ease-out",
    ...typeStyles[type],
    ...positionStyles[position],
  });

  document.body.appendChild(notification);

  // Temporizador para desaparecer
  setTimeout(() => {
    notification.style.animation = "fadeOut 0.5s ease-out";
    setTimeout(() => {
      document.body.removeChild(notification);
      onClose();
    }, 500);
  }, duration);

  // Agregar estilos CSS si no existen
  if (!document.getElementById("notification-styles")) {
    const style = document.createElement("style");
    style.id = "notification-styles";
    style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        .notification.top-left {
          animation: slideInLeft 0.3s ease-out;
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
    document.head.appendChild(style);
  }
}
