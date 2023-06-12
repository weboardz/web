"use client";

import {
  ApplicationAction,
  ApplicationColor,
  actionSelector,
  colorPallete,
} from "@/lib";

import { Elements, createElement } from "@/lib";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ToolBox } from "./ToolBox";
import { Shape } from "./elements/Shape";

const [MIN_SCALE, MAX_SCALE, SCALE_FACTOR] = [0.6, 2, 1200];

type MouseButton = "none" | "left" | "right" | "wheel";
const buttons: { [key: number]: MouseButton } = {
  0: "none",
  1: "left",
  2: "right",
  4: "wheel",
};

type BoardProps = {
  backgroundColor: keyof typeof colorPallete;
  showCoordinates?: boolean;
};

const Board = ({ backgroundColor, showCoordinates = true }: BoardProps) => {
  const [controls, setControls] = useState({ x: 0, y: 0, z: 1 });
  const [color, setColor] = useState<ApplicationColor>(colorPallete.AliceBlue);
  const [action, setAction] = useState<ApplicationAction>(
    actionSelector.select()
  );

  const previousActionRef = useRef<ApplicationAction>(action);

  useEffect(() => {
    previousActionRef.current = action;
  }, [action]);

  const [elements, setElements] = useState<Elements[]>([]);
  const [previewElement, setPreviewElement] = useState<Elements>();

  const frameHandler = useMemo(() => {
    const updateScale: React.WheelEventHandler<HTMLElement> = (e) => {
      const amount = e.deltaY / SCALE_FACTOR;
      const isAtMinLimit = controls.z <= MIN_SCALE && amount < 0;
      const isAtMaxLimit = controls.z >= MAX_SCALE && amount > 0;
      if (isAtMinLimit || isAtMaxLimit) return;
      setControls({ ...controls, z: controls.z + amount });
    };

    const updatePosition = (mx: number, my: number) => {
      setControls({
        ...controls,
        x: controls.x + mx,
        y: controls.y + my,
      });
    };

    return { updateScale, updatePosition };
  }, [controls]);

  const grabHandler = useMemo(() => {
    const grabElement = (id?: string) => setAction(actionSelector.grab(id));

    const updateElementPosition = (
      mx: number,
      my: number,
      button: MouseButton
    ) => {
      if (!action.targetId || (button !== "left" && button !== "wheel")) return;
      if (action.targetId === "board" || action.targetId === "frame") {
        frameHandler.updatePosition(mx, my);
        return;
      }

      setElements(
        elements.map((element) =>
          element.id === action.targetId
            ? {
                ...element,
                position: {
                  x: element.position.x + mx / controls.z,
                  y: element.position.y + my / controls.z,
                },
              }
            : element
        )
      );
    };

    const releaseElement = () => setAction(actionSelector.select());

    return { grabElement, updateElementPosition, releaseElement };
  }, [action, controls, elements, frameHandler]);

  const createHandler = useMemo(() => {
    const calculateScaledPosition = (
      clientPosition: number,
      translation: number,
      innerSize: number
    ) => {
      const middleSize = innerSize / 2;
      const offsetSize = (innerSize * (1 / controls.z - 1)) / 2;
      const correctedPosition = clientPosition - translation;
      const scaleTransformation =
        offsetSize * (1 - correctedPosition / middleSize);
      return correctedPosition - scaleTransformation;
    };

    const createPreviewElement = (initialX: number, initialY: number) => {
      if (!action.toolBoxSelection) return;
      setPreviewElement(
        createElement[action.toolBoxSelection as string](
          calculateScaledPosition(initialX, controls.x, window.innerWidth),
          calculateScaledPosition(initialY, controls.y, window.innerHeight),
          color
        )
      );
    };

    const updatePreviewElementSize = (mx: number, my: number) => {
      if (!previewElement) return;
      setPreviewElement({
        ...previewElement,
        size: {
          width: Math.abs(previewElement.size.width + mx / controls.z),
          height: Math.abs(previewElement.size.height + my / controls.z),
        },
      });
    };

    const savePreviewElement = () => {
      if (!previewElement) return;
      setElements([...elements, previewElement]);
      setPreviewElement(undefined);
    };

    return {
      createPreviewElement,
      updatePreviewElementSize,
      savePreviewElement,
    };
  }, [color, controls, elements, previewElement, action]);

  const mouseDownHandler: React.MouseEventHandler<HTMLElement> = useCallback(
    (e) => {
      const { clientX: cx, clientY: cy, buttons: buttonIndex } = e;
      const pressedButton = buttons[buttonIndex];

      const target = e.target as HTMLElement;
      const id = target.getAttribute("id");
      if (!id) return;

      if (action.name === "grab" || pressedButton === "wheel")
        grabHandler.grabElement(id);

      if (action.name === "create") createHandler.createPreviewElement(cx, cy);

      if (action.name === "select") setAction(actionSelector.grab(id));
    },
    [action, grabHandler, createHandler]
  );

  const mouseMoveHandler: React.MouseEventHandler<HTMLElement> = useCallback(
    (e) => {
      const { movementX: mx, movementY: my, buttons: buttonIndex } = e;
      const pressedButton = buttons[buttonIndex];
      if (pressedButton === "none") return;

      if (action.name === "grab")
        grabHandler.updateElementPosition(mx, my, pressedButton);

      if (action.name === "create")
        createHandler.updatePreviewElementSize(mx, my);
    },
    [action, grabHandler, createHandler]
  );

  const mouseUpHandler: React.MouseEventHandler<HTMLElement> = useCallback(
    (e) => {
      const target = e.target as HTMLElement;
      if (!target.getAttribute("id")) return;

      if (action.name === "grab") grabHandler.releaseElement();
      if (action.name === "create") createHandler.savePreviewElement();
    },
    [action, grabHandler, createHandler]
  );

  return (
    <div
      id="board"
      onMouseDown={mouseDownHandler}
      onMouseMove={mouseMoveHandler}
      onMouseUp={mouseUpHandler}
      onWheel={frameHandler.updateScale}
      className="h-full w-full select-none overflow-hidden"
      style={{
        cursor: action.cursor,
        backgroundImage: `radial-gradient(${colorPallete[backgroundColor].light} 1.5px, ${colorPallete[backgroundColor].lighter}50 1.5px)`,
        backgroundSize: `60px 60px`,
        opacity: 1,
      }}
    >
      <div
        id="frame"
        className="relative h-full w-full select-none"
        style={{
          transform: `translate(${controls.x}px, ${controls.y}px) scale(${controls.z})`,
        }}
      >
        {elements.map((element) => (
          <Shape
            key={element.id}
            {...{ ...element, setAction }}
            previousAction={previousActionRef.current}
          />
        ))}

        {previewElement && (
          <div
            className="absolute origin-top-left"
            style={{
              width: previewElement.size.width,
              height: previewElement.size.height,
              transform: `translate(${previewElement.position.x}px, ${previewElement.position.y}px)`,
            }}
          >
            <Shape {...{ ...previewElement, position: { x: 0, y: 0 } }} />

            <p
              style={{ backgroundColor: color.main }}
              className="absolute -bottom-8 flex w-fit min-w-[60px] items-center justify-center rounded-sm px-2 py-1 text-xs text-white"
            >
              {previewElement.size.width.toFixed(0)} x{" "}
              {previewElement.size.height.toFixed(0)}
            </p>
          </div>
        )}
      </div>

      <ToolBox {...{ setColor, color, setAction, action }} />

      {showCoordinates && (
        <span className="absolute bottom-2 right-2 font-mono text-xs text-Alabaster-500">
          {controls.x}, {controls.y}, {controls.z.toFixed(2)}
        </span>
      )}
    </div>
  );
};

export { Board };
