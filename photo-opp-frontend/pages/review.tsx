import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

export default function ReviewPage() {
  const router = useRouter();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const imageData = localStorage.getItem("capturedImage");
    if (imageData) {
      setCapturedImage(imageData);
      localStorage.removeItem("capturedImage");
    } else {
      router.replace("/capture");
    }
  }, [router]);

  const handleRetake = () => {
    router.push("/capture");
  };

  const handleApprove = async () => {
    if (!capturedImage) return;

    setUploading(true);
    setError(null);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageData: capturedImage }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao fazer upload da imagem.");
      }

      const result = await response.json();
      console.log("Upload bem-sucedido:", result);

      localStorage.setItem("finalImageUrl", result.imageUrl);
      router.push("/final");
    } catch (err: any) {
      console.error("Erro no upload:", err);
      setError(err.message || "Falha ao processar sua foto. Tente novamente.");
      setUploading(false);
    }
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
            objectFit="contain"
            className="rounded-lg"
          />
        </div>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

        <div className="flex space-x-4 mt-8 w-full max-w-md justify-center">
          <button
            onClick={handleRetake}
            className="flex-1 px-8 py-4 bg-red-600 hover:bg-red-700 text-white text-2xl font-semibold rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105 active:scale-95"
            disabled={uploading}
          >
            Refazer
          </button>
          <button
            onClick={handleApprove}
            className={`flex-1 px-8 py-4 bg-blue-600 text-white text-2xl font-semibold rounded-full shadow-lg transform transition duration-300 ease-in-out
              ${
                uploading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-700 hover:scale-105 active:scale-95"
              }`}
            disabled={uploading}
          >
            {uploading ? "Processando..." : "Aprovar"}
          </button>
        </div>
      </div>
    </>
  );
}
