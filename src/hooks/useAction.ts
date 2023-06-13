import {
  ApplicationAction,
  ApplicationColor,
  ApplicationStyles,
  ResizeSide,
  ToolBoxOption,
} from "@/application";

import { useMemo, useState } from "react";
import { usePrevious } from "./usePrevious";

const useAction = (initialAction: ApplicationAction) => {
  const [action, setAction] = useState<ApplicationAction>(initialAction);
  const previousAction = usePrevious<ApplicationAction>(action);

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
        });
      },
      select: (id?: string) => {
        setAction({
          ...action,
          name: "select",
          cursor: ApplicationStyles.Cursor.select,
          targetId: id,
          toolBoxSelection: "cursor",
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
        });
      },
      resize: (id: string, side: ResizeSide) => {
        setAction({
          ...action,
          name: "resize",
          cursor:
            side === "bottom" || side === "top"
              ? ApplicationStyles.Cursor.resizeVertical
              : ApplicationStyles.Cursor.resizeHorizontal,
          targetId: id,
          resizeSide: side,
        });
      },
      previous: () => setAction(previousAction),
    };
  }, [action, previousAction]);

  const actionHandler = useMemo(() => {
    return {
      releaseElement: () => changeActionTo.select(),
      returnToPrevious: () => changeActionTo.previous(),
      grabElement: (id?: string) => changeActionTo.grab(id),
      selectElement: (id?: string) => changeActionTo.select(id),
      createElement: (option: ToolBoxOption) => changeActionTo.create(option),
      resizeElement: (id: string, side: ResizeSide) =>
        changeActionTo.resize(id, side),
      selectColor: (color: ApplicationColor) => setAction({ ...action, color }),
    };
  }, [action, changeActionTo]);

  return { action, previousAction, actionHandler };
};

export { useAction };
