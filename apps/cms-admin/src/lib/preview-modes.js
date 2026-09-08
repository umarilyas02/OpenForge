import { Laptop, Smartphone, Tablet } from "lucide-react";

/** Shared between the editor toolbar (renders the switcher) and CanvasEditor (applies the resulting width to the iframe frame). */
export const PREVIEW_WIDTHS = {
  desktop: { icon: Laptop, label: "Desktop", width: "100%" },
  tablet: { icon: Tablet, label: "Tablet", width: "768px" },
  mobile: { icon: Smartphone, label: "Mobile", width: "390px" },
};
