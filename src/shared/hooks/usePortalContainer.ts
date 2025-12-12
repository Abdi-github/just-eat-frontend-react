import { useRef, useEffect } from "react";

/**
 * Creates a fresh, isolated DOM element for Radix UI portals.
 * Browser extensions can't interfere because the element is created
 * dynamically and isn't in the static HTML they scan.
 */
export function usePortalContainer() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  if (!containerRef.current) {
    containerRef.current = document.createElement("div");
    containerRef.current.setAttribute("data-radix-portal-container", "");
  }

  useEffect(() => {
    const container = containerRef.current!;
    document.body.appendChild(container);
    return () => {
      document.body.removeChild(container);
    };
  }, []);

  return containerRef.current;
}
