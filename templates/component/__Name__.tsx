import type { ReactNode } from "react";
import "./__Name__.tokens.css";

export interface __Name__Props {
  children?: ReactNode;
}

export function __Name__({ children }: __Name__Props) {
  return <div className="ds-__name__">{children}</div>;
}
