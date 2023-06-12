"use client";

import {
  ApplicationAction,
  ApplicationColor,
  actionSelector,
  colorPallete,
} from "@/application";

import { useElements, usePrevious } from "@/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  const previousAction = usePrevious<ApplicationAction>(action);

  const { elements, previewElement, elementsHandler } = useElements();

  const [editBox, setEditBox] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  }>();

  const [resize, setResize] = useState<"top" | "bottom" | "left" | "right">();

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

      elementsHandler
        .update(action.targetId)
        .position(mx / controls.z, my / controls.z);

      setEditBox(undefined);
    };

    const releaseElement = () => setAction(actionSelector.select());

    return { grabElement, updateElementPosition, releaseElement };
  }, [action, controls, frameHandler, elementsHandler]);

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

      elementsHandler
        .create(
          calculateScaledPosition(initialX, controls.x, window.innerWidth),
          calculateScaledPosition(initialY, controls.y, window.innerHeight),
          color
        )
        .square();
    };

    const updatePreviewElementSize = (mx: number, my: number) => {
      if (!previewElement) return;
      elementsHandler
        .update()
        .previewElementSize(mx / controls.z, my / controls.z);
    };

    const savePreviewElement = () => elementsHandler.save();

    return {
      createPreviewElement,
      updatePreviewElementSize,
      savePreviewElement,
    };
  }, [color, controls, previewElement, action, elementsHandler]);

  const selectHandler = useMemo(() => {
    const showEditBoxToElement = (id: string) => {
      const targetElement = elements.find((element) => element.id === id);
      if (!targetElement) return;
      const { startPosition: position, size } = targetElement;
      const offset = 6;
      setEditBox({
        x: position.x - offset,
        y: position.y - offset,
        w: size.width + 2 * offset,
        h: size.height + 2 * offset,
      });
    };

    const resizeElement = (id: string, mx: number, my: number) => {
      elementsHandler.update(id).size(mx / controls.z, my / controls.z, resize);
    };

    return { showEditBoxToElement, resizeElement };
  }, [elements, resize, controls, elementsHandler]);

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

      if (action.name === "select" && resize && action.targetId)
        selectHandler.resizeElement(action.targetId, mx, my);
    },
    [action, grabHandler, createHandler, selectHandler, resize]
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

  const mouseClickHandler: React.MouseEventHandler<HTMLElement> = useCallback(
    (e) => {
      const target = e.target as HTMLElement;
      const id = target.getAttribute("id") || undefined;

      if (id === "frame" || id === "board") {
        setEditBox(undefined);
        setResize(undefined);
      }
    },
    []
  );

  useEffect(() => {
    if (action.name === "select" && action.targetId)
      selectHandler.showEditBoxToElement(action.targetId);
  }, [action, selectHandler]);

  return (
    <div
      id="board"
      onMouseDown={mouseDownHandler}
      onMouseMove={mouseMoveHandler}
      onMouseUp={mouseUpHandler}
      onWheel={frameHandler.updateScale}
      onClick={mouseClickHandler}
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
            borderRadius={4}
            borderWidth={2}
            {...{ ...element, setAction, action, previousAction }}
          />
        ))}

        {editBox && action.name === "select" && (
          <div
            className="relative -z-10 border border-blue-500"
            style={{
              transform: `translate(${editBox.x}px, ${editBox.y}px)`,
              width: editBox.w,
              height: editBox.h,
            }}
          >
            <div
              onMouseDown={() => setResize("top")}
              className="absolute -top-[6px] right-1/2 h-[10px] w-[10px] translate-x-1/2 rounded-sm border border-blue-500 bg-white hover:scale-110 hover:cursor-ns-resize"
            />
            <div
              onMouseDown={() => setResize("bottom")}
              className="absolute -bottom-[6px] right-1/2 h-[10px] w-[10px] translate-x-1/2 rounded-sm border border-blue-500 bg-white hover:scale-110 hover:cursor-ns-resize"
            />
            <div
              onMouseDown={() => setResize("left")}
              className="absolute -left-[6px] top-1/2 h-[10px] w-[10px] -translate-y-1/2 rounded-sm border border-blue-500 bg-white hover:scale-110 hover:cursor-ew-resize"
            />
            <div
              onMouseDown={() => setResize("right")}
              className="absolute -right-[6px] top-1/2 h-[10px] w-[10px] -translate-y-1/2 rounded-sm border border-blue-500 bg-white hover:scale-110 hover:cursor-ew-resize"
            />
          </div>
        )}

        {previewElement && (
          <div
            className="absolute origin-top-left"
            style={{
              width: previewElement.size.width,
              height: previewElement.size.height,
              transform: `translate(${previewElement.startPosition.x}px, ${previewElement.startPosition.y}px)`,
            }}
          >
            <Shape
              borderRadius={4}
              borderWidth={2}
              {...{ ...previewElement, startPosition: { x: 0, y: 0 } }}
            />

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
