import { ApplicationElements } from "@/lib/types";
import { ElementContainer } from "./ElementContainer";

type ShapeProps = {
  key?: string;
  isSelected: boolean;
  showAsPreview: boolean;
  element: ApplicationElements.Shape;
};

const Shape = ({
  element,
  isSelected,
  showAsPreview,
  element: { id, color, borderRadius, borderWidth },
}: ShapeProps) => {
  return (
    <ElementContainer {...{ isSelected, showAsPreview }} elementProps={element}>
      <div
        {...{ id }}
        className="flex h-full w-full select-none items-center justify-center transition-shadow hover:shadow-md"
        style={{
          backgroundColor: color.lighter,
          borderColor: color.main,
          color: color.dark,
          borderRadius,
          borderWidth,
        }}
      />
    </ElementContainer>
  );
};

export { Shape };
