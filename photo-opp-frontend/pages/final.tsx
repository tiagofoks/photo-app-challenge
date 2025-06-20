import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import QRCode from 'qrcode.react'; 

export default function FinalPage() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const finalImageUrl = localStorage.getItem('finalImageUrl');
    if (finalImageUrl) {
      setImageUrl(finalImageUrl);
    } else {
      router.replace('/'); 
    }

    
    const timer = setTimeout(() => {
      router.push('/');
    }, 15000); 

    return () => clearTimeout(timer); 
  }, [router]);

  if (!imageUrl) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Photo Opp - Download</title>
        <meta name="description" content="Baixe sua foto!" />
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 text-center">
        <h1 className="text-4xl font-bold mb-8">Sua foto está pronta!</h1>
        <p className="text-xl mb-8">Escaneie o QR Code para baixar:</p>

        <div className="bg-white p-4 rounded-lg shadow-lg">
          <QRCode
            value={imageUrl} 
            size={256} 
            level="H" 
            renderAs="svg" 
          />
        </div>

        <p className="text-lg mt-8 text-gray-400">
          Redirecionando para a tela inicial em breve...
        </p>
      </div>
    </>
  );
}