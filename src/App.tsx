import React, { useRef } from 'react';
import './App.css';
import jsQR from "jsqr"; 

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const chunks: Blob[] = [];
  
  const storeFrames = async (frame: BlobEvent) => {
    chunks.push(frame.data)
    await gerateUrl()
  }

  const gerateUrl = async () => {
    const blob = new Blob(chunks, {
      type: chunks[0].type
    })
    const url = URL.createObjectURL(blob)
    videoRef.current!.src = await url
  }
  
  const gerateImage = () => {
    const canvas = canvasRef.current!.getContext("2d");    
    canvas!.drawImage(videoRef.current  as unknown as HTMLCanvasElement , 0, 0, 300, 300)
    const data =  canvas!.getImageData(
      0,
      0,
      300,
      300
    );
    return data;
  }

  const readQrCode = () => {  
    const imageData = gerateImage();            
    const code =  jsQR(imageData.data, imageData.width, imageData.height);
      console.log(code);

    return code;
  };
  const stopScanning = async () => {

  }

  const startScanning = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true
    });    
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "video/webm"
    });
    
    mediaRecorder.addEventListener('dataavailable',  async function(event: BlobEvent) {      
      await  storeFrames(event)

      videoRef.current!.oncanplay = () => {

        setTimeout( () => {          
          const code = readQrCode();

          if (code && mediaRecorder.state === "recording") {
            // TODO stopScanning()
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

      <canvas 
        ref={canvasRef} 
        height={300} 
        width={300} 
      />

      <button
        onClick={startScanning}
      >start
      </button>

    </div>

  );
}
export default App;
