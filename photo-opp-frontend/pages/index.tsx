import { useRouter } from "next/router";
import Head from "next/head";

export default function Home() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/capture");
  };

  return (
    <>
      <Head>
        <title>Photo Opp - Início</title>
        <meta
          name="description"
          content="Desafio Técnico Nex Lab - Photo Opp"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <h1 className="text-5xl font-bold mb-8 text-center">PHOTO OPP</h1>
        <p className="text-xl mb-12 text-center max-w-lg">
          Bem-vindo à nossa experiência interativa! Prepare-se para tirar uma
          foto incrível.
        </p>
        <button
          onClick={handleStart}
          className="px-12 py-6 bg-blue-600 hover:bg-blue-700 text-white text-3xl font-semibold rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105 active:scale-95"
        >
          Toque para Iniciar
        </button>
      </div>
    </>
  );
}
