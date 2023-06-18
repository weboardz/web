import { ApplicationElements } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import { ElementContainer } from "./ElementContainer";

type TextProps = {
  key?: string;
  isEditing: boolean;
  isSelected: boolean;
  showAsPreview: boolean;
  element: ApplicationElements.Text;
  saveTextHandler(data: string): void;
};

const Text = ({
  element,
  isEditing,
  isSelected,
  showAsPreview,
  saveTextHandler,
  element: { id, text, color, fontSize, fontWeight, fontFamily },
}: TextProps) => {
  const [textValue, setTextValue] = useState(text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing) {
      textareaRef.current?.focus();
      textareaRef.current?.select();
    }
  }, [isEditing]);

  useEffect(() => {
    saveTextHandler(textValue);
  }, [textValue, saveTextHandler]);

  return (
    <ElementContainer {...{ isSelected, showAsPreview }} elementProps={element}>
      <textarea
        {...{ id }}
        ref={textareaRef}
        value={textValue}
        readOnly={!isEditing}
        onChange={(e) => setTextValue(e.currentTarget.value)}
        onBlur={() => window.getSelection()?.removeAllRanges()}
        className={`h-full w-full resize-none overflow-hidden border-none bg-transparent focus:outline-none focus:ring-0 ${fontFamily}`}
        style={{
          fontSize,
          fontWeight,
          color: color.main,
          zIndex: isEditing ? 10 : 0,
          cursor: isSelected ? "text" : "default",
        }}
      />
    </ElementContainer>
  );
};

export { Text };
