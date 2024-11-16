import { memo, useRef } from "react";

export const Cursor = memo(({ x, y, color }: { x: number; y: number; color: string }) => {
  const cursorRef = useRef<SVGSVGElement>(null);

  if (cursorRef.current) {
    cursorRef.current.style.setProperty("transform", `translate(${x}px, ${y}px)`);
  }

  return (
    <svg
      ref={cursorRef}
      viewBox="0 0 24 24"
      width={24}
      height={24}
      style={{ position: "absolute", left: 0, top: 0, transition: "transform 0.2s" }}
    >
      <rect x={0} y={0} width={24} height={24} fill={color} />
    </svg>
  );
});
