import React, { useEffect, useRef } from 'react';
import { createNoise3D } from 'simplex-noise';

export default function ParticleNoiseBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false }); // alpha: false for slight performance boost since we draw the background ourselves
    const noise3D = createNoise3D();
    
    let animationFrameId;
    let width, height;
    let dots = [];
    
    // Configuration
    const dotSpacing = 35; // Space between dots in the grid
    const noiseScale = 0.0015; // How stretched the noise field is
    const timeScale = 0.00008; // Ultra-slow elegant motion

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      
      // High-DPI screen support for crisp dots
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      
      initDots();
    };

    const initDots = () => {
      dots = [];
      const cols = Math.floor(width / dotSpacing) + 2;
      const rows = Math.floor(height / dotSpacing) + 2;
      
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          dots.push({
            baseX: i * dotSpacing - dotSpacing / 2,
            baseY: j * dotSpacing - dotSpacing / 2,
            // Randomly assign one of our theme colors: Cyan or Neon Pink
            colorRGB: Math.random() > 0.5 ? '6, 182, 212' : '236, 72, 153'
          });
        }
      }
    };

    let time = 0;
    const render = () => {
      // Draw base dark background
      ctx.fillStyle = '#020617'; // slate-950
      ctx.fillRect(0, 0, width, height);

      time += 16 * timeScale; // advance time

      dots.forEach(dot => {
        // Sample 3D noise for organic movement
        const nx = dot.baseX * noiseScale;
        const ny = dot.baseY * noiseScale;
        
        const n1 = noise3D(nx, ny, time);
        const n2 = noise3D(nx + 100, ny + 100, time); // offset for independent movement
        
        // Fluid offsets
        const offsetX = n1 * 25;
        const offsetY = n2 * 25;
        
        const x = dot.baseX + offsetX;
        const y = dot.baseY + offsetY;
        
        // Size variation based on noise (creates depth effect)
        const n3 = noise3D(nx - 100, ny - 100, time);
        const radius = Math.max(0.5, (n3 + 1) * 1.5); // Radius between 0.5 and 3.0
        
        // Opacity variation (creates twinkling/shimmering effect)
        const opacity = Math.max(0.1, (n1 + 1) * 0.4);

        // Draw the dot
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dot.colorRGB}, ${opacity})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resize);
    resize();
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-[-1]"
    />
  );
}
