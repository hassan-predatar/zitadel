"use client";

import { useEffect, useRef } from "react";

export function PredatarBackground({ imageUrl }: { imageUrl: string | null }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && imageUrl) {
      ref.current.style.backgroundImage = `url("${imageUrl}")`;
    }
  }, [imageUrl]);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        zIndex: 0,
      }}
    />
  );
}
