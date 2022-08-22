import React, { useRef } from 'react';
import './App.css';
import jsQR from "jsqr"; 


function App() {
 
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas = canvasRef.current!.getContext("2d");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const chunks: any[] = [];

  const storeFrames = async (frame: BlobEvent) => {
    chunks.push(frame.data)
    await createUrl()
  }

  const createUrl = async () => {
    let blob = new Blob(chunks, {
      type: chunks[0].type
    })

    let url = URL.createObjectURL(blob)
    videoRef.current!.src = await url
  }

  const startScanning = async () => {
    let stream = await navigator.mediaDevices.getDisplayMedia({
      video: true
    })
    
    let mediaRecorder = new MediaRecorder(stream, {
      mimeType: "video/webm"
    })
    mediaRecorder.addEventListener('dataavailable',  async function(event: BlobEvent) {
      
      await  storeFrames(event)

      videoRef.current!.oncanplay = () => {
        setTimeout( () => {
          
          canvas!.drawImage(videoRef.current  as unknown as HTMLCanvasElement , 0, 0, 300, 300)
          var imageData =  canvas!.getImageData(
            0,
            0,
            300,
            300
          );
            
            var code =  jsQR(imageData.data, imageData.width, imageData.height);
            console.log(code);
            if (code && mediaRecorder.state === "recording") {
            mediaRecorder.stop();
            stream.getTracks().forEach( (track:any) => track.stop() );
          }
        }, 500);        
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
