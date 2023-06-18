"use client";

import {
  ApplicationAction,
  ApplicationElements,
  ApplicationStyles,
  ElementCategory,
  ElementSide,
} from "@/lib/types";

import { colorPallete } from "@/lib/constants";

import { useAction, useControls, useElements } from "@/hooks";
import { useCallback } from "react";

import { ToolBox } from "./boxes";
import { Shape } from "./elements";

enum MouseButtons {
  none,
  left,
  right,
  wheel = 4,
}

const initialAction: ApplicationAction = {
  name: "select",
  toolBoxSelection: "cursor",
  color: colorPallete.AliceBlue,
  cursor: ApplicationStyles.Cursor.select,
};

type BoardProps = {
  backgroundColor: keyof typeof colorPallete;
  showCoordinates?: boolean;
};

const Board = ({ backgroundColor, showCoordinates = true }: BoardProps) => {
  const { elements, previewElement, elementsHandler } = useElements([]);
  const { frame, updateFrame, getScaledCoordinates } = useControls();
  const { action, actionHandler } = useAction(initialAction);

  const getMouseEventProps = useCallback(
    (e: React.MouseEvent) => {
      const { clientX, clientY, movementX, movementY, buttons } = e;
      const element = e.target as HTMLElement;

      const id = element.getAttribute("id") || undefined;
      const side = element.getAttribute("data-side") as ElementSide | undefined;

      const [mx, my] = [movementX / frame.scale, movementY / frame.scale];
      const { x, y } = getScaledCoordinates({ x: clientX, y: clientY });

      return {
        id,
        side,
        position: { x, y },
        movement: { mx, my },
        pressedButton: buttons,
        rawMovement: { mx: movementX, my: movementY },
      };
    },
    [frame, getScaledCoordinates]
  );

  const createElementFromToolBoxSelection = useCallback(
    (x: number, y: number) => {
      switch (action.toolBoxSelection) {
        case "square":
          elementsHandler.create(x, y, action.color).square();
          break;
        case "circle":
          elementsHandler.create(x, y, action.color).circle();
          break;
        case "arrow":
          elementsHandler.create(x, y, action.color).arrow(x, y);
          break;
        case "text":
          elementsHandler.create(x, y, action.color).text("");
          break;
        case "image":
          elementsHandler.create(x, y, action.color).image("");
          break;
      }
    },
    [action, elementsHandler]
  );

  const renderElementsBasedOnTheirTypes = useCallback(
    (element: ElementCategory, asPreview?: boolean) => {
      const { type } = element;

      if (type === "circle" || type === "square") {
        return (
          <Shape
            key={element.id}
            showAsPreview={!!asPreview}
            {...(element as ApplicationElements.Shape)}
            isSelected={action.targetId === element.id}
          />
        );
      }
    },
    [action]
  );

  const onMouseDownHandler: React.MouseEventHandler<HTMLElement> = useCallback(
    (e) => {
      const { id, side, position, pressedButton } = getMouseEventProps(e);
      if (!id) return;

      switch (pressedButton) {
        case MouseButtons.wheel:
          actionHandler.grabElement("frame");
          break;

        case MouseButtons.left:
          if (action.name === "create")
            createElementFromToolBoxSelection(position.x, position.y);

          if (action.name === "select" && !side)
            id !== action.targetId
              ? actionHandler.selectElement(id)
              : actionHandler.grabElement(id);

          if (action.name === "select" && action.targetId && side)
            actionHandler.resizeElement(action.targetId, side);
          break;
      }
    },
    [
      createElementFromToolBoxSelection,
      getMouseEventProps,
      actionHandler,
      action,
    ]
  );

  const onMouseMoveHandler: React.MouseEventHandler<HTMLElement> = useCallback(
    (e) => {
      const { id, movement, pressedButton, rawMovement } =
        getMouseEventProps(e);

      if (!id) return;

      switch (pressedButton) {
        case MouseButtons.wheel:
          updateFrame.position(rawMovement.mx, rawMovement.my);
          break;

        case MouseButtons.left:
          if (action.name === "create")
            elementsHandler.updatePreviewElementSize(movement.mx, movement.my);

          if (action.name === "select")
            actionHandler.grabElement(action.targetId);

          if (!action.targetId) return;

          if (action.name === "grab")
            ["frame", "board"].includes(action.targetId)
              ? updateFrame.position(rawMovement.mx, rawMovement.my)
              : elementsHandler
                  .update(action.targetId)
                  ?.position(movement.mx, movement.my);

          if (action.name === "resize")
            elementsHandler
              .update(action.targetId)
              ?.size(movement.mx, movement.my, action.elementSide);
          break;
      }
    },
    [getMouseEventProps, action, updateFrame, elementsHandler, actionHandler]
  );

  const onMouseUpHandler: React.MouseEventHandler<HTMLElement> = useCallback(
    (e) => {
      const { id } = getMouseEventProps(e);
      if (!id) return;

      if (action.name === "grab" || action.name === "resize")
        actionHandler.returnToPrevious();

      if (action.name === "create") {
        elementsHandler.save();
        actionHandler.selectElement(previewElement?.id);
      }
    },
    [action, actionHandler, previewElement, elementsHandler, getMouseEventProps]
  );

  return (
    <div
      id="board"
      onMouseDown={onMouseDownHandler}
      onMouseMove={onMouseMoveHandler}
      onMouseUp={onMouseUpHandler}
      onWheel={(e) => updateFrame.scale(e.deltaY)}
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
          transform: `translate(${frame.position.x}px, ${frame.position.y}px) scale(${frame.scale})`,
        }}
      >
        {elements.map((element) => renderElementsBasedOnTheirTypes(element))}

        {previewElement &&
          renderElementsBasedOnTheirTypes(previewElement, true)}
      </div>

      <ToolBox
        {...{ action }}
        selectToolBoxColor={(color) => actionHandler.selectColor(color)}
        selectToolBoxOption={(option) => {
          option === "cursor"
            ? actionHandler.selectElement()
            : actionHandler.createElement(option);
        }}
      />

      {showCoordinates && (
        <span className="absolute bottom-2 right-2 font-mono text-xs text-Alabaster-500">
          {frame.position.x}, {frame.position.y}, {frame.scale.toFixed(2)}
        </span>
      )}
    </div>
  );
};

export { Board };
