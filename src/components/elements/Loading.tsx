import Image from "next/image";
import React from "react";

interface LoadingProps {
  size?: number;
}

function Loading({ size = 120 }: LoadingProps) {
  return (
    <div className="centered-container">
      <div className="animate-bounce">
        <Image src="/minibunn-logo.svg" alt="logo" width={size} height={size} />
      </div>
      <p className="font-mali">Minibunn is prepping your day...</p>
    </div>
  );
}

export default Loading;
