import Image from "next/image";
import React from "react";

function Loading() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="animate-bounce">
        <Image src="/minibunn-logo.png" alt="logo" width={120} height={120} />
      </div>
      <p className="font-mali">Minibunn is prepping your day...</p>
    </div>
  );
}

export default Loading;
