import React from "react";

const CameraLoadingDisplay: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full h-full bg-gray-800 rounded-lg text-white">
      <p className="text-2xl animate-pulse">Carregando câmera...</p>
    </div>
  );
};

export default CameraLoadingDisplay;
