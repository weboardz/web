import {
  ApplicationAction,
  ApplicationColor,
  ToolBoxOption,
} from "@/lib/types";

import { colorPallete } from "@/lib/constants";

import {
  Circle,
  Image as ImageIcon,
  MousePointer,
  MoveUpRight,
  Palette,
  Square,
  Type,
} from "lucide-react";

import { cloneElement } from "react";

type ToolBoxProps = {
  action: ApplicationAction;
  selectToolBoxOption: (option: ToolBoxOption) => void;
  selectToolBoxColor: (color: ApplicationColor) => void;
};

const toolBoxButtons: { name: ToolBoxOption; icon: JSX.Element }[] = [
  {
    name: "cursor",
    icon: <MousePointer />,
  },
  {
    name: "square",
    icon: <Square />,
  },
  {
    name: "circle",
    icon: <Circle />,
  },
  {
    name: "arrow",
    icon: <MoveUpRight />,
  },
  {
    name: "text",
    icon: <Type />,
  },
  {
    name: "image",
    icon: <ImageIcon />,
  },
];

const ToolBox = ({
  action,
  selectToolBoxColor,
  selectToolBoxOption,
}: ToolBoxProps) => {
  return (
    <nav className="absolute left-1/2 top-14 flex -translate-x-1/2 items-center gap-4 rounded-md bg-white px-3 py-2 opacity-75 shadow-md transition hover:scale-105 hover:opacity-100">
      {toolBoxButtons.map(({ icon, name }) => {
        return (
          <Button
            key={name}
            {...{ name, icon }}
            isSelected={action.toolBoxSelection === name}
            onClickHandler={() => selectToolBoxOption(name)}
          />
        );
      })}

      <Button icon={<Palette />} onClickHandler={() => {}} isSelected={false}>
        <div
          className="absolute bottom-2 right-2 h-2 w-2 rounded-full"
          style={{ backgroundColor: action.color.main }}
        />
        <ul className="absolute left-0 top-0 flex h-full w-full scale-0 transition-transform group-hover/button:scale-100">
          <li className="absolute left-1/2 top-1/2 flex h-fit w-[85px] -translate-x-1/2 -translate-y-1/2 flex-row-reverse items-center justify-between group-hover/button:-rotate-45">
            <ColorButton color="Narvik" onClickHandler={selectToolBoxColor} />
            <ColorButton
              adjust
              color="BlackHaze"
              onClickHandler={selectToolBoxColor}
            />
          </li>
          <li className="absolute left-1/2 top-1/2 flex h-fit w-[85px] -translate-x-1/2 -translate-y-1/2 items-center justify-between group-hover/button:rotate-90">
            <ColorButton
              adjust
              color="IslandSpice"
              onClickHandler={selectToolBoxColor}
            />
            <ColorButton color="WispPink" onClickHandler={selectToolBoxColor} />
          </li>
          <li className="absolute left-1/2 top-1/2 flex h-fit w-[85px] -translate-x-1/2 -translate-y-1/2 items-center justify-between group-hover/button:rotate-45">
            <ColorButton
              adjust
              color="Serenade"
              onClickHandler={selectToolBoxColor}
            />
            <ColorButton color="Magnolia" onClickHandler={selectToolBoxColor} />
          </li>
          <li className="absolute left-1/2 top-1/2 flex h-fit w-[85px] -translate-x-1/2 -translate-y-1/2 items-center justify-between">
            <ColorButton
              adjust
              color="Chablis"
              onClickHandler={selectToolBoxColor}
            />
            <ColorButton
              color="AliceBlue"
              onClickHandler={selectToolBoxColor}
            />
          </li>
        </ul>
      </Button>
    </nav>
  );
};

export { ToolBox };

const ColorButton = ({
  color,
  onClickHandler,
  adjust = false,
}: {
  adjust?: boolean;
  color: keyof typeof colorPallete;
  onClickHandler(...args: any[]): void;
}) => {
  return (
    <div
      onClick={() => onClickHandler(colorPallete[color])}
      className={`h-7 w-7 rounded-full border-2 border-white shadow-sm transition hover:scale-125 hover:shadow-md
      ${adjust ? "hover:-translate-x-2" : "hover:translate-x-2"}
      `}
      style={{ backgroundColor: colorPallete[color].main }}
    />
  );
};

const Button = ({
  name,
  icon,
  isSelected,
  onClickHandler,
  children,
}: {
  key?: string;
  name?: ToolBoxOption;
  icon: JSX.Element;
  isSelected: boolean;
  onClickHandler(...args: any[]): void;
  children?: React.ReactNode;
}) => {
  return (
    <button
      onClick={onClickHandler}
      className="group/button relative flex h-10 w-10 items-center justify-center rounded-md transition hover:scale-110 hover:bg-AliceBlue-100 hover:shadow-sm"
      style={{
        backgroundColor: isSelected
          ? colorPallete.BlackHaze.lighter
          : undefined,
      }}
    >
      {cloneElement(icon, {
        size: 25,
        className: "text-BlackHaze-600 group-hover/button:text-AliceBlue-700",
      })}

      {children}
    </button>
  );
};
