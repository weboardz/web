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
  toolBoxSelection: string;
  setToolBoxSelection: React.Dispatch<React.SetStateAction<string>>;
  colorSelection: {
    className: string;
    hexCode: string;
  };
  setColorSelection: React.Dispatch<
    React.SetStateAction<{
      className: string;
      hexCode: string;
    }>
  >;
};

const ToolBox = ({
  toolBoxSelection,
  setToolBoxSelection,
  colorSelection,
  setColorSelection,
}: ToolBoxProps) => {
  return (
    <nav className="absolute left-1/2 top-14 flex -translate-x-1/2 items-center gap-4 rounded-md bg-Alabaster-50 px-3 py-2 opacity-50 shadow-md transition hover:scale-105 hover:opacity-100">
      {buttonsProps.map(({ icon, name }) => {
        return (
          <button
            key={name}
            onClick={() => setToolBoxSelection(name)}
            className={`group/button flex h-10 w-10 items-center justify-center rounded-md transition hover:scale-110 hover:bg-AliceBlue-100 hover:shadow-sm
            ${toolBoxSelection === name && "bg-Alabaster-100"}`}
          >
            {cloneElement(icon, {
              size: 25,
              className:
                "text-Alabaster-500 group-hover/button:text-AliceBlue-700",
            })}
          </button>
        );
      })}
      <button className="group/button relative flex h-10 w-10 items-center justify-center rounded-md transition hover:scale-110 hover:bg-AliceBlue-100 hover:shadow-sm">
        <Palette
          size={25}
          className="text-Alabaster-500 group-hover/button:text-AliceBlue-700"
        />
        <div
          className={`absolute bottom-2 right-2 h-2 w-2 rounded-full ${colorSelection.className}`}
        />
        <ul className="absolute left-0 top-0 flex h-full w-full scale-0 transition-transform group-hover/button:scale-100">
          <li className="absolute left-1/2 top-1/2 flex h-fit w-[85px] -translate-x-1/2 -translate-y-1/2 flex-row-reverse items-center justify-between group-hover/button:-rotate-45">
            <div
              onClick={() =>
                setColorSelection({
                  className: "bg-Narvik-500",
                  hexCode: "#22c554",
                })
              }
              className="h-7 w-7 rounded-full border-2 border-white bg-Narvik-500 shadow-sm transition hover:translate-x-2 hover:scale-125 hover:shadow-md"
            />
            <div
              onClick={() =>
                setColorSelection({
                  className: "bg-BlackHaze-900",
                  hexCode: "#293e51",
                })
              }
              className="h-7 w-7 rounded-full border-2 border-white bg-BlackHaze-900 shadow-sm transition hover:-translate-x-2 hover:scale-125 hover:shadow-md"
            />
          </li>
          <li className="absolute left-1/2 top-1/2 flex h-fit w-[85px] -translate-x-1/2 -translate-y-1/2 items-center justify-between group-hover/button:rotate-90">
            <div
              onClick={() =>
                setColorSelection({
                  className: "bg-IslandSpice-500",
                  hexCode: "#f5c60b",
                })
              }
              className="h-7 w-7 rounded-full border-2 border-white bg-IslandSpice-500 shadow-sm transition hover:-translate-x-2 hover:scale-125 hover:shadow-md"
            />
            <div
              onClick={() =>
                setColorSelection({
                  className: "bg-WispPink-500",
                  hexCode: "#ec48a1",
                })
              }
              className="h-7 w-7 rounded-full border-2 border-white bg-WispPink-500 shadow-sm transition hover:translate-x-2 hover:scale-125 hover:shadow-md"
            />
          </li>
          <li className="absolute left-1/2 top-1/2 flex h-fit w-[85px] -translate-x-1/2 -translate-y-1/2 items-center justify-between group-hover/button:rotate-45">
            <div
              onClick={() =>
                setColorSelection({
                  className: "bg-Serenade-500",
                  hexCode: "#f99416",
                })
              }
              className="h-7 w-7 rounded-full border-2 border-white bg-Serenade-500 shadow-sm transition hover:-translate-x-2 hover:scale-125 hover:shadow-md"
            />
            <div
              onClick={() =>
                setColorSelection({
                  className: "bg-Magnolia-500",
                  hexCode: "#765cf6",
                })
              }
              className="h-7 w-7 rounded-full border-2 border-white bg-Magnolia-500 shadow-sm transition hover:translate-x-2 hover:scale-125 hover:shadow-md"
            />
          </li>
          <li className="absolute left-1/2 top-1/2 flex h-fit w-[85px] -translate-x-1/2 -translate-y-1/2 items-center justify-between">
            <div
              onClick={() =>
                setColorSelection({
                  className: "bg-Chablis-500",
                  hexCode: "#ef4444",
                })
              }
              className="h-7 w-7 rounded-full border-2 border-white bg-Chablis-500 shadow-sm transition hover:-translate-x-2 hover:scale-125 hover:shadow-md"
            />
            <div
              onClick={() =>
                setColorSelection({
                  className: "bg-AliceBlue-500",
                  hexCode: "#0e91e9",
                })
              }
              className="h-7 w-7 rounded-full border-2 border-white bg-AliceBlue-500 shadow-sm transition hover:translate-x-2 hover:scale-125 hover:shadow-md"
            />
          </li>
        </ul>
      </button>
    </nav>
  );
};

export { ToolBox };

const buttonsProps = [
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
