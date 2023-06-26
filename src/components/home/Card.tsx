import { Globe, Lock, Share2, Trash2, Users2 } from "lucide-react";
import Link from "next/link";
import { cloneElement } from "react";

const [oneMinute, oneHourInMinutes, oneDayInMinutes] = [1, 60, 60 * 24];
const oneMinuteInMilliseconds = 1000 * 60;

const createLastTimeEditedMessage = (lastUpdatedTime: Date) => {
  const now = new Date().getTime();
  const difference = now - lastUpdatedTime.getTime();

  const timeInMinutes = Math.floor(difference / oneMinuteInMilliseconds);
  const timeInHours = Math.floor(timeInMinutes / oneHourInMinutes);

  switch (true) {
    case timeInMinutes < oneMinute:
      return "Edited just now";
      break;
    case timeInMinutes < oneHourInMinutes:
      return `Edited ${timeInMinutes} minutes ago`;
      break;
    case timeInMinutes < 2 * oneHourInMinutes:
      return "Edited 1 hour ago";
      break;
    case timeInMinutes < oneDayInMinutes:
      return `Edited ${timeInHours} hours ago`;
      break;
    case timeInMinutes < 2 * oneDayInMinutes:
      return "Edited yesterday";
      break;
    default:
      return `Edited on ${lastUpdatedTime.toLocaleDateString()}`;
  }
};

const cardTypeStyles = {
  public: {
    icon: <Globe />,
    styles: {
      backgroundColor: "#0E91E9",
      borderColor: "#38ABF8",
      color: "#E0F2FE",
    },
  },
  team: {
    icon: <Users2 />,
    styles: {
      backgroundColor: "#14B892",
      borderColor: "#2DD4AD",
      color: "#CCFBF0",
    },
  },
  private: {
    icon: <Lock />,
    styles: {
      backgroundColor: "#765CF6",
      borderColor: "#9E8BFA",
      color: "#ECE9FE",
    },
  },
};

type CardProps = {
  key?: string;
  id: string;
  name: string;
  updatedAt: Date;
  type: "private" | "public" | "team";
  setDeleteId(id: string): void;
};

const Card = ({ id, name, updatedAt, type, setDeleteId }: CardProps) => {
  return (
    <div className="relative h-52 w-60 overflow-hidden rounded-md border-2 border-Alabaster-200 bg-white transition-shadow hover:shadow-md">
      <div className="absolute right-4 top-4 flex gap-4 text-Alabaster-400">
        {type !== "private" && <Share2 className="h-5 w-5 cursor-pointer" />}
        <Trash2
          className="h-5 w-5 cursor-pointer transition-colors hover:text-red-500"
          onClick={() => setDeleteId(id)}
        />
      </div>

      <div className="absolute bottom-0 flex h-16 w-full items-center justify-between bg-Alabaster-50 px-4">
        <div className="flex w-9/12 flex-col justify-center">
          <Link
            target="_blank"
            href={`/board/${id}`}
            className="overflow-hidden text-ellipsis whitespace-nowrap text-lg font-medium text-Alabaster-800 hover:underline"
          >
            {name}
          </Link>
          <p className="text-sm text-Alabaster-300">
            {createLastTimeEditedMessage(updatedAt)}
          </p>
        </div>

        <div
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded border-2"
          style={{ ...cardTypeStyles[type].styles }}
        >
          {cloneElement(cardTypeStyles[type].icon, { width: 24, height: 24 })}
        </div>
      </div>
    </div>
  );
};

export { Card };
