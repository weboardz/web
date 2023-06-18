import { Shape as ShapeInterface } from "@/application";
import { ResizeBox } from "../boxes";

type ShapeProps = ShapeInterface & {
  key?: string;
  isSelected: boolean;
  showAsPreview: boolean;
};

const Shape = ({
  id,
  size,
  color,
  isSelected,
  borderWidth,
  borderRadius,
  startPosition,
  showAsPreview,
}: ShapeProps) => {
  return (
    <div
      id={id}
      className="absolute flex origin-top-left select-none items-center justify-center transition-shadow hover:shadow-md"
      style={{
        backgroundColor: color.lighter,
        borderColor: color.main,
        color: color.dark,
        transform: `translate(${startPosition.x}px, ${startPosition.y}px)`,
        width: size.width,
        height: size.height,
        borderWidth,
        borderRadius,
        zIndex: showAsPreview ? 10 : 0,
      }}
    >
      {(isSelected || showAsPreview) && (
        <ResizeBox {...{ id, size, color }} showResizeNodes={!showAsPreview} />
      )}
    </div>
  );
};

export { Shape };
