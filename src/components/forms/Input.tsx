import { Lock, Mail, SquareAsterisk, User2 } from "lucide-react";
import React from "react";

const icons = {
  lock: <Lock />,
  mail: <Mail />,
  asterisk: <SquareAsterisk />,
  user: <User2 />,
};

export type InputProps = {
  key?: string | number;
  name: string;
  icon: keyof typeof icons;
  type: React.HTMLInputTypeAttribute;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
};

const Input = ({
  name,
  icon,
  type,
  placeholder,
  required = true,
  disabled = false,
}: InputProps) => {
  return (
    <label
      htmlFor={name}
      className={`flex h-14 w-full items-center gap-2 rounded-lg border-2 border-Alabaster-200 px-4 ${
        disabled ? "bg-Alabaster-50" : "bg-white"
      }`}
    >
      {React.cloneElement(icons[icon], { color: "#859BAB" })}
      <input
        id={name}
        {...{ type, placeholder, required, disabled }}
        className="text-md border-none bg-transparent p-0 text-Alabaster-800 outline-none placeholder:text-Alabaster-200 focus:ring-0"
      />
    </label>
  );
};

export { Input };
