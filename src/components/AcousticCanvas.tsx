'use client';

import React, { useRef, useEffect } from 'react';
import { TriageSeverity } from '@/lib/triageClassifier';

interface AcousticCanvasProps {
  currentDisplacement: number;
  currentVelocity: number;
  spectrumData: Uint8Array | null;
  severity: TriageSeverity;
  sqi: number;
  carrierBin?: number; // Default: 789
  activeWindow?: [number, number]; // Default: [780, 798]
}

interface WaveformPoint {
  displacement: number;
  isPeak?: boolean;
  isTrough?: boolean;
}

export const AcousticCanvas: React.FC<AcousticCanvasProps> = ({
  currentDisplacement,
  currentVelocity,
  spectrumData,
  severity,
  sqi,
  carrierBin = 789,
  activeWindow = [780, 798],
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // High-performance ring buffer for oscilloscope displacement waveform
  const waveformBufferRef = useRef<WaveformPoint[]>([]);
  const maxPointsRef = useRef<number>(360); // ~6 seconds at 60 FPS

  // Waterfall history for Doppler energy spectrogram
  const waterfallHistoryRef = useRef<number[][]>([]);
  const maxWaterfallRowsRef = useRef<number>(45);

  const latestPropsRef = useRef({
    currentDisplacement,
    currentVelocity,
    spectrumData,
    severity,
    sqi,
    carrierBin,
    activeWindow,
  });

  useEffect(() => {
    latestPropsRef.current = {
      currentDisplacement,
      currentVelocity,
      spectrumData,
      severity,
      sqi,
      carrierBin,
      activeWindow,
    };
  }, [currentDisplacement, currentVelocity, spectrumData, severity, sqi, carrierBin, activeWindow]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let animId: number;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const updateCanvasSize = () => {
      const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
      const rect = container.getBoundingClientRect();
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height || 380);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const render = () => {
      const {
        currentDisplacement: disp,
        currentVelocity: vel,
        spectrumData: spec,
        severity: sev,
        sqi: sigQual,
        carrierBin: k0,
        activeWindow: win,
      } = latestPropsRef.current;

      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height || 380;

      // 1. Ingest displacement sample into waveform buffer
      const buffer = waveformBufferRef.current;
      const lastPoint = buffer[buffer.length - 1];
      const isPeak =
        lastPoint &&
        disp < lastPoint.displacement &&
        buffer.length > 2 &&
        buffer[buffer.length - 2].displacement < lastPoint.displacement &&
        lastPoint.displacement > 0.25;
      const isTrough =
        lastPoint &&
        disp > lastPoint.displacement &&
        buffer.length > 2 &&
        buffer[buffer.length - 2].displacement > lastPoint.displacement &&
        lastPoint.displacement < -0.25;

      // Clamp bounded displacement strictly within [-0.85, +0.85]
      const boundedDisp = Math.max(-0.85, Math.min(0.85, disp));
      buffer.push({ displacement: boundedDisp, isPeak: Boolean(isPeak), isTrough: Boolean(isTrough) });
      if (buffer.length > maxPointsRef.current) {
        buffer.shift();
      }

      // 2. Ingest Doppler slice into waterfall
      if (spec) {
        const slice: number[] = [];
        for (let k = win[0]; k <= win[1]; k++) {
          slice.push(spec[k] || 0);
        }
        const waterfall = waterfallHistoryRef.current;
        waterfall.push(slice);
        if (waterfall.length > maxWaterfallRowsRef.current) {
          waterfall.shift();
        }
      }

      // 3. Clear Background (Deep Medical Navy)
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, w, h);

      // Dual Viewport Partitioning: Top 58% Oscilloscope, Bottom 42% Doppler Waterfall
      const topHeight = Math.floor(h * 0.58);
      const bottomTop = topHeight + 4;
      const bottomHeight = h - bottomTop;

      // VIEWPORT 1: THORACIC DISPLACEMENT OSCILLOSCOPE
      renderOscilloscope(ctx, 0, 0, w, topHeight, buffer, sev, vel);

      // Partition Divider
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, topHeight + 2);
      ctx.lineTo(w, topHeight + 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // VIEWPORT 2: ULTRASONIC DOPPLER WATERFALL & VELOCITY
      renderDopplerSpectrogram(
        ctx,
        0,
        bottomTop,
        w,
        bottomHeight,
        waterfallHistoryRef.current,
        k0,
        win,
        vel,
        sigQual
      );

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  const renderOscilloscope = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    buffer: WaveformPoint[],
    severity: TriageSeverity,
    velocity: number
  ) => {
    ctx.save();
    ctx.strokeStyle = 'rgba(14, 116, 144, 0.15)';
    ctx.lineWidth = 1;

    const midY = y + h / 2;
    const yGridSteps = [0.15, 0.32, 0.5, 0.68, 0.85];
    yGridSteps.forEach((ratio) => {
      ctx.beginPath();
      ctx.moveTo(x, y + h * ratio);
      ctx.lineTo(x + w, y + h * ratio);
      ctx.stroke();
    });

    const xStep = w / 8;
    for (let gx = xStep; gx < w; gx += xStep) {
      ctx.beginPath();
      ctx.moveTo(gx, y);
      ctx.lineTo(gx, y + h);
      ctx.stroke();
    }

    // Zero-Axis Baseline (Glowing Cyan/Slate)
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.45)';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(x, midY);
    ctx.lineTo(x + w, midY);
    ctx.stroke();

    ctx.font = '10px "Geist Mono", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('THORACIC DISPLACEMENT OSCILLOSCOPE [x(t)]', x + 12, y + 16);

    ctx.fillStyle = 'rgba(148, 163, 184, 0.65)';
    ctx.fillText('+0.85 (Inhalation / Chest Expansion)', w - 230, y + 16);
    ctx.fillText('-0.85 (Exhalation / Chest Recoil)', w - 215, y + h - 8);
    ctx.fillText('0.0 (Tidal Baseline)', x + 12, midY - 4);

    if (buffer.length < 2) {
      ctx.restore();
      return;
    }

    let traceGlow = 'rgba(0, 242, 254, 0.9)';
    let strokeColor = '#00f2fe';
    if (severity === 'red') {
      traceGlow = 'rgba(239, 68, 68, 0.9)';
      strokeColor = '#ef4444';
    } else if (severity === 'yellow') {
      traceGlow = 'rgba(245, 158, 11, 0.9)';
      strokeColor = '#f59e0b';
    }

    ctx.shadowBlur = 10;
    ctx.shadowColor = traceGlow;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2.4;
    ctx.beginPath();

    const dx = w / maxPointsRef.current;
    const startX = w - buffer.length * dx;

    buffer.forEach((pt, idx) => {
      const px = startX + idx * dx;
      // Amplitude scaled to 40% of viewport height: never touches top or bottom
      const py = midY - pt.displacement * (h * 0.40);

      if (idx === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    });
    ctx.stroke();

    // Subtle Under-Curve Ambient Glow
    ctx.shadowBlur = 0;
    const lastX = w;
    const lastY = midY - buffer[buffer.length - 1].displacement * (h * 0.40);

    ctx.lineTo(lastX, midY);
    ctx.lineTo(startX, midY);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, y, 0, y + h);
    grad.addColorStop(0, 'rgba(0, 242, 254, 0.14)');
    grad.addColorStop(0.5, 'rgba(0, 242, 254, 0.02)');
    grad.addColorStop(1, 'rgba(0, 242, 254, 0.14)');
    ctx.fillStyle = grad;
    ctx.fill();

    // Lead Cursor
    ctx.shadowBlur = 14;
    ctx.shadowColor = traceGlow;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(lastX - 2, lastY, 4, 0, 2 * Math.PI);
    ctx.fill();

    // Real-Time Velocity Annotation
    const velText = `v(t) = ${(velocity * 100).toFixed(1)} cm/s`;
    ctx.shadowBlur = 0;
    ctx.font = '10px "Geist Mono", monospace';
    ctx.fillStyle = velocity >= 0 ? '#34d399' : '#f87171';
    ctx.fillText(velText, lastX - 95, lastY - 8 > y + 25 ? lastY - 8 : lastY + 18);

    ctx.restore();
  };

  const renderDopplerSpectrogram = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    waterfall: number[][],
    k0: number,
    win: [number, number],
    velocity: number,
    sqi: number
  ) => {
    ctx.save();

    ctx.font = '10px "Geist Mono", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('ULTRASONIC DOPPLER WATERFALL [18.5 kHz CARRIER]', x + 12, y + 14);

    ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
    ctx.fillText('-180 Hz (Recoil / Exhalation)', x + 12, y + h - 8);
    ctx.fillText(`f0 = 18,500 Hz [Carrier Bin ${k0}]`, w / 2 - 90, y + 14);
    ctx.fillText('+180 Hz (Expansion / Inhalation)', w - 190, y + h - 8);

    const winBins = win[1] - win[0] + 1; // 19 active bins
    const cellW = (w - 24) / winBins;
    const offsetX = x + 12;
    const matrixY = y + 20;
    const matrixH = h - 34;

    // High-Contrast Multi-Color Doppler Waterfall
    if (waterfall.length > 0) {
      const rowH = matrixH / maxWaterfallRowsRef.current;

      waterfall.forEach((row, rowIdx) => {
        const ry = matrixY + rowIdx * rowH;

        row.forEach((magnitude, colIdx) => {
          const rx = offsetX + colIdx * cellW;
          // Non-linear contrast amplification
          const norm = Math.min(1.0, Math.pow(magnitude / 215.0, 0.72));

          let fill = 'rgba(6, 15, 35, 0.45)';
          if (norm > 0.04) {
            const alpha = Math.min(1.0, 0.35 + norm * 0.65).toFixed(2);
            if (norm > 0.68) {
              fill = `rgba(244, 63, 94, ${alpha})`; // Crimson peak
            } else if (norm > 0.38) {
              fill = `rgba(16, 185, 129, ${alpha})`; // Emerald active Doppler shift
            } else if (norm > 0.14) {
              fill = `rgba(6, 182, 212, ${alpha})`; // Cyan sideband glow
            } else {
              fill = `rgba(30, 58, 138, ${alpha})`;
            }
          }

          ctx.fillStyle = fill;
          ctx.fillRect(rx, ry, cellW - 1, rowH);
        });
      });
    }

    // Carrier Center Notch Line
    const carrierColIndex = k0 - win[0];
    const carrierCenterX = offsetX + carrierColIndex * cellW + cellW / 2;

    ctx.strokeStyle = 'rgba(239, 68, 68, 0.75)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(carrierCenterX, matrixY);
    ctx.lineTo(carrierCenterX, matrixY + matrixH);
    ctx.stroke();

    // Dynamic Doppler Frequency Shift Centroid Tick
    const maxVelocityDisplay = 0.5;
    const velOffsetNorm = Math.min(1.0, Math.max(-1.0, velocity / maxVelocityDisplay));
    const centroidX = carrierCenterX + velOffsetNorm * ((w - 48) / 2);

    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00f2fe';
    ctx.fillStyle = '#00f2fe';
    ctx.beginPath();
    ctx.moveTo(centroidX, matrixY);
    ctx.lineTo(centroidX - 4, matrixY - 6);
    ctx.lineTo(centroidX + 4, matrixY - 6);
    ctx.closePath();
    ctx.fill();

    // High-Confidence SQI Tag
    ctx.shadowBlur = 0;
    ctx.font = '9px "Geist Mono", monospace';
    ctx.fillStyle = 'rgba(52, 211, 153, 0.95)';
    ctx.fillText(`SQI: ${sqi}% CNR (Optimal)`, w - 135, y + 14);

    ctx.restore();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[380px] rounded-xl overflow-hidden border border-cyan-500/30 bg-slate-950/80 shadow-[0_0_25px_rgba(0,242,254,0.08)] backdrop-blur-md"
    >
      <canvas ref={canvasRef} className="block w-full h-full cursor-crosshair" />

      <div className="absolute top-3 right-3 flex items-center space-x-2 pointer-events-none">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>
        <span className="text-[10px] font-mono tracking-wider uppercase text-cyan-400/90 font-semibold bg-slate-900/80 px-2 py-0.5 rounded border border-cyan-500/20">
          60 FPS HARDWARE SYNC
        </span>
      </div>
    </div>
  );
};
