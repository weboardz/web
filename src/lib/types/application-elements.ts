import { ApplicationColor, ApplicationStyles, ToolBoxOption } from "./";

export namespace ApplicationElements {
  interface Element {
    id: string;
    color: ApplicationColor;
    type: Omit<ToolBoxOption, "cursor">;
    startPosition: { x: number; y: number };
    size: { width: number; height: number };
  }

  export interface Shape extends Element {
    borderWidth: ApplicationStyles.BorderWidth;
    borderRadius: ApplicationStyles.BorderRadius;
  }

  export interface Text extends Element {
    text: string;
    fontSize: ApplicationStyles.FontSize;
    fontWeight: ApplicationStyles.FontWeight;
    fontFamily: ApplicationStyles.FontFamily;
  }

  export interface Arrow extends Element {
    endPosition: { x: number; y: number };
  }

  export interface Image extends Element {
    url: string;
  }
}

export type ElementCategory =
  | ApplicationElements.Shape
  | ApplicationElements.Text
  | ApplicationElements.Arrow
  | ApplicationElements.Image;
