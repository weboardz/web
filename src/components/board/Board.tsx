"use client";

import {
  ApplicationAction,
  ApplicationElements,
  ApplicationStyles,
  ElementCategory,
  ElementSide,
  WsMessage,
} from "@/lib/types";

import { colorPallete } from "@/lib/constants";

import { useAction, useControls, useElements } from "@/hooks";
import { useCallback, useEffect } from "react";

import { ToolBox } from "./boxes";
import { Shape, Text } from "./elements";

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
  asViewer: boolean;
  socket?: WebSocket;
  showCoordinates?: boolean;
  initialData: ElementCategory[];
  backgroundColor: keyof typeof colorPallete;
};

const Board = ({
  socket,
  asViewer,
  initialData,
  backgroundColor,
  showCoordinates = true,
}: BoardProps) => {
  const { elements, previewElement, elementsHandler, setElementsHandler } =
    useElements([]);
  const { frame, updateFrame, getScaledCoordinates } = useControls();
  const { action, actionHandler } = useAction(initialAction);

  console.log("Reloads count");

  useEffect(() => {
    setElementsHandler.set(initialData);
    //eslint-disable-next-line
  }, [initialData]);

  useEffect(() => {
    if (!socket) return;
    socket.addEventListener("message", (event) => {
      if (event.data === "Could not process message") {
        return;
      }
      const message = JSON.parse(event.data) as WsMessage;
      try {
        const element = JSON.parse(message.data) as ElementCategory;

        switch (message.operation) {
          case "update":
          case "create":
            setElementsHandler.add(element);
            break;
          case "delete":
            break;
        }
      } catch (error) {}
    });
  }, [socket, setElementsHandler]);

  const getMouseEventProps = useCallback(
    (e: React.MouseEvent) => {
      const { clientX, clientY, movementX, movementY, buttons } = e;
      const element = e.target as HTMLElement;

      const id = element.getAttribute("id") || undefined;
      const side = element.getAttribute("data-side") as ElementSide | undefined;

      const type = element.parentElement?.getAttribute("data-type") as
        | ElementCategory["type"]
        | undefined;

      const [mx, my] = [movementX / frame.scale, movementY / frame.scale];
      const { x, y } = getScaledCoordinates({ x: clientX, y: clientY });

      return {
        id,
        side,
        type,
        target: element,
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

  const renderElementByTheirType = useCallback(
    (element: ElementCategory, asPreview?: boolean) => {
      switch (element.type) {
        case "text":
          return (
            <Text
              key={element.id}
              showAsPreview={!!asPreview}
              isSelected={action.targetId === element.id}
              isEditing={
                action.name === "edit" && action.targetId === element.id
              }
              element={element as ApplicationElements.Text}
              saveTextHandler={(data: string) =>
                elementsHandler.update(element.id).data().text(data)
              }
            />
          );
          break;

        default:
          return (
            <Shape
              key={element.id}
              showAsPreview={!!asPreview}
              isSelected={action.targetId === element.id}
              element={element as ApplicationElements.Shape}
            />
          );
          break;
      }
    },
    [action, elementsHandler]
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
          switch (action.name) {
            case "create":
              createElementFromToolBoxSelection(position.x, position.y);
              break;

            case "select":
              if (!side && !asViewer)
                id !== action.targetId
                  ? actionHandler.selectElement(id)
                  : actionHandler.grabElement(id);

              if (action.targetId && side)
                actionHandler.resizeElement(action.targetId, side);
              break;

            case "edit":
              if (id !== action.targetId && !side)
                actionHandler.selectElement(id);
              if (action.targetId && side)
                actionHandler.resizeElement(action.targetId, side);
              break;
          }
          break;
      }
    },
    [
      createElementFromToolBoxSelection,
      getMouseEventProps,
      actionHandler,
      action,
      asViewer,
    ]
  );

  const onMouseMoveHandler: React.MouseEventHandler<HTMLElement> = useCallback(
    (e) => {
      const { id, movement, pressedButton, rawMovement } =
        getMouseEventProps(e);

      if (!id || !socket) return;

      switch (pressedButton) {
        case MouseButtons.wheel:
          updateFrame.position(rawMovement.mx, rawMovement.my);
          break;

        case MouseButtons.left:
          switch (action.name) {
            case "grab":
              if (!action.targetId) return;

              action.targetId === "frame" || action.targetId === "board"
                ? updateFrame.position(rawMovement.mx, rawMovement.my)
                : elementsHandler
                    .update(action.targetId)
                    .position(movement.mx, movement.my);

              if (
                action.targetId &&
                action.targetId !== "frame" &&
                action.targetId !== "board"
              ) {
                const element = elementsHandler.get(action.targetId);
                if (!element) return;
                socket.send(
                  JSON.stringify({
                    id: element.id,
                    data: JSON.stringify(element),
                    operation: "update",
                    save: false,
                  })
                );
              }
              break;

            case "select":
              actionHandler.grabElement(action.targetId);
              break;

            case "create":
              elementsHandler.updatePreviewElementSize(
                movement.mx,
                movement.my
              );
              break;

            case "resize":
              if (!action.targetId) return;
              elementsHandler
                .update(action.targetId)
                .size(movement.mx, movement.my, action.elementSide);
              if (
                action.targetId &&
                action.targetId !== "frame" &&
                action.targetId !== "board"
              ) {
                const element = elementsHandler.get(action.targetId);
                if (!element) return;
                socket.send(
                  JSON.stringify({
                    id: element.id,
                    data: JSON.stringify(element),
                    operation: "update",
                    save: false,
                  })
                );
              }
              break;
          }
          break;
      }
    },
    [
      getMouseEventProps,
      socket,
      action,
      updateFrame,
      elementsHandler,
      actionHandler,
    ]
  );

  const onMouseUpHandler: React.MouseEventHandler<HTMLElement> = useCallback(
    (e) => {
      const { id } = getMouseEventProps(e);

      if (!id || !socket) return;

      switch (action.name) {
        case "create":
          socket.send(
            JSON.stringify({
              id: previewElement?.id,
              data: JSON.stringify(previewElement),
              operation: "create",
              save: true,
            })
          );
          elementsHandler.save();
          action.toolBoxSelection === "text"
            ? actionHandler.editElement(id)
            : actionHandler.selectElement(id);
          break;

        case "grab":
        case "resize":
          if (
            action.targetId &&
            action.targetId !== "frame" &&
            action.targetId !== "board"
          ) {
            const element = elementsHandler.get(action.targetId);
            if (!element) return;
            socket.send(
              JSON.stringify({
                id: element.id,
                data: JSON.stringify(element),
                operation: "update",
                save: true,
              })
            );
          }
          actionHandler.returnToPrevious();
          break;
      }
    },
    [
      action,
      previewElement,
      socket,
      actionHandler,
      elementsHandler,
      getMouseEventProps,
    ]
  );

  const onDoubleClickHandler: React.MouseEventHandler<HTMLElement> =
    useCallback(
      (e) => {
        const { id, type } = getMouseEventProps(e);

        if (!id || action.name === "edit" || type !== "text") return;

        actionHandler.editElement(id);
      },
      [getMouseEventProps, actionHandler, action]
    );

  return (
    <div
      id="board"
      onMouseDown={onMouseDownHandler}
      onMouseMove={onMouseMoveHandler}
      onMouseUp={onMouseUpHandler}
      onDoubleClick={onDoubleClickHandler}
      onWheel={(e) => updateFrame.scale(e.deltaY)}
      className="h-full w-full select-none overflow-hidden"
      style={{
        backgroundImage: `radial-gradient(${colorPallete[backgroundColor].light} 1.5px, ${colorPallete[backgroundColor].lighter}50 1.5px)`,
        backgroundSize: `60px 60px`,
        cursor: action.cursor,
      }}
    >
      <div
        id="frame"
        className="relative h-full w-full select-none"
        style={{
          transform: `translate(${frame.position.x}px, ${frame.position.y}px) scale(${frame.scale})`,
        }}
      >
        {elements.map((element) => renderElementByTheirType(element))}
        {previewElement && renderElementByTheirType(previewElement, true)}
      </div>

      {!asViewer && (
        <ToolBox
          {...{ action }}
          selectToolBoxColor={(color) => actionHandler.selectColor(color)}
          selectToolBoxOption={(option) => {
            option === "cursor"
              ? actionHandler.selectElement()
              : actionHandler.createElement(option);
          }}
        />
      )}

      {showCoordinates && (
        <span className="absolute bottom-2 right-2 font-mono text-xs text-Alabaster-500">
          {frame.position.x}, {frame.position.y}, {frame.scale.toFixed(2)}
        </span>
      )}
    </div>
  );
};

export { Board };
