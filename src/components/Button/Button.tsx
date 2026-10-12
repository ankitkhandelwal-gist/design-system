import type { ReactNode } from "react";
import "./Button.tokens.css";

export interface ButtonProps {
  children?: ReactNode;
}

export function Button({ children }: ButtonProps) {
  return <div className="ds-button">{children}</div>;
}
