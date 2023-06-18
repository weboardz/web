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
