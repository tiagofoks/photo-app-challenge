import { useState, useRef, useCallback } from "react";
import Head from "next/head";
import CameraFeed from "@/components/CameraFeed/CameraFeed";
import { useRouter } from "next/router";
import useCaptureCountdown from "../components/hooks/useCaptureCountdown";
import useImageCapture from "../components/hooks/useImageCapture";
import CaptureCountdown from "../components/CapturePage/CaptureCountdown";

const TARGET_WIDTH = 540;
const TARGET_HEIGHT = 960;
const FRAME_PATH = "/frames/frame.png";

export default function CapturePage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const handleCameraFeedReady = useCallback(() => {
    setCameraReady(true);
    setCameraError(null);
  }, []);

  const handleCameraFeedError = useCallback((error: string) => {
    console.error("Erro na câmera:", error);
    setCameraError(error);
    setCameraReady(false);
  }, []);

  const handleImageProcessed = useCallback(
    (imageDataUrl: string) => {
      localStorage.setItem("capturedImage", imageDataUrl);
      router.push("/review");
    },
    [router]
  );

  const { captureImage, isProcessing } = useImageCapture({
    videoRef,
    targetWidth: TARGET_WIDTH,
    targetHeight: TARGET_HEIGHT,
    frameImageUrl: FRAME_PATH,
    onImageProcessed: handleImageProcessed,
    onCaptureError: (error) =>
      console.error("Erro na captura de imagem:", error),
  });

  const {
    countdown,
    startCountdown: startCountdownHook,
    isCounting,
  } = useCaptureCountdown({
    onCountdownComplete: captureImage,
    initialCount: 3,
  });

  const handleCaptureClick = () => {
    if (!cameraReady || isCounting || isProcessing) return;
    startCountdownHook();
  };

  return (
    <>
      <Head>
        <title>Photo Opp - Capturar</title>
        <meta name="description" content="Capture sua foto!" />
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <h1 className="text-4xl font-bold mb-6">Posicione-se!</h1>

        <div className="relative w-full max-w-md h-[calc(100vh-180px)] md:h-[600px] bg-gray-800 rounded-lg shadow-xl overflow-hidden flex items-center justify-center">
          <CameraFeed
            onStreamReady={handleCameraFeedReady}
            onVideoRef={videoRef}
            onCameraError={handleCameraFeedError}
          />

          {/* Renderiza o componente do contador */}
          <CaptureCountdown countdown={countdown} />
        </div>

        <button
          onClick={handleCaptureClick}
          className={`mt-8 px-10 py-5 bg-green-600 text-white text-3xl font-semibold rounded-full shadow-lg transform transition duration-300 ease-in-out
            ${
              !cameraReady || cameraError || isCounting || isProcessing
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-green-700 hover:scale-105 active:scale-95"
            }`}
          disabled={!cameraReady || !!cameraError || isCounting || isProcessing}
        >
          Capturar Foto
        </button>
      </div>
    </>
  );
}
