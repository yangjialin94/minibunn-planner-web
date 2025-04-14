import clsx from "clsx";
import React from "react";

interface IconButtonProps {
  buttonClassName?: string;
  onClick: () => void;
  icon: React.ReactNode;
  tooltipText: string;
  placement?: "top" | "right" | "bottom" | "left";
}

function IconButton({
  buttonClassName,
  onClick,
  icon,
  tooltipText,
  placement = "top",
}: IconButtonProps) {
  return (
    <div className="relative inline-block">
      <button
        className={clsx(buttonClassName, "peer")}
        onPointerDown={(e: React.PointerEvent<HTMLButtonElement>) =>
          e.stopPropagation()
        }
        onClick={(e: React.PointerEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          onClick();
        }}
      >
        {icon}
      </button>
      <div className={clsx("tool-tip", placement)}>{tooltipText}</div>
    </div>
  );
}

export default IconButton;
