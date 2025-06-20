import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import CameraFeed from '@/components/CameraFeed';
import { useRouter } from 'next/router';

export default function CapturePage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  // Define a largura e altura alvo para o Canvas (proporção 9:16)
  const TARGET_WIDTH = 540; // Ex: 1080 / 2
  const TARGET_HEIGHT = 960; // Ex: 1920 / 2

  const handleStreamReady = (stream: MediaStream) => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setCameraReady(true);
    }
  };

  const handleCameraError = (error: string) => {
    console.error('Erro na câmera:', error);
    setCameraError(error);
    setCameraReady(false);
  };

  const startCountdown = () => {
    if (!cameraReady || isCapturing) return;

    setIsCapturing(true); // Bloqueia novos cliques durante a captura
    setCountdown(3);

    let currentCount = 3;
    const timer = setInterval(() => {
      currentCount--;
      if (currentCount > 0) {
        setCountdown(currentCount);
      } else {
        clearInterval(timer);
        setCountdown(null);
        captureAndProcessImage();
      }
    }, 1000);
  };

  const captureAndProcessImage = async () => {
    if (!videoRef.current) {
      console.error('Vídeo não disponível para captura.');
      setIsCapturing(false);
      return;
    }

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      console.error('Não foi possível obter o contexto 2D do canvas.');
      setIsCapturing(false);
      return;
    }

    // Define as dimensões do canvas para a proporção alvo 9:16
    canvas.width = TARGET_WIDTH;
    canvas.height = TARGET_HEIGHT;

    // Calcula a proporção de aspecto do vídeo
    const videoAspectRatio = video.videoWidth / video.videoHeight;
    const targetAspectRatio = TARGET_WIDTH / TARGET_HEIGHT;

    let sx, sy, sWidth, sHeight; // Source X, Y, Width, Height (do vídeo)
    let dx, dy, dWidth, dHeight; // Destination X, Y, Width, Height (no canvas)

    dx = dy = 0;
    dWidth = TARGET_WIDTH;
    dHeight = TARGET_HEIGHT;

    // Determina como cortar/ajustar a imagem do vídeo para caber na proporção 9:16 do canvas
    if (videoAspectRatio > targetAspectRatio) {
      // O vídeo é mais largo que o target (landscape em relação ao portrait 9:16)
      sHeight = video.videoHeight;
      sWidth = sHeight * targetAspectRatio;
      sx = (video.videoWidth - sWidth) / 2;
      sy = 0;
    } else {
      // O vídeo é mais alto que o target (portrait em relação ao portrait 9:16)
      sWidth = video.videoWidth;
      sHeight = sWidth / targetAspectRatio;
      sx = 0;
      sy = (video.videoHeight - sHeight) / 2;
    }

    // Desenha o frame do vídeo no canvas
    context.drawImage(video, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

    // Carrega a imagem da moldura
    const frameImage = new Image();
    frameImage.src = '/frames/frame.png'; // Caminho para a moldura na pasta public

    frameImage.onload = () => {
      // Desenha a moldura por cima da imagem capturada
      context.drawImage(frameImage, 0, 0, canvas.width, canvas.height);

      // Converte o canvas para Data URL (Base64)
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9); // Qualidade 90% para JPEG

      // Armazena no localStorage para a próxima tela
      localStorage.setItem('capturedImage', imageDataUrl);

      // Navega para a tela de revisão
      router.push('/review');
      setIsCapturing(false); // Libera o botão
    };

    frameImage.onerror = () => {
      console.error('Erro ao carregar a imagem da moldura. Certifique-se de que "public/frames/frame.png" existe.');
      // Se a moldura falhar, ainda podemos navegar com a foto sem moldura
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      localStorage.setItem('capturedImage', imageDataUrl);
      router.push('/review');
      setIsCapturing(false);
    };
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
          <CameraFeed onStreamReady={handleStreamReady} onVideoRef={videoRef} onCameraError={handleCameraError} />

          {countdown !== null && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 text-white text-9xl font-bold z-10 animate-pulse">
              {countdown === 0 ? 'Sorria!' : countdown}
            </div>
          )}
        </div>

        <button
          onClick={startCountdown}
          className={`mt-8 px-10 py-5 bg-green-600 text-white text-3xl font-semibold rounded-full shadow-lg transform transition duration-300 ease-in-out
            ${!cameraReady || cameraError || isCapturing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700 hover:scale-105 active:scale-95'}`}
          disabled={!cameraReady || !!cameraError || isCapturing}
        >
          Capturar Foto
        </button>
      </div>
    </>
  );
}