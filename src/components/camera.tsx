import React, { useRef, useEffect, useState } from 'react';

const Camera: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (error) {
            console.error('Error accessing the camera', error);
        }
    } 
  };
  
  const stopCamera = () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop()); //カメラストリームの停止
        setStream(null);
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    }
  };

  useEffect(() => {
    return () => { //クリーンアップ関数
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [stream]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <video ref={videoRef} autoPlay playsInline className="mb-4 w-full max-w-md rounded-lg shadow-lg" />
      <div className="flex space-x-4">
        <button
          onClick={startCamera}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
        >
          カメラ撮影開始
        </button>
        <button
          onClick={stopCamera}
          className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
        >
          撮影停止
        </button>
      </div>
    </div>
  );
};

export default Camera;