import Link from "next/link";
import React from "react";

interface LinkifiedTextProps {
  text: string;
  onClick?: () => void;
}

// This regex matches URLs in the text
const urlChunk =
  /(\bhttps?:\/\/[^\s]+|www\.[^\s]+|[\w-]+\.(?:com|net|org))\b/gi;

// This regex checks if the string is a valid URL
const isUrl = /^(?:https?:\/\/[^\s]+|www\.[^\s]+|[\w-]+\.(?:com|net|org))$/i;

const LinkifiedText = ({ text, onClick }: LinkifiedTextProps) => {
  const lines = text.replace(/\r\n/g, "\n").split("\n");

  return (
    <div
      className="font-caveat block w-full cursor-text pb-1 break-words whitespace-pre-wrap [font-size-adjust:0.55]"
      onClick={onClick}
    >
      {lines.map((line, lineIndex) => {
        const parts = line.split(urlChunk);

        return (
          <div key={lineIndex} className="h-6">
            {parts.map((part, i) =>
              isUrl.test(part) ? (
                <Link
                  key={i}
                  href={part.startsWith("http") ? part : `https://${part}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {part}
                </Link>
              ) : (
                <span key={i}>{part}</span>
              ),
            )}
            {lineIndex < lines.length - 1 && <br />}
          </div>
        );
      })}
    </div>
  );
};

export default LinkifiedText;
