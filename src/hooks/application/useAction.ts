import {
  ApplicationAction,
  ApplicationColor,
  ApplicationStyles,
  ElementSide,
  ToolBoxOption,
} from "@/lib/types";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePrevious } from "../usePrevious";

const useAction = (initialAction: ApplicationAction) => {
  const [action, setAction] = useState(initialAction);
  const previousAction = usePrevious(action);
  const beforePreviousAction = useRef(previousAction);

  useEffect(() => {
    if (JSON.stringify(action) === JSON.stringify(previousAction)) return;
    beforePreviousAction.current = previousAction;
  }, [action, previousAction]);

  const changeActionTo = useMemo(() => {
    return {
      grab: (id?: string) => {
        setAction({
          ...action,
          name: "grab",
          cursor: id
            ? ApplicationStyles.Cursor.grabbing
            : ApplicationStyles.Cursor.grab,
          targetId: id,
          elementSide: undefined,
          toolBoxSelection: undefined,
        });
      },
      select: (id?: string) => {
        setAction({
          ...action,
          name: "select",
          cursor: ApplicationStyles.Cursor.select,
          targetId: id,
          toolBoxSelection: "cursor",
          elementSide: undefined,
        });
      },
      create: (option?: ToolBoxOption) => {
        setAction({
          ...action,
          name: "create",
          cursor:
            option === "text"
              ? ApplicationStyles.Cursor.text
              : ApplicationStyles.Cursor.create,
          toolBoxSelection: option,
          elementSide: undefined,
        });
      },
      resize: (id: string, side: ElementSide) => {
        setAction({
          ...action,
          name: "resize",
          targetId: id,
          cursor: ["top", "bottom"].includes(side)
            ? ApplicationStyles.Cursor.resizeVertical
            : ApplicationStyles.Cursor.resizeHorizontal,
          elementSide: side,
          toolBoxSelection: undefined,
        });
      },
      edit: (id: string) => {
        setAction({
          ...action,
          name: "edit",
          targetId: id,
          cursor: ApplicationStyles.Cursor.select,
          elementSide: undefined,
          toolBoxSelection: undefined,
        });
      },
      previous: () => {
        JSON.stringify(action) !== JSON.stringify(previousAction)
          ? setAction(previousAction)
          : setAction(beforePreviousAction.current);
      },
    };
  }, [action, previousAction, beforePreviousAction]);

  const actionHandler = useMemo(() => {
    return {
      releaseElement: () => changeActionTo.select(),
      returnToPrevious: () => changeActionTo.previous(),
      editElement: (id: string) => changeActionTo.edit(id),
      grabElement: (id?: string) => changeActionTo.grab(id),
      selectElement: (id?: string) => changeActionTo.select(id),
      createElement: (option: ToolBoxOption) => changeActionTo.create(option),
      resizeElement: (id: string, side: ElementSide) =>
        changeActionTo.resize(id, side),
      selectColor: (color: ApplicationColor) => setAction({ ...action, color }),
    };
  }, [action, changeActionTo]);

  return { action, previousAction, actionHandler };
};

export { useAction };
