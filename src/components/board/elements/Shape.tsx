import { ApplicationAction, Shape, actionSelector } from "@/lib";

const Shape = ({
  id,
  size,
  color,
  position,
  borderWidth = 1,
  borderRadius = 0,
  setAction = () => {},
  previousAction = actionSelector.select(),
}: Shape & {
  key?: string;
  previousAction?: ApplicationAction;
  setAction?: React.Dispatch<React.SetStateAction<ApplicationAction>>;
}) => {
  return (
    <div
      id={id}
      onMouseEnter={() => setAction(actionSelector.select())}
      onClick={() => setAction(actionSelector.select(id))}
      onMouseOut={() => setAction(previousAction)}
      className="absolute flex origin-top-left select-none items-center justify-center overflow-hidden p-2 transition-shadow hover:shadow-md active:outline-none active:ring-0"
      style={{
        backgroundColor: color.lighter,
        borderColor: color.main,
        color: color.dark,
        transform: `translate(${position.x}px, ${position.y}px)`,
        width: size.width,
        height: size.height,
        borderWidth,
        borderRadius,
      }}
    ></div>
  );
};

export { Shape };
