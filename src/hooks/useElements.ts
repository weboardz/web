import {
  ApplicationColor,
  ApplicationElements,
  ApplicationStyles,
  ElementCategory,
  ElementSide,
} from "@/lib/types";

import { useMemo, useState } from "react";

type ElementsMap = Map<string, ElementCategory>;
type ElementsArray = ElementCategory[];

const convertElementsMapToArray = (map: ElementsMap): ElementsArray =>
  Array.from(map, (entry) => entry[1]);

const convertElementsArrayToMap = (array: ElementsArray): ElementsMap =>
  new Map(array.map((element) => [element.id, element]));

const useElements = (initialElements: ElementsArray) => {
  const [previewElement, setPreviewElement] = useState<ElementCategory>();
  const [elements, setElements] = useState(
    convertElementsArrayToMap(initialElements)
  );

  const setElementsHandler = useMemo(() => {
    return {
      add: (element: ElementCategory) => {
        setElements(new Map(elements.set(element.id, element)));
      },
      update: () => {
        setElements(new Map(elements));
      },
      remove: (id: string) => {
        elements.delete(id);
        setElements(new Map(elements));
      },
    };
  }, [elements]);

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
            size: { width: 200, height: 40 },
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
      setElementsHandler.add(previewElement);
      setPreviewElement(undefined);
    };

    const remove = (id: string) => {
      setElementsHandler.remove(id);
    };

    const update = (id: string) => {
      const targetElement = elements.get(id);
      if (!targetElement) return;

      return {
        position: (mx: number, my: number) => {
          targetElement.startPosition = {
            x: targetElement.startPosition.x + mx,
            y: targetElement.startPosition.y + my,
          };

          setElementsHandler.update();
        },

        size: (mx: number, my: number, side?: ElementSide) => {
          switch (side) {
            case "top":
              targetElement.startPosition = {
                x: targetElement.startPosition.x,
                y: targetElement.startPosition.y + my,
              };
              targetElement.size = {
                width: targetElement.size.width,
                height: targetElement.size.height - my,
              };
              break;

            case "left":
              targetElement.startPosition = {
                x: targetElement.startPosition.x + mx,
                y: targetElement.startPosition.y,
              };
              targetElement.size = {
                width: targetElement.size.width - mx,
                height: targetElement.size.height,
              };
              break;

            case "bottom":
              targetElement.size = {
                width: targetElement.size.width,
                height: targetElement.size.height + my,
              };
              break;

            case "right":
              targetElement.size = {
                width: targetElement.size.width + mx,
                height: targetElement.size.height,
              };
              break;
          }

          setElementsHandler.update();
        },

        dataFrom: (type: "textTypeElement" | "imageTypeElement") => {
          switch (type) {
            case "textTypeElement":
              const textElement = targetElement as ApplicationElements.Text;
              return {
                text: (data: string) => (textElement.text = data),
              };
              break;
            case "imageTypeElement":
              const imageElement = targetElement as ApplicationElements.Image;
              return {
                url: (data: string) => (imageElement.url = data),
              };
              break;
          }
        },
      };
    };

    const updatePreviewElementSize = (mx: number, my: number) => {
      if (!previewElement) return;

      setPreviewElement({
        ...previewElement,
        size: {
          width: previewElement.size.width + mx,
          height: previewElement.size.height + my,
        },
      });
    };

    return { create, save, remove, update, updatePreviewElementSize };
  }, [elements, previewElement, setElementsHandler]);

  return {
    previewElement,
    elementsHandler,
    elements: convertElementsMapToArray(elements),
  };
};

export { useElements };
