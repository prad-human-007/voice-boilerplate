import { useEffect, useRef } from "react";

export interface SoundBarsProps {
    stream: MediaStream;
    agentState?: string
    colors?: string[]
}

export function SoundBars({stream}: SoundBarsProps) {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null)
    const freqArrayRef = useRef<Uint8Array | null>(null);
    const animationRef = useRef<number | null>(null);
    const numberOfLines = 512
    const numberOfBars = 5;
  
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
    

      const length = new Array(numberOfBars).fill(1);
      let normSamples = new Array(numberOfLines).fill(0);


      const draw = () => {

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if(analyserRef.current && freqArrayRef.current) {
            normSamples = new Array(analyserRef.current.frequencyBinCount).fill(0);
            analyserRef.current.getByteTimeDomainData(freqArrayRef.current);
            normSamples = Array.from(freqArrayRef.current).map(e => Math.abs((e/128) - 1) * 40);
        }

        const fiveArr = new Array(numberOfBars).fill(0);
        for(let i=0; i<fiveArr.length; i++) {
            const eles:number = Math.floor(normSamples.length/fiveArr.length);
            let sum = 0;
            const st = i*eles, ed= Math.min(i*eles+eles, normSamples.length);
            for(let j=st; j<ed; j++) {
                sum += normSamples[j];
            }
            console.log("Sum: ", sum, "Eles: ", eles); 
            fiveArr[i] = sum/eles;
        }


        // console.log("Norm Samples: ", normSamples.length);
        const gap = canvas.width / fiveArr.length;
        const barwidth = gap * 0.8
        for(let i=0; i<fiveArr.length; i++) {
            const temp = 10 + 15* Math.abs(fiveArr[i]);
            console.log("Temp: ", i, fiveArr[i], temp);
            if(temp > length[i]) length[i] = Math.min(temp, length[i] + length[i] * 0.4);
            else length[i] -= length[i] * 0.04;
            if(length[i] < 0.5) length[i] = 0;

            ctx.fillStyle = 'blue';

            // Define the corner radius
            const cornerRadius = 30; // Adjust this value to control the roundness of the corners

            // Draw a rounded rectangle
            ctx.beginPath();
            ctx.roundRect(gap * i, 100 - length[i] / 2, barwidth, length[i], cornerRadius);
            // Create gradient
            const gradient = ctx.createLinearGradient(gap * i, 100 - length[i] / 2, gap * i, 100 + length[i] / 2);
            gradient.addColorStop(0, '#6366f1');
            gradient.addColorStop(1, '#8b5cf6');
            ctx.fillStyle = gradient;
            ctx.fill();
        }

        animationRef.current = requestAnimationFrame(draw);
        
      }

      draw();

      return () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationRef.current!);
      };
  
    }, [])

    useEffect(() => {
        if (!stream) return;
    
        const audioContext = new AudioContext();
        analyserRef.current = audioContext.createAnalyser();
        analyserRef.current.fftSize = numberOfLines; 
        const audioSource = audioContext.createMediaStreamSource(stream);
        // Higher FFT size for smoother animation
        audioSource.connect(analyserRef.current);
        const bufferLength = analyserRef.current.fftSize;
        freqArrayRef.current = new Uint8Array(bufferLength);
        
    
        return () => {
        audioContext.close();
        };
    }, [stream]);

      return (
        <canvas
        ref={canvasRef}
        width={200}
        height={200}>
        </canvas>
      )
}