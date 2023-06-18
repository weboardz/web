import { ApplicationColor, ApplicationStyles } from "@/application";

type ResizeBoxProps = {
  id: string;
  color: ApplicationColor;
  showResizeNodes: boolean;
  size: { width: number; height: number };
};

const ResizeBox = ({ id, color, size, showResizeNodes }: ResizeBoxProps) => {
  return (
    <div
      {...{ id }}
      className="absolute box-content h-full w-full border"
      style={{ borderColor: color.main, padding: showResizeNodes ? 12 : 4 }}
    >
      {showResizeNodes && (
        <>
          <div
            id="resizeNodeTop"
            data-side="top"
            className="absolute -top-[6px] right-1/2 h-[10px] w-[10px] translate-x-1/2 rounded-sm border bg-white hover:scale-110"
            style={{
              cursor: ApplicationStyles.Cursor.resizeVertical,
              borderColor: color.main,
            }}
          />
          <div
            id="resizeNodeBottom"
            data-side="bottom"
            className="absolute -bottom-[6px] right-1/2 h-[10px] w-[10px] translate-x-1/2 rounded-sm border bg-white hover:scale-110"
            style={{
              cursor: ApplicationStyles.Cursor.resizeVertical,
              borderColor: color.main,
            }}
          />
          <div
            id="resizeNodeLeft"
            data-side="left"
            className="absolute -left-[6px] top-1/2 h-[10px] w-[10px] -translate-y-1/2 rounded-sm border bg-white hover:scale-110"
            style={{
              cursor: ApplicationStyles.Cursor.resizeHorizontal,
              borderColor: color.main,
            }}
          />
          <div
            id="resizeNodeRight"
            data-side="right"
            className="absolute -right-[6px] top-1/2 h-[10px] w-[10px] -translate-y-1/2 rounded-sm border bg-white hover:scale-110"
            style={{
              cursor: ApplicationStyles.Cursor.resizeHorizontal,
              borderColor: color.main,
            }}
          />
        </>
      )}

      <p
        style={{ backgroundColor: color.main }}
        className="absolute -bottom-10 left-1/2 flex w-fit min-w-max -translate-x-1/2 items-center justify-center rounded-sm px-2 py-1 text-center text-xs text-white"
      >
        {size.width.toFixed(0)} x {size.height.toFixed(0)}
      </p>
    </div>
  );
};

export { ResizeBox };
