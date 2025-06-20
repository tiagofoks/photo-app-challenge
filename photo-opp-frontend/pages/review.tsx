import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function ReviewPage() {
  const router = useRouter();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    // Recupera a imagem do localStorage
    const imageData = localStorage.getItem('capturedImage');
    if (imageData) {
      setCapturedImage(imageData);
    } else {
      // Se não houver imagem, redireciona de volta para a captura
      router.replace('/capture');
    }
  }, [router]);

  const handleRetake = () => {
    localStorage.removeItem('capturedImage'); // Limpa a imagem anterior
    router.push('/capture'); // Volta para a tela de captura
  };

  const handleApprove = () => {
    // TODO: Enviar a imagem para o backend para upload e gerar QR Code
    alert("Foto Aprovada! Próximo passo: Upload para o servidor e geração do QR Code.");
    // Exemplo de navegação para a tela final (QR Code)
    // router.push('/final');
  };

  if (!capturedImage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Carregando imagem...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Photo Opp - Revisar Foto</title>
        <meta name="description" content="Revise sua foto!" />
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <h1 className="text-4xl font-bold mb-6 text-center">Sua Foto</h1>

        <div className="relative w-full max-w-md h-[calc(100vh-220px)] md:h-[600px] bg-gray-800 rounded-lg shadow-xl overflow-hidden flex items-center justify-center">
          <Image
            src={capturedImage}
            alt="Foto Capturada"
            layout="fill"
            objectFit="contain" // ou 'cover' dependendo de como a moldura se comporta
            className="rounded-lg"
          />
        </div>

        <div className="flex space-x-4 mt-8 w-full max-w-md justify-center">
          <button
            onClick={handleRetake}
            className="flex-1 px-8 py-4 bg-red-600 hover:bg-red-700 text-white text-2xl font-semibold rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105 active:scale-95"
          >
            Refazer
          </button>
          <button
            onClick={handleApprove}
            className="flex-1 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-2xl font-semibold rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105 active:scale-95"
          >
            Aprovar
          </button>
        </div>
      </div>
    </>
  );
}