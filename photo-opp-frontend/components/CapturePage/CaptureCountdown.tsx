import React from "react";

interface CaptureCountdownProps {
  countdown: number | null;
}

const CaptureCountdown: React.FC<CaptureCountdownProps> = ({ countdown }) => {
  if (countdown === null) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 text-white text-9xl font-bold z-10 animate-pulse">
      {countdown === 0 ? "Sorria!" : countdown}
    </div>
  );
};

export default CaptureCountdown;
