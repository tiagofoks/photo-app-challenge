import React, { useRef, RefObject } from "react";
import useCameraStream from "../hooks/useCameraStream";
import CameraLoadingDisplay from "./CameraLoadingDisplay";
import CameraErrorDisplay from "./CameraErrorDisplay";

interface CameraFeedProps {
  onStreamReady?: (stream: MediaStream) => void;
  onCameraError?: (error: string) => void;
  onVideoRef?: RefObject<HTMLVideoElement>;
}

const CameraFeed: React.FC<CameraFeedProps> = ({
  onStreamReady,
  onCameraError,
  onVideoRef,
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);

  const videoElementRef = onVideoRef || localVideoRef;

  const { error, loading } = useCameraStream({
    onStreamReady,
    onCameraError,
    videoRef: videoElementRef,
  });

  if (loading) {
    return <CameraLoadingDisplay />;
  }

  if (error) {
    return <CameraErrorDisplay errorMessage={error} />;
  }

  return (
    <video
      ref={videoElementRef}
      className="w-full h-full object-cover rounded-lg"
      autoPlay
      playsInline
      muted
    />
  );
};

export default CameraFeed;
