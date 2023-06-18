import { ApplicationColor, ApplicationStyles } from "./";

export type ToolBoxOption =
  | "cursor"
  | "square"
  | "circle"
  | "arrow"
  | "text"
  | "image";

export type ElementSide = "top" | "bottom" | "left" | "right";

export type ApplicationAction = {
  name: "grab" | "select" | "create" | "resize" | "edit";
  cursor: ApplicationStyles.Cursor;
  color: ApplicationColor;
  targetId?: string;
  toolBoxSelection?: ToolBoxOption;
  elementSide?: ElementSide;
};
