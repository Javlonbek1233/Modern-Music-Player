import React, { useRef, useEffect } from 'react';

interface VisualizerProps {
  analyzerValues: number[];
  isPlaying: boolean;
  color: string; // Theme accent color
}

export const Visualizer: React.FC<VisualizerProps> = ({ analyzerValues, isPlaying, color }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const itemsCount = analyzerValues.length;

    // Set high DPI Resolution for crisp canvas renders
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const draw = () => {
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      // Clear with soft gradient or transparency for overlays
      ctx.clearRect(0, 0, width, height);

      // Create neon gradient for waves
      const grad = ctx.createLinearGradient(0, height, 0, 0);
      grad.addColorStop(0, `${color}20`); // faint transparency at bottom
      grad.addColorStop(0.5, `${color}90`); // semi-solid middle
      grad.addColorStop(1, color); // solid neon on top

      // Draw bars or waves
      const barWidth = width / itemsCount;
      const radius = 2; // custom rounds

      ctx.beginPath();
      for (let i = 0; i < itemsCount; i++) {
        // Frequency height value scaled to canvas bounds
        const value = (analyzerValues[i] / 200) * (height - 10);
        const x = i * barWidth;
        const y = height - Math.max(2, value);

        // Rounded bar caps
        ctx.fillStyle = grad;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x + 1, y, barWidth - 2, Math.max(2, value), radius);
        } else {
          ctx.rect(x + 1, y, barWidth - 2, Math.max(2, value));
        }
        ctx.fill();
      }

      // Draw secondary mirror floating wave lines for premium look
      ctx.beginPath();
      ctx.strokeStyle = `${color}40`;
      ctx.lineWidth = 1.5;
      for (let i = 0; i < itemsCount; i++) {
        const val = (analyzerValues[i] / 220) * (height / 2);
        const x = i * barWidth + barWidth / 2;
        const y = height / 2 + Math.sin(Date.now() * 0.0015 + i * 0.1) * (val + 5);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      animId = requestAnimationFrame(draw);
    };

    draw();

    // Re-adjust bounds on resize
    const handleResize = () => {
      const parentRect = canvas.getBoundingClientRect();
      canvas.width = parentRect.width * dpr;
      canvas.height = parentRect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [analyzerValues, color]);

  return (
    <div className="w-full h-full relative group">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block rounded-xl cursor-pointer"
        title="Interactive Audio Spectrum"
      />
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center opacity-40 text-xs font-mono text-slate-400 select-none">
          Waves Idle — Play audio to animate
        </div>
      )}
    </div>
  );
};
