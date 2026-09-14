import type { ReactElement, MouseEventHandler } from "react";
import "./glass-icons.css";

export type GlassIconsItem = {
  icon: ReactElement;
  color: string;
  label: string;
  customClass?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  active?: boolean;
};

/* Palette allineata allo spettro IMLAND: ciano, blu, giallo, verde.
   Le chiavi legacy restano valide ma puntano ai colori di brand. */
const gradientMapping: Record<string, string> = {
  cyan: "linear-gradient(#4fd6ff, #16BFF2)",
  blue: "linear-gradient(#3f7bff, #1646D8)",
  indigo: "linear-gradient(#2f5cf0, #103bb8)",
  yellow: "linear-gradient(#ffd94d, #FFC400)",
  green: "linear-gradient(#4fdc6b, #19C83A)",
  /* legacy → brand */
  purple: "linear-gradient(#3f7bff, #1646D8)",
  red: "linear-gradient(#ffd94d, #FFC400)",
  orange: "linear-gradient(#4fdc6b, #19C83A)",
};

type Props = {
  items: GlassIconsItem[];
  className?: string;
};

const GlassIcons = ({ items, className = "" }: Props) => {
  const getBackgroundStyle = (color: string) =>
    gradientMapping[color] ? { background: gradientMapping[color] } : { background: color };

  return (
    <div className={`icon-btns ${className}`}>
      {items.map((item, index) => (
        <button
          key={index}
          type="button"
          onClick={item.onClick}
          aria-label={item.label}
          className={`icon-btn ${item.active ? "is-active" : ""} ${item.customClass ?? ""}`}
        >
          <span className="icon-btn__back" style={getBackgroundStyle(item.color)} />
          <span className="icon-btn__front">
            <span className="icon-btn__icon">{item.icon}</span>
          </span>
          <span className="icon-btn__label">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default GlassIcons;
