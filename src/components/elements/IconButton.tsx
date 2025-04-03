import clsx from "clsx";
import React from "react";

interface IconButtonProps {
  buttonClassName?: string;
  onClick: () => void;
  icon: React.ReactNode;
  tooltipText: string;
  tooltipPosition?: string;
}

function IconButton({
  buttonClassName,
  onClick,
  icon,
  tooltipText,
  tooltipPosition,
}: IconButtonProps) {
  return (
    <div className="relative inline-block">
      <button className={clsx(buttonClassName, "peer")} onClick={onClick}>
        {icon}
      </button>
      <div
        className={clsx(
          "pointer-events-none absolute z-10 rounded bg-neutral-400 px-2 py-1 text-sm whitespace-nowrap opacity-0 transition-opacity delay-300 duration-150 peer-hover:opacity-100",
          tooltipPosition,
        )}
      >
        {tooltipText}
      </div>
    </div>
  );
}

export default IconButton;
