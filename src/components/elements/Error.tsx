import Image from "next/image";
import Link from "next/link";
import React from "react";

function Error() {
  return (
    <div className="font-mali centered-container gap-8 text-center">
      <div className="animate-spin">
        <Image src="/minibunn-logo.svg" alt="logo" width={120} height={120} />
      </div>
      <p className="text-lg font-semibold text-red-500">
        Something went wrong.
      </p>
      <p>
        Please report this to <br />
        <Link
          href="mailto:minibunnplanner@gmail.com"
          className="pb-1 hover:border-b-1"
        >
          minibunnplanner@gmail.com
        </Link>
      </p>
    </div>
  );
}

export default Error;
