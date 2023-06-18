import { ElementCategory } from "@/lib/types";
import { ResizeBox } from "../boxes";

type ElementContainerProps = {
  isSelected: boolean;
  showAsPreview: boolean;
  children: React.ReactNode;
  elementProps: ElementCategory;
};

const ElementContainer = ({
  children,
  isSelected,
  showAsPreview,
  elementProps: { id, type, color, size, startPosition },
}: ElementContainerProps) => {
  return (
    <div
      {...{ id }}
      data-type={type}
      className="absolute flex origin-top-left select-none items-center justify-center"
      style={{
        width: size.width,
        height: size.height,
        zIndex: showAsPreview ? 10 : 0,
        transform: `translate(${startPosition.x}px, ${startPosition.y}px)`,
      }}
    >
      {children}
      {(isSelected || showAsPreview) && (
        <ResizeBox {...{ id, size, color }} showResizeNodes={!showAsPreview} />
      )}
    </div>
  );
};

export { ElementContainer };
