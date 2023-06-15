import { ApplicationColor } from "@/application";

type PreviewElementBoxProps = {
  size: { width: number; height: number };
  startPosition: { x: number; y: number };
  color: ApplicationColor;
  children: React.ReactNode;
};

const PreviewElementBox = ({
  size,
  color,
  children,
  startPosition,
}: PreviewElementBoxProps) => {
  return (
    <div
      className="absolute origin-top-left"
      style={{
        width: size.width,
        height: size.height,
        transform: `translate(${startPosition.x}px, ${startPosition.y}px)`,
      }}
    >
      {children}
      <p
        style={{ backgroundColor: color.main }}
        className="absolute -bottom-8 flex w-fit min-w-[60px] items-center justify-center rounded-sm px-2 py-1 text-xs text-white"
      >
        {size.width.toFixed(0)} x {size.height.toFixed(0)}
      </p>
    </div>
  );
};

export { PreviewElementBox };
