import React from "react";

interface CameraErrorDisplayProps {
  errorMessage: string;
}

const CameraErrorDisplay: React.FC<CameraErrorDisplayProps> = ({
  errorMessage,
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-red-800 text-white p-4 text-center rounded-lg">
      <p className="text-2xl font-bold mb-4">Erro na Câmera!</p>
      <p className="text-lg">{errorMessage}</p>
      <p className="mt-4 text-sm">
        Verifique as permissões do navegador e tente novamente.
      </p>
    </div>
  );
};

export default CameraErrorDisplay;
