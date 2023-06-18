import { ApplicationElements } from "@/lib/types";
import { ElementContainer } from "./ElementContainer";

type TextProps = {
  key?: string;
  isSelected: boolean;
  showAsPreview: boolean;
  element: ApplicationElements.Text;
};

const Text = ({
  element,
  isSelected,
  showAsPreview,
  element: { id, text, fontSize, fontWeight, fontFamily },
}: TextProps) => {
  return (
    <ElementContainer {...{ isSelected, showAsPreview }} elementProps={element}>
      <textarea
        {...{ id }}
        value={text}
        className="h-full w-full resize-none overflow-hidden border-none bg-transparent focus:outline-none focus:ring-0"
        style={{ fontFamily, fontWeight, fontSize }}
      />
    </ElementContainer>
  );
};

export { Text };
