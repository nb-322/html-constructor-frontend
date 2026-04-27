import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";

function ShadowCanvas({ children }: { children: React.ReactNode }) {
    const hostRef = useRef<HTMLDivElement>(null);
    const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);

    useEffect(() => {
        if (hostRef.current && !hostRef.current.shadowRoot) {
            const root = hostRef.current.attachShadow({ mode: "open" });
            // Добавим минимальный сброс внутри теневого DOM
            const style = document.createElement("style");
            style.textContent = `
        :host {
          all: initial;
          display: block;
          contain: content;
        }
        *, *::before, *::after {
          box-sizing: border-box;
        }
      `;
            root.appendChild(style);
            setShadowRoot(root);
        }
    }, []);

    return (
        <div ref={hostRef}>
            {shadowRoot && createPortal(children, shadowRoot as unknown as Element)}
        </div>
    );
}
export default ShadowCanvas;