/**
 * Background Paths Animation
 * Ported from Next.js BackgroundPaths component
 * Uses GSAP for high-performance SVG animations
 */

(function () {
    'use strict';

    console.log("BG Paths: Initializing...");

    const container = document.createElement('div');
    container.id = 'bg-paths-container';
    container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1; /* Same as canvas to be visible above aura */
        pointer-events: none;
        overflow: hidden;
    `;

    // Insert at the very beginning of body
    document.body.insertAdjacentElement('afterbegin', container);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 696 316");
    svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
    svg.setAttribute("fill", "none");
    svg.style.cssText = "width: 100%; height: 100%; opacity: 0.8;"; // Increased opacity
    container.appendChild(svg);

    function createPaths(position) {
        console.log(`BG Paths: Creating paths for position ${position}`);
        for (let i = 0; i < 36; i++) {
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            
            const d = `M-${380 - i * 5 * position} -${189 + i * 6}C-${
                380 - i * 5 * position
            } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
                152 - i * 5 * position
            } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
                684 - i * 5 * position
            } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`;

            // Increase visual presence
            const opacity = 0.2 + i * 0.02; 
            const width = 1.0 + i * 0.05;

            path.setAttribute("d", d);
            
            // More vibrant colors from theme
            const colors = ['#06B6D4', '#8B5CF6', '#FFD700', '#FFFFFF'];
            const color = colors[i % colors.length];
            
            path.setAttribute("stroke", color);
            path.setAttribute("stroke-width", width.toString());
            path.setAttribute("stroke-opacity", opacity.toString());
            path.setAttribute("stroke-linecap", "round");
            
            svg.appendChild(path);

            if (typeof gsap !== 'undefined') {
                const length = path.getTotalLength();
                
                if (length === 0) continue;

                gsap.set(path, {
                    strokeDasharray: length,
                    strokeDashoffset: length,
                    opacity: 0.4
                });

                // Path drawing animation
                gsap.to(path, {
                    strokeDashoffset: -length,
                    duration: 10 + Math.random() * 15, // Slightly faster
                    repeat: -1,
                    ease: "none",
                    delay: Math.random() * -25
                });

                // Opacity pulse
                gsap.to(path, {
                    opacity: 0.8,
                    duration: 2 + Math.random() * 2,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });
            }
        }
    }

    // Boot
    function init() {
        if (typeof gsap !== 'undefined') {
            console.log("BG Paths: GSAP detected. Creating paths...");
            createPaths(1);
            createPaths(-1);
        } else {
            console.error("BG Paths: GSAP NOT FOUND!");
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
