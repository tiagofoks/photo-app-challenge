import React, { useRef, useEffect, useState, RefObject } from 'react';

interface CameraFeedProps {
  onStreamReady?: (stream: MediaStream) => void;
  onCameraError?: (error: string) => void;
  onVideoRef?: RefObject<HTMLVideoElement>; 
}

const CameraFeed: React.FC<CameraFeedProps> = ({ onStreamReady, onCameraError, onVideoRef }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null); 
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  
  const videoElementRef = onVideoRef || localVideoRef;

  useEffect(() => {
    const startCamera = async () => {
      try {
        setLoading(true);
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoElementRef.current) {
          videoElementRef.current.srcObject = stream;
          videoElementRef.current.play();
          if (onStreamReady) {
            onStreamReady(stream);
          }
        }
        setError(null);
      } catch (err) {
        console.error("Erro ao acessar a câmera:", err);
        let errorMessage = "Não foi possível acessar a câmera.";
        if (err instanceof Error) {
          if (err.name === "NotAllowedError" || err.name === "SecurityError") {
            errorMessage = "Permissão de câmera negada. Por favor, permita o acesso à câmera nas configurações do seu navegador.";
          } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
            errorMessage = "Nenhuma câmera encontrada.";
          } else if (err.name === "NotReadableError" || err.name === "OverconstrainedError") {
            errorMessage = "A câmera já está em uso ou há um problema de hardware.";
          }
        }
        setError(errorMessage);
        if (onCameraError) {
          onCameraError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    startCamera();

    
    return () => {
      if (videoElementRef.current && videoElementRef.current.srcObject) {
        const stream = videoElementRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onStreamReady, onCameraError, videoElementRef]); 

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-800 rounded-lg text-white">
        <p className="text-2xl animate-pulse">Carregando câmera...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-red-800 text-white p-4 text-center rounded-lg">
        <p className="text-2xl font-bold mb-4">Erro na Câmera!</p>
        <p className="text-lg">{error}</p>
        <p className="mt-4 text-sm">Verifique as permissões do navegador e tente novamente.</p>
      </div>
    );
  }

  return (
    <video
      ref={videoElementRef} 
      className="w-full h-full object-cover rounded-lg"
      autoPlay
      playsInline
      muted
    />
  );
};

export default CameraFeed;