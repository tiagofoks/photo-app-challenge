import { useCallback, useRef, useState } from "react";

interface UseImageCaptureOptions {
  videoRef: React.RefObject<HTMLVideoElement>;
  targetWidth?: number;
  targetHeight?: number;
  frameImageUrl?: string;
  onImageProcessed?: (imageDataUrl: string) => void;
  onCaptureError?: (error: string) => void;
}

interface UseImageCaptureReturn {
  captureImage: () => Promise<string | null>;
  isProcessing: boolean;
}

const TARGET_WIDTH_DEFAULT = 540;
const TARGET_HEIGHT_DEFAULT = 960;
const FRAME_IMAGE_URL_DEFAULT = "/frames/frame.png";

const useImageCapture = ({
  videoRef,
  targetWidth = TARGET_WIDTH_DEFAULT,
  targetHeight = TARGET_HEIGHT_DEFAULT,
  frameImageUrl = FRAME_IMAGE_URL_DEFAULT,
  onImageProcessed,
  onCaptureError,
}: UseImageCaptureOptions): UseImageCaptureReturn => {
  const [isProcessing, setIsProcessing] = useState(false);

  const captureImage = useCallback(async () => {
    if (!videoRef.current) {
      const msg = "Vídeo não disponível para captura.";
      console.error(msg);
      if (onCaptureError) onCaptureError(msg);
      return null;
    }

    setIsProcessing(true);
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      const msg = "Não foi possível obter o contexto 2D do canvas.";
      console.error(msg);
      if (onCaptureError) onCaptureError(msg);
      setIsProcessing(false);
      return null;
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const videoAspectRatio = video.videoWidth / video.videoHeight;
    const targetAspectRatio = targetWidth / targetHeight;

    let sx: number;
    let sy: number;
    let sWidth: number;
    let sHeight: number;

    const dx = 0;
    const dy = 0;
    const dWidth = targetWidth;
    const dHeight = targetHeight;

    if (videoAspectRatio > targetAspectRatio) {
      sHeight = video.videoHeight;
      sWidth = sHeight * targetAspectRatio;
      sx = (video.videoWidth - sWidth) / 2;
      sy = 0;
    } else {
      sWidth = video.videoWidth;
      sHeight = sWidth / targetAspectRatio;
      sx = 0;
      sy = (video.videoHeight - sHeight) / 2;
    }

    context.drawImage(video, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

    return new Promise<string | null>((resolve) => {
      const frameImage = new Image();
      frameImage.src = frameImageUrl;
      frameImage.crossOrigin = "anonymous";

      frameImage.onload = () => {
        context.drawImage(frameImage, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL("image/jpeg", 0.9);
        if (onImageProcessed) onImageProcessed(imageDataUrl);
        setIsProcessing(false);
        resolve(imageDataUrl);
      };

      frameImage.onerror = () => {
        const msg = `Erro ao carregar a imagem da moldura em: ${frameImageUrl}.`;
        console.error(
          msg +
            " Certifique-se de que o caminho está correto e o CORS é permitido."
        );

        const imageDataUrl = canvas.toDataURL("image/jpeg", 0.9);
        if (onImageProcessed) onImageProcessed(imageDataUrl);
        if (onCaptureError) onCaptureError(msg);
        setIsProcessing(false);
        resolve(imageDataUrl);
      };
    });
  }, [
    videoRef,
    targetWidth,
    targetHeight,
    frameImageUrl,
    onImageProcessed,
    onCaptureError,
  ]);

  return { captureImage, isProcessing };
};

export default useImageCapture;
