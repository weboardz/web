import { ApplicationAction, Shape, actionSelector } from "@/application";

const Shape = ({
  id,
  size,
  color,
  startPosition,
  borderWidth,
  borderRadius,
  setAction = () => {},
  action = actionSelector.select(),
  previousAction = actionSelector.select(),
}: Shape & {
  key?: string;
  action?: ApplicationAction;
  previousAction?: ApplicationAction;
  setAction?: React.Dispatch<React.SetStateAction<ApplicationAction>>;
}) => {
  return (
    <div
      id={id}
      onMouseEnter={() => {
        if (action.name === "select") return;
        setAction(actionSelector.select());
      }}
      onClick={() => setAction(actionSelector.select(id))}
      onMouseOut={() => setAction(previousAction)}
      className="absolute flex origin-top-left select-none items-center justify-center overflow-hidden p-2 transition-shadow hover:shadow-md active:outline-none active:ring-0"
      style={{
        backgroundColor: color.lighter,
        borderColor: color.main,
        color: color.dark,
        transform: `translate(${startPosition.x}px, ${startPosition.y}px)`,
        width: size.width,
        height: size.height,
        borderWidth,
        borderRadius,
      }}
    ></div>
  );
};

export { Shape };
