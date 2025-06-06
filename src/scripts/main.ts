// Script para el efecto de escritura de texto
const textos: string[] = [ // Añadimos el tipo 'string[]' al array
  "Desarrollador Web...",
  "Ingeniero de sistemas...",
  "Full Stack Developer...",
];
// Especificamos que 'elemento' puede ser un HTMLElement o null. TypeScript lo infiere, pero es buena práctica.
const elemento = document.getElementById("texto") as HTMLElement | null;

let textoIndex: number = 0; // Añadimos el tipo 'number'
let charIndex: number = 0; // Añadimos el tipo 'number'
let borrando: boolean = false; // Añadimos el tipo 'boolean'

function escribir(): void { // Añadimos el tipo de retorno 'void' (la función no devuelve nada)
  if (!elemento) return; // Salir si el elemento no existe

  const textoActual: string = textos[textoIndex]; // Añadimos el tipo 'string'

  if (!borrando) {
    elemento.textContent = textoActual.substring(0, charIndex++);
    if (charIndex > textoActual.length) {
      borrando = true;
      setTimeout(escribir, 1500);
      return;
    }
  } else {
    elemento.textContent = textoActual.substring(0, charIndex--);
    if (charIndex < 0) {
      borrando = false;
      textoIndex = (textoIndex + 1) % textos.length;
    }
  }
  setTimeout(escribir, borrando ? 50 : 100);
}

if (elemento) {
  // Solo iniciar si el elemento existe
  escribir();
}

//-----------------------------------------SCRIPT Expandir las cajas-------------------------------------------

// Script para expandir/contraer la caja de experiencia
document.addEventListener('DOMContentLoaded', () => {
  // querySelectorAll devuelve un NodeListOf<Element>, que convertimos a Array de HTMLButtonElement
  const botonesDetalles = document.querySelectorAll('.boton-detalles') as NodeListOf<HTMLButtonElement>;

  botonesDetalles.forEach(button => {
    button.addEventListener('click', () => {
      // .closest() devuelve Element o null. Especificamos que puede ser HTMLElement.
      const cajaExperiencia = button.closest('.caja-experiencia') as HTMLElement | null;
      if (cajaExperiencia) { // Asegurarse de que encontró la caja padre
        cajaExperiencia.classList.toggle('expandida');

        // Cambiar el texto del botón
        if (cajaExperiencia.classList.contains('expandida')) {
          button.textContent = 'Menos detalles';
          // Opcional: Desplazarse a la caja expandida para mejor UX
          cajaExperiencia.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          button.textContent = 'Más detalles';
        }
      }
    });
  });
});

// --------------------------Script para el carrusel de certificados-------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  // Usamos 'as HTMLElement | null' para indicar que querySelector puede devolver null.
  const carouselContainer = document.querySelector(".carousel-container") as HTMLElement | null;
  const carouselTrack = document.querySelector(".carousel-track") as HTMLElement | null;
  // querySelectorAll devuelve NodeListOf<Element>. Usamos Array.from y luego 'as HTMLElement[]'
  // para tipar el array resultante si estamos seguros de que serán elementos HTML.
  const carouselItems = Array.from(document.querySelectorAll(".carousel-item")) as HTMLElement[];

  if (!carouselContainer || !carouselTrack || carouselItems.length === 0) {
    console.warn(
      "Advertencia: Elementos del carrusel no encontrados. El carrusel no funcionará."
    );
    return; // Añadir un 'return' para salir si no se encuentran los elementos
  }

  console.log("Script de carrusel cargado.");

  const allImagesLoaded = carouselItems.map((item) => {
    const img = item.querySelector("img"); // querySelector devuelve HTMLImageElement | null
    if (img && !img.complete) {
      return new Promise<void>((resolve) => {
        img.addEventListener("load", () => resolve());
        img.addEventListener("error", () => {
          console.error(`Error al cargar imagen: ${img ? img.src : 'URL desconocida'}`); // Agregamos verificación para img.src
          resolve();
        });
      });
    }
    return Promise.resolve();
  });

  Promise.all(allImagesLoaded)
    .then(() => {
      console.log("Todas las imágenes del carrusel han terminado de cargar.");

      let totalOriginalWidth: number = 0; // Añadimos el tipo 'number'
      carouselItems.forEach((item) => {
        // 'item' ya es HTMLElement[] gracias a la aserción inicial
        const itemWidth: number = item.offsetWidth; // Añadimos el tipo 'number'
        const itemStyle: CSSStyleDeclaration = window.getComputedStyle(item); // Añadimos el tipo 'CSSStyleDeclaration'
        const itemMarginLeft: number = parseFloat(itemStyle.marginLeft); // Añadimos el tipo 'number'
        const itemMarginRight: number = parseFloat(itemStyle.marginRight); // Añadimos el tipo 'number'
        totalOriginalWidth += itemWidth + itemMarginLeft + itemMarginRight;
      });

      // Duplicar visualmente los ítems para el efecto de bucle suave
      // Clona una cantidad suficiente de ítems para cubrir la vista y asegurar el bucle
      const numItemsToClone: number = carouselItems.length; // Añadimos el tipo 'number'
      for (let i = 0; i < numItemsToClone; i++) {
        if (carouselItems[i]) {
          // cloneNode devuelve Node. Lo convertimos a HTMLElement.
          const clone = carouselItems[i].cloneNode(true) as HTMLElement;
          if (carouselTrack) { // Asegurarse de que carouselTrack no es null
              carouselTrack.appendChild(clone);
          }
        }
      }

      // Recalcular el ancho total del track después de añadir clones
      let fullTrackWidthWithClones: number = 0; // Añadimos el tipo 'number'
      // child aquí es de tipo Element. Lo convertimos a HTMLElement.
      Array.from(carouselTrack.children).forEach((child) => {
        const childEl = child as HTMLElement; // Casting
        const childWidth: number = childEl.offsetWidth; // Añadimos el tipo 'number'
        const childStyle: CSSStyleDeclaration = window.getComputedStyle(childEl); // Añadimos el tipo 'CSSStyleDeclaration'
        const childMarginLeft: number = parseFloat(childStyle.marginLeft); // Añadimos el tipo 'number'
        const childMarginRight: number = parseFloat(childStyle.marginRight); // Añadimos el tipo 'number'
        fullTrackWidthWithClones +=
          childWidth + childMarginLeft + childMarginRight;
      });
      if (carouselTrack) { // Asegurarse de que carouselTrack no es null
        carouselTrack.style.width = `${fullTrackWidthWithClones}px`;
      }


      console.log(
        "Ancho total de los items originales:",
        totalOriginalWidth,
        "px"
      );
      console.log(
        "Ancho del track con clones:",
        fullTrackWidthWithClones,
        "px"
      );

      // --- Configuración de la animación con JavaScript ---
      const pixelsPerSecond: number = 150; // Añadimos el tipo 'number'
      let currentPosition: number = 0; // Añadimos el tipo 'number'
      let animationFrameId: number; // Añadimos el tipo 'number' (para el ID del requestAnimationFrame)
      let lastTimestamp: DOMHighResTimeStamp; // Añadimos el tipo 'DOMHighResTimeStamp'

      // La función para el requestAnimationFrame
      const startScrolling = (timestamp: DOMHighResTimeStamp) => {
        if (!lastTimestamp) lastTimestamp = timestamp;
        const deltaTime: number = timestamp - lastTimestamp; // Añadimos el tipo 'number'
        lastTimestamp = timestamp;

        currentPosition -= pixelsPerSecond * (deltaTime / 1000);

        if (currentPosition <= -totalOriginalWidth) {
          currentPosition += totalOriginalWidth;
        }
        if (carouselTrack) { // Asegurarse de que carouselTrack no es null
            carouselTrack.style.transform = `translateX(${currentPosition}px)`;
        }
        animationFrameId = requestAnimationFrame(startScrolling);
      };

      const stopScrolling = () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };

      startScrolling(performance.now());

      if (carouselContainer) { // Asegurarse de que carouselContainer no es null
        carouselContainer.addEventListener("mouseenter", stopScrolling);
        carouselContainer.addEventListener("mouseleave", () => {
          lastTimestamp = performance.now();
          startScrolling(lastTimestamp);
        });
      }

      console.log("Carrusel iniciado con JavaScript.");
    })
    .catch((error: unknown) => { // Añadimos el tipo 'unknown' para el error
      console.error("Error general en el script del carrusel:", error);
    });
});