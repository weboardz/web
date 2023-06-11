"use client";

import {
  ApplicationAction,
  ApplicationColor,
  actionSelector,
  colorPallete,
} from "@/lib";

import { useCallback, useMemo, useState } from "react";
import { ToolBox } from "./ToolBox";

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

  const controlsHandler = useMemo(() => {
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

  const grabActionHandler = useMemo(() => {
    const mouseDown = (id?: string) => setAction(actionSelector.grab(id));
    const mouseUp = () => setAction(actionSelector.select());
    const mouseMove = (mx: number, my: number, button: MouseButton) => {
      if (!action.targetId || (button !== "left" && button !== "wheel")) return;
      if (["board", "frame"].includes(action.targetId))
        controlsHandler.updatePosition(mx, my);
    };
    return { mouseDown, mouseUp, mouseMove };
  }, [action, controlsHandler]);

  const mouseMoveHandler: React.MouseEventHandler<HTMLElement> = useCallback(
    (e) => {
      const { movementX: mx, movementY: my, buttons: buttonIndex } = e;

      const pressedButton = buttons[buttonIndex];
      if (pressedButton === "none") return;

      if (action.name === "grab")
        grabActionHandler.mouseMove(mx, my, pressedButton);
    },
    [action, grabActionHandler]
  );

  const mouseDownHandler: React.MouseEventHandler<HTMLElement> = useCallback(
    (e) => {
      const { buttons: buttonIndex } = e;
      const pressedButton = buttons[buttonIndex];

      const target = e.target as HTMLElement;
      const id = target.getAttribute("id") || undefined;

      if (action.name === "grab" || pressedButton === "wheel")
        grabActionHandler.mouseDown(id);
    },
    [action, grabActionHandler]
  );

  const mouseUpHandler: React.MouseEventHandler<HTMLElement> =
    useCallback(() => {
      if (action.name === "grab") grabActionHandler.mouseUp();
    }, [action, grabActionHandler]);

  return (
    <div
      id="board"
      onMouseDown={mouseDownHandler}
      onMouseUp={mouseUpHandler}
      onMouseMove={mouseMoveHandler}
      onWheel={controlsHandler.updateScale}
      className="h-full w-full select-none overflow-hidden"
      style={{
        cursor: action.cursor,
        backgroundColor: colorPallete[backgroundColor].lighter,
      }}
    >
      <div
        id="frame"
        className="h-full w-full select-none bg-Serenade-50"
        style={{
          transform: `translate(${controls.x}px, ${controls.y}px) scale(${controls.z})`,
        }}
      ></div>

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
