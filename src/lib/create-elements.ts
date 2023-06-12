import { ToolBoxOption } from "./application-actions";
import { ApplicationColor } from "./application-colors";

export interface Element {
  id: string;
  color: ApplicationColor;
  position: { x: number; y: number };
  size: { width: number; height: number };
  type: Omit<ToolBoxOption, "cursor">;
}

export interface Shape extends Element {
  borderWidth: 0 | 1 | 2;
  borderRadius: 0 | 4 | 8 | 16 | 9999;
}

export const createSquare = (
  x: number,
  y: number,
  color: ApplicationColor
): Shape => {
  return {
    id: crypto.randomUUID(),
    type: "square",
    color,
    position: { x, y },
    size: { width: 0, height: 0 },
    borderWidth: 2,
    borderRadius: 8,
  };
};

export const createCircle = (
  x: number,
  y: number,
  color: ApplicationColor
): Shape => {
  return {
    id: crypto.randomUUID(),
    type: "circle",
    color,
    position: { x, y },
    size: { width: 0, height: 0 },
    borderWidth: 2,
    borderRadius: 9999,
  };
};

export type Elements = Shape;

export const createElement: { [key: string]: (...args: any[]) => Elements } = {
  square: createSquare,
  circle: createCircle,
};
