import { useState, useRef, useEffect } from "react";

interface InfoButtonProps {
  message: string;
}

export default function InfoButton({ message }: InfoButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isVisible]);

  return (
    <div ref={containerRef} style={{ position: "relative", display: "inline" }}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsVisible((v) => !v);
        }}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        title={message}
        style={{
          width: 18,
          height: 18,
          padding: 0,
          border: "none",
          borderRadius: "50%",
          backgroundColor: "#94a3b8",
          color: "#fff",
          fontSize: 11,
          fontWeight: 700,
          cursor: "help",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        i
      </button>
      {isVisible && (
        <div
          style={{
            position: "absolute",
            left: "100%",
            top: 0,
            marginLeft: 6,
            padding: "8px 10px",
            backgroundColor: "#1e293b",
            color: "#f8fafc",
            fontSize: 12,
            borderRadius: 6,
            maxWidth: 220,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 1000,
            whiteSpace: "normal",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}
