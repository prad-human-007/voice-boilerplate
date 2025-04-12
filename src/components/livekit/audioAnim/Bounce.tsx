import { useRef, useEffect } from "react";

export interface BounceProps {
  stream: MediaStream;
  agentState?: string
  colors?: string[]
}

export function Bounce({ stream }: BounceProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null)
  const freqArrayRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    if(!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if(!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width/3; // Radius of the gaseous circle
    const numberOfCircles = 50

    const gradients = Array.from({ length: numberOfCircles }, () => ({
      x: centerX + (Math.random() - 0.5) * radius,
      y: centerY + (Math.random() - 0.5) * radius,
      dx: (Math.random() - 0.5) * 2,
      dy: (Math.random() - 0.5) * 2,
      color: `rgba(${Math.random() * 255}, ${Math.random() * 255}, 255, 0.75)`,
    }));

    const draw = () => {
      let average = 0;
      if(analyserRef.current && freqArrayRef.current) {
        analyserRef.current.getByteFrequencyData(freqArrayRef.current);
        const bufferLength = analyserRef.current.frequencyBinCount;
        average = freqArrayRef.current.reduce((sum, value) => sum + value, 0) / bufferLength;
      }
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw circle background
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0)"; // Dim glow for the background
      ctx.fill();
      ctx.closePath();

      // Fog-like gradients
      gradients.forEach((g) => {
        g.x += g.dx * (0.5 + average / 30); // Increase speed based on audio
        g.y += g.dy * (0.5 + average / 30);

        // Reflect off the circle boundary
        const dx = g.x - centerX;
        const dy = g.y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > radius) {
          const angle = Math.atan2(dy, dx);
          g.x = centerX + Math.cos(angle) * radius;
          g.y = centerY + Math.sin(angle) * radius;
          g.dx *= -1;
          g.dy *= -1;
        }

        // Draw radial gradient for the fog
        const gradient = ctx.createRadialGradient(g.x, g.y, radius/5, g.x, g.y, radius/2);
        gradient.addColorStop(0, g.color);
        gradient.addColorStop(0.7, "rgba(255, 255, 255, 0)");
        // gradient.addColorStop(1, "rgba(244, 244, 244, 0)"); // Transparent edge

        ctx.beginPath();
        ctx.arc(g.x, g.y, radius/1.5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
        cancelAnimationFrame(animationRef.current!);
    }

  }, []);

  useEffect(() => {
    if (!stream) return;

    const audioContext = new AudioContext();
    const audioSource = audioContext.createMediaStreamSource(stream);

    analyserRef.current = audioContext.createAnalyser();
    analyserRef.current.fftSize = 32;
    const bufferLength = analyserRef.current.frequencyBinCount;
    freqArrayRef.current = new Uint8Array(bufferLength);

    audioSource.connect(analyserRef.current);

    return () => {
        audioContext.close();
    }
    
  }, [stream]);

  return (
    <div className="">
      <canvas ref={canvasRef} width={200} height={200}></canvas>
    </div>
  );
}
