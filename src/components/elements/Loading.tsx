import Image from "next/image";
import React from "react";

function Loading() {
  return (
    <div className="centered-container">
      <div className="animate-bounce">
        <Image src="/minibunn-logo.svg" alt="logo" width={120} height={120} />
      </div>
      <p className="font-mali">Minibunn is prepping your day...</p>
    </div>
  );
}

export default Loading;
