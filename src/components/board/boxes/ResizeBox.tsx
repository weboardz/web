import { ApplicationStyles, ElementSide } from "@/application";

type ResizeBoxProps = {
  id: string;
  children?: React.ReactNode;
  startPosition: { x: number; y: number };
  size: { width: number; height: number };
  setActionHandler(side: ElementSide): void;
};

const OFFSET = 8;

const ResizeBox = ({
  id,
  size,
  children,
  startPosition,
  setActionHandler,
}: ResizeBoxProps) => {
  return (
    <div
      {...{ id }}
      className="relative border border-blue-500"
      style={{
        width: size.width + OFFSET * 2,
        height: size.height + OFFSET * 2,
        transform: `translate(
          ${startPosition.x - OFFSET}px, 
          ${startPosition.y - OFFSET}px)`,
      }}
    >
      {children}
      <div
        onMouseDown={() => setActionHandler("top")}
        className="absolute -top-[6px] right-1/2 h-[10px] w-[10px] translate-x-1/2 rounded-sm border border-blue-500 bg-white hover:scale-110"
        style={{ cursor: ApplicationStyles.Cursor.resizeVertical }}
      />
      <div
        onMouseDown={() => setActionHandler("bottom")}
        className="absolute -bottom-[6px] right-1/2 h-[10px] w-[10px] translate-x-1/2 rounded-sm border border-blue-500 bg-white hover:scale-110"
        style={{ cursor: ApplicationStyles.Cursor.resizeVertical }}
      />
      <div
        onMouseDown={() => setActionHandler("left")}
        className="absolute -left-[6px] top-1/2 h-[10px] w-[10px] -translate-y-1/2 rounded-sm border border-blue-500 bg-white hover:scale-110"
        style={{ cursor: ApplicationStyles.Cursor.resizeHorizontal }}
      />
      <div
        onMouseDown={() => setActionHandler("right")}
        className="absolute -right-[6px] top-1/2 h-[10px] w-[10px] -translate-y-1/2 rounded-sm border border-blue-500 bg-white hover:scale-110"
        style={{ cursor: ApplicationStyles.Cursor.resizeHorizontal }}
      />
    </div>
  );
};

export { ResizeBox };
