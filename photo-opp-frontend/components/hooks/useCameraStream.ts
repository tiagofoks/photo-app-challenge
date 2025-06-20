import { useState, useEffect, useRef, RefObject } from "react";

interface UseCameraStreamOptions {
  onStreamReady?: (stream: MediaStream) => void;
  onCameraError?: (error: string) => void;
  videoRef: RefObject<HTMLVideoElement>;
}

interface UseCameraStreamReturn {
  error: string | null;
  loading: boolean;
  stream: MediaStream | null;
}

const useCameraStream = ({
  onStreamReady,
  onCameraError,
  videoRef,
}: UseCameraStreamOptions): UseCameraStreamReturn => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        setLoading(true);
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }

        setStream(mediaStream);
        if (onStreamReady) {
          onStreamReady(mediaStream);
        }
        setError(null);
      } catch (err) {
        console.error("Erro ao acessar a câmera:", err);
        let errorMessage = "Não foi possível acessar a câmera.";
        if (err instanceof Error) {
          if (err.name === "NotAllowedError" || err.name === "SecurityError") {
            errorMessage =
              "Permissão de câmera negada. Por favor, permita o acesso à câmera nas configurações do seu navegador.";
          } else if (
            err.name === "NotFoundError" ||
            err.name === "DevicesNotFoundError"
          ) {
            errorMessage = "Nenhuma câmera encontrada.";
          } else if (
            err.name === "NotReadableError" ||
            err.name === "OverconstrainedError"
          ) {
            errorMessage =
              "A câmera já está em uso ou há um problema de hardware.";
          }
        }
        setError(errorMessage);
        if (onCameraError) {
          onCameraError(errorMessage);
        }
        setStream(null);
      } finally {
        setLoading(false);
      }
    };

    startCamera();

    const currentVideoElement = videoRef.current;

    return () => {
      if (currentVideoElement && currentVideoElement.srcObject) {
        const currentStream = currentVideoElement.srcObject as MediaStream;
        currentStream.getTracks().forEach((track) => track.stop());
      } else if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [onStreamReady, onCameraError, videoRef, stream]);

  return { error, loading, stream };
};

export default useCameraStream;
