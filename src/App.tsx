import React, { useRef } from 'react';
import './App.css';
import jsQR from "jsqr"; 

function App() {
 
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const chunks:any = [];
  let stream:any ;
  const startScanning = async () => {
    stream = await navigator.mediaDevices.getDisplayMedia({
      video: true
    })
    
    let mediaRecorder = new MediaRecorder(stream, {
      mimeType: "video/webm"
    })
    mediaRecorder.addEventListener('dataavailable', async function(e) {
      
      chunks.push(e.data)
      let blob = new Blob(chunks, {
        type: chunks[0].type
      })
      let url = URL.createObjectURL(blob)
      videoRef.current!.src = await url
      videoRef.current!.oncanplay = () => {
        const canvas = canvasRef.current!.getContext("2d");
        setTimeout(async () => {
          
          canvas!.drawImage(videoRef.current  as unknown as HTMLCanvasElement , 0, 0, 300, 300)
          var imageData =  canvas!.getImageData(
            0,
            0,
            300,
            300
            );
            
            var code =  jsQR(imageData.data, imageData.width, imageData.height);
            if (code && mediaRecorder.state === "recording") {
            console.log(canvasRef);
            mediaRecorder.stop();
            stream.getTracks().forEach( (track:any) => track.stop() );
          }
        }, 100);        
      }
    })
    mediaRecorder.start(1000) 
  }
  
  return (
    <div>
      <video 
        src=""
        ref={videoRef}
      />
      <canvas ref={canvasRef} height={300} width={300} />
      <button
        onClick={startScanning}
      >start2
      </button>
    </div>

  );
}
export default App;
