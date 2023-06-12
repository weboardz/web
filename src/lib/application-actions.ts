export type CursorOption =
  | "grab"
  | "grabbing"
  | "default"
  | "crosshair"
  | "text";

export type ToolBoxOption =
  | "cursor"
  | "square"
  | "circle"
  | "arrow"
  | "text"
  | "image";

export type ApplicationAction = {
  name: "grab" | "select" | "create";
  cursor: CursorOption;
  targetId?: string;
  toolBoxSelection?: ToolBoxOption;
};

const actionSelector = {
  grab: (id?: string): ApplicationAction => {
    return { name: "grab", cursor: id ? "grabbing" : "grab", targetId: id };
  },
  select: (id?: string): ApplicationAction => {
    return {
      name: "select",
      cursor: "default",
      targetId: id,
      toolBoxSelection: "cursor",
    };
  },
  create: (option?: ToolBoxOption): ApplicationAction => {
    return {
      name: "create",
      cursor: option === "text" ? "text" : "crosshair",
      toolBoxSelection: option,
    };
  },
};

export { actionSelector };
