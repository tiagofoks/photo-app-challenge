import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import QRCode from "qrcode.react";

export default function FinalPage() {
  const router = useRouter();
  const [finalImageUrl, setFinalImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const storedImageUrl = localStorage.getItem("finalImageUrl");
    if (storedImageUrl) {
      setFinalImageUrl(storedImageUrl);
    } else {
      router.replace("/");
    }

    const timeoutId = setTimeout(() => {
      router.push("/");
    }, 15000);

    return () => clearTimeout(timeoutId);
  }, [router]);

  if (!finalImageUrl) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Carregando foto final...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Photo Opp - Foto Final</title>
        <meta name="description" content="Sua foto está pronta!" />
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Sua Foto Está Pronta!
        </h1>

        <div className="relative w-full max-w-md h-[calc(100vh-220px)] md:h-[600px] bg-gray-800 rounded-lg shadow-xl overflow-hidden flex items-center justify-center mb-6">
          <Image
            src={finalImageUrl}
            alt="Foto Final"
            layout="fill"
            objectFit="contain"
            className="rounded-lg"
          />
        </div>

        <p className="text-xl mb-4">Escaneie o QR Code para baixar:</p>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <QRCode
            value={finalImageUrl}
            size={256}
            level="H"
            includeMargin={false}
          />
        </div>

        <button
          onClick={() => router.push("/")}
          className="mt-8 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white text-2xl font-semibold rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105 active:scale-95"
        >
          Voltar ao Início
        </button>
      </div>
    </>
  );
}
