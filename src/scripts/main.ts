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


// src/scripts/carousel.ts
let currentIndex = 0;

window.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track") as HTMLElement;
  const items = document.querySelectorAll(".carousel-item");
  const itemWidth = items[0].clientWidth + 30; // 300px + 2*15px margin
  const totalItems = items.length;

  const prevBtn = document.getElementById("prevBtn") as HTMLButtonElement;
  const nextBtn = document.getElementById("nextBtn") as HTMLButtonElement;

  function updateCarousel() {
    const offset = -currentIndex * itemWidth;
    track.style.transform = `translateX(${offset}px)`;
  }

  prevBtn?.addEventListener("click", () => {
    currentIndex = Math.max(currentIndex - 1, 0);
    updateCarousel();
  });

  nextBtn?.addEventListener("click", () => {
    const maxIndex = totalItems - Math.floor(window.innerWidth / itemWidth);
    currentIndex = Math.min(currentIndex + 1, maxIndex);
    updateCarousel();
  });

  // Autoplay opcional
  setInterval(() => {
    const maxIndex = totalItems - Math.floor(window.innerWidth / itemWidth);
    currentIndex = (currentIndex + 1) > maxIndex ? 0 : currentIndex + 1;
    updateCarousel();
  }, 6000);

  window.addEventListener("resize", updateCarousel);
});
