import { useEffect, type RefObject } from "react";

export function useDialogFocus(ref: RefObject<HTMLElement | null>, onClose: () => void) {
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const root = ref.current;
    if (!root) return;
    const query = 'button:not([disabled]), a[href], input, select, [tabindex="0"]';
    (root.querySelector<HTMLElement>("[data-initial-focus]") ?? root.querySelector<HTMLElement>(query))?.focus();
    function keydown(event: KeyboardEvent) {
      if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); onClose(); }
      if (event.key !== "Tab") return;
      const nodes = Array.from(root!.querySelectorAll<HTMLElement>(query)).filter((node) => node.offsetParent !== null);
      const first = nodes[0], last = nodes.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    root.addEventListener("keydown", keydown);
    return () => { root.removeEventListener("keydown", keydown); previous?.focus(); };
  }, [ref, onClose]);
}
