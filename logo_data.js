/**
 * logo_data.js
 * Utilitario para procesar el logo y extraer datos para animación.
 */

window.LogoData = {
    // Configuración base
    config: {
        width: 300,
        height: 150, // Ajustado para un logo más horizontal
        gap: 2, // Espacio entre puntos (mayor = menos puntos = más rápido)
        threshold: 20 // Umbral de alpha para considerar un pixel visible
    },

    /**
     * Carga la imagen y extrae las coordenadas de los pixeles visibles.
     * @param {string} src - URL de la imagen del logo
     * @returns {Promise<{width: number, height: number, particles: Array<{x, y, color, bx, by}>}>}
     */
    extractPoints: (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = src;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Mantener aspect ratio pero limitar tamaño máximo para performance
                const maxSize = 400; // px
                let w = img.width;
                let h = img.height;
                
                if (w > h) {
                    if (w > maxSize) {
                        h *= maxSize / w;
                        w = maxSize;
                    }
                } else {
                    if (h > maxSize) {
                        w *= maxSize / h;
                        h = maxSize;
                    }
                }

                canvas.width = w;
                canvas.height = h;

                // Dibujar imagen
                ctx.drawImage(img, 0, 0, w, h);
                
                // Obtener datos de pixeles
                const idata = ctx.getImageData(0, 0, w, h);
                const data = idata.data;
                const particles = [];
                const gap = window.LogoData.config.gap;

                // Iterar sobre pixeles
                for (let y = 0; y < h; y += gap) {
                    for (let x = 0; x < w; x += gap) {
                        const index = (y * w + x) * 4;
                        const alpha = data[index + 3];

                        if (alpha > window.LogoData.config.threshold) {
                            const r = data[index];
                            const g = data[index + 1];
                            const b = data[index + 2];
                            
                            particles.push({
                                x: x, // Posición destino X
                                y: y, // Posición destino Y
                                color: `rgb(${r},${g},${b})`,
                                // Posiciones iniciales aleatorias (se pueden sobrescribir luego)
                                bx: Math.random() * w,
                                by: Math.random() * h 
                            });
                        }
                    }
                }

                resolve({
                    width: w,
                    height: h,
                    particles: particles
                });
            };

            img.onerror = (e) => reject(e);
        });
    }
};
