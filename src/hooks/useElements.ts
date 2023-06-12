import { ApplicationColor, ApplicationStyles, Elements } from "@/application";
import { useMemo, useState } from "react";

const useElements = (initialElements?: Elements[]) => {
  const [elements, setElements] = useState<Elements[]>(initialElements || []);
  const [previewElement, setPreviewElement] = useState<Elements>();

  const elementsHandler = useMemo(() => {
    const create = (x: number, y: number, color: ApplicationColor) => {
      const baseElement = {
        id: crypto.randomUUID(),
        color,
        startPosition: { x, y },
        size: { width: 0, height: 0 },
      };

      return {
        square: () => {
          setPreviewElement({
            ...baseElement,
            type: "square",
            borderWidth: ApplicationStyles.BorderWidth.normal,
            borderRadius: ApplicationStyles.BorderRadius.regular,
          });
        },

        circle: () => {
          setPreviewElement({
            ...baseElement,
            type: "circle",
            borderWidth: ApplicationStyles.BorderWidth.normal,
            borderRadius: ApplicationStyles.BorderRadius.full,
          });
        },

        text: (data: string) => {
          setPreviewElement({
            ...baseElement,
            type: "text",
            text: data,
            size: { width: 14, height: 14 },
            fontWeight: ApplicationStyles.FontWeight.regular,
            fontFamily: ApplicationStyles.FontFamily.sans,
            fontSize: ApplicationStyles.FontSize.small,
          });
        },

        arrow: (x: number, y: number) => {
          setPreviewElement({
            ...baseElement,
            type: "arrow",
            endPosition: { x, y },
          });
        },

        image: (url: string) => {
          setPreviewElement({
            ...baseElement,
            type: "image",
            url,
          });
        },
      };
    };

    const save = () => {
      if (!previewElement) return;
      setElements([...elements, previewElement]);
      setPreviewElement(undefined);
    };

    const remove = (id: string) => {
      setElements(elements.filter((element) => element.id !== id));
    };

    const update = (id?: string) => {
      return {
        position: (mx: number, my: number) => {
          setElements(
            elements.map((element) =>
              element.id === id
                ? {
                    ...element,
                    startPosition: {
                      x: element.startPosition.x + mx,
                      y: element.startPosition.y + my,
                    },
                  }
                : element
            )
          );
        },

        size: (
          mx: number,
          my: number,
          side?: "top" | "bottom" | "left" | "right"
        ) => {
          switch (side) {
            case "top":
              setElements(
                elements.map((element) =>
                  element.id === id
                    ? {
                        ...element,
                        startPosition: {
                          ...element.startPosition,
                          y: element.startPosition.y + my,
                        },
                        size: {
                          ...element.size,
                          height: element.size.height - my,
                        },
                      }
                    : element
                )
              );
              break;

            case "left":
              setElements(
                elements.map((element) =>
                  element.id === id
                    ? {
                        ...element,
                        startPosition: {
                          ...element.startPosition,
                          x: element.startPosition.x + mx,
                        },
                        size: {
                          ...element.size,
                          width: element.size.width - mx,
                        },
                      }
                    : element
                )
              );
              break;

            case "bottom":
              setElements(
                elements.map((element) =>
                  element.id === id
                    ? {
                        ...element,
                        size: {
                          ...element.size,
                          height: element.size.height + my,
                        },
                      }
                    : element
                )
              );
              break;

            case "right":
              setElements(
                elements.map((element) =>
                  element.id === id
                    ? {
                        ...element,
                        size: {
                          ...element.size,
                          width: element.size.width + mx,
                        },
                      }
                    : element
                )
              );
              break;

            default:
              setElements(
                elements.map((element) =>
                  element.id === id
                    ? {
                        ...element,
                        size: {
                          width: element.size.width + mx,
                          height: element.size.height + my,
                        },
                      }
                    : element
                )
              );

              break;
          }
        },

        previewElementSize: (mx: number, my: number) => {
          if (!previewElement) return;
          setPreviewElement({
            ...previewElement,
            size: {
              width: previewElement.size.width + mx,
              height: previewElement.size.height + my,
            },
          });
        },
      };
    };

    return { create, save, remove, update };
  }, [elements, previewElement]);

  return { elements, previewElement, elementsHandler };
};

export { useElements };
