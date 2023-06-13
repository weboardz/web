export namespace ApplicationStyles {
  export enum BorderWidth {
    none = 0,
    thin = 1,
    normal = 2,
  }
  export enum BorderRadius {
    none = 0,
    regular = 4,
    medium = 8,
    large = 16,
    full = 9999,
  }
  export enum FontSize {
    small = "1rem",
    medium = "2rem",
    large = "3rem",
  }
  export enum FontWeight {
    regular = 400,
    bold = 700,
  }
  export enum FontFamily {
    sans = "Roboto",
    alt = "Rubik",
  }
  export enum Cursor {
    grab = "grab",
    grabbing = "grabbing",
    select = "default",
    create = "crosshair",
    text = "text",
    resizeHorizontal = "ew-resize",
    resizeVertical = "ns-resize",
  }
}

export type ApplicationColor = {
  lighter: string;
  light: string;
  main: string;
  dark: string;
  darker: string;
};

export type ToolBoxOption =
  | "cursor"
  | "square"
  | "circle"
  | "arrow"
  | "text"
  | "image";

export type ResizeSide = "top" | "bottom" | "left" | "right";

export type ApplicationAction = {
  name: "grab" | "select" | "create" | "resize";
  cursor: ApplicationStyles.Cursor;
  color: ApplicationColor;
  targetId?: string;
  toolBoxSelection?: ToolBoxOption;
  resizeSide?: ResizeSide;
};

export interface Element {
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

export type Elements = Shape | Text | Arrow | Image;

export enum MouseButtons {
  none,
  left,
  right,
  wheel = 4,
}
