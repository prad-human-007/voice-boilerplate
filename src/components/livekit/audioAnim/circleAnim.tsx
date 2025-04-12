import { useRef, useEffect } from "react"

export interface AudioVisComponentProps {
    stream: MediaStream;
    agentState?: string
}

export function CircleAnim({ stream, agentState }: AudioVisComponentProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const agentStateRef = useRef(agentState);
    const animationRef = useRef<number | null>(null);


    useEffect(() => {
        console.log('AGENT STATE in CIRCLE ANIM, ', agentState)
        agentStateRef.current = agentState;
    }, [agentState])

    useEffect(() => {
        console.log('AUDIO VIS STREAM in CIRCLE ANIM: ', stream)
        if (!stream || !canvasRef.current) return;

        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d");
        if(!ctx) return;

        const audioContext = new AudioContext();
        const audioSource = audioContext.createMediaStreamSource(stream);

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 32;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        audioSource.connect(analyser);
        
        const draw = () => {
            if(!canvas || !ctx) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            analyser.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = 50 + average / 3;

            // Create radial gradient
            const gradient = ctx.createRadialGradient(
                centerX, centerY, 50, // Inner circle
                centerX, centerY, radius ,  // Outer edge for blur
            );

            // Define gradient color stops
            gradient.addColorStop(0.4, "rgb(0, 0, 0)"); // Center solid color
            gradient.addColorStop(0.7, "rgba(128, 217, 255, 0.93)"); // Mid-opacity
            gradient.addColorStop(1, "rgba(255, 255, 255, 0)"); // Transparent edge
            // gradient.addColorStop(1, "rgba(0, 0, 0, 0.92)"); // Center solid color
            

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            animationRef.current = requestAnimationFrame(draw);
        }

        draw();

        return () => {
            cancelAnimationFrame(animationRef.current!);
        }
        
    }, [stream]);
    return (
        <div className='flex items-center justify-center'>
            <canvas ref={canvasRef} width={300} height={300} ></canvas>
        </div>
    )
}