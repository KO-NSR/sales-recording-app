import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import React, { useRef, useEffect, useState } from 'react';

const CameraWithQRCode: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [result, setResult] = useState<string[]>([]); //QRコード読み取り結果（配列）
  const [codeReader, setCodeReader] = useState<BrowserMultiFormatReader | null>(null); //QRコードのデコーダーの状態（BrowserMultiFormatReaderのインスタンス）
  const [isScanning, setIsScanning] = useState<boolean>(false); //QRコード読み取り可否の状態管理

  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          const reader = new BrowserMultiFormatReader();
          setCodeReader(reader);
          reader.decodeFromVideoDevice(null, videoRef.current, async (result, error) => {
            if (result) {
              if (!isScanning) {
                setIsScanning(true);
                const decodeText = result.getText();
                setResult(prevResult => [...prevResult, decodeText]);
                await new Promise(resolve => setTimeout(resolve, 5000)); //次の読み込みまでの待機時間
                setIsScanning(false);
              }
            }
            if (error && !(error instanceof NotFoundException)) {
              console.error("QR code scan error", error);
            }
          });
        }
      } catch (error) {
          console.error('Error accessing the camera', error);
      }
    } 
  };

  const stopCamera = () => {
    if (codeReader) {
      codeReader.reset(); //QRコードのデコーダーをリセットして停止
    }
    if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
    }
  };

  //コンポーネントがアンマウントされる時にカメラとQRコードのデコーダーを停止
  useEffect(() => {
    return () => {
      if (codeReader) {
        codeReader.reset();
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [codeReader]);

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
      {result.length > 0 && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
            {result.map((value, key) => (
              <p key={key}>QRコードの結果:{value}</p>
            ))}
        </div>
      )}
    </div>
  );
};

export default CameraWithQRCode;