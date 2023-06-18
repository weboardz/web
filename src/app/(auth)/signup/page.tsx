"use client";

import { ArrowLink, Input, InputProps, Submit } from "@/components";
import { api } from "@/config";
import { convertFormDataToObject } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const passwordRef = useRef<HTMLInputElement>();
  const confirmPasswordRef = useRef<HTMLInputElement>();

  const validatePassword: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      const input = e.currentTarget;

      const [currentPassword, currentConfirmPassword] = [
        passwordRef.current,
        confirmPasswordRef.current,
      ];

      if (currentPassword?.value !== currentConfirmPassword?.value) {
        input.setCustomValidity("Passwords don't match");
      } else {
        currentPassword?.setCustomValidity("");
        currentConfirmPassword?.setCustomValidity("");
      }
    }, []);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      e.preventDefault();

      const { name, email, password } = convertFormDataToObject(
        new FormData(e.currentTarget)
      );

      setIsLoading(true);

      try {
        await api.post("/auth/signup", { name, email, password });
        router.push("/signin");
      } catch (error) {
        alert("Could not Sign Up");
        setIsLoading(false);
      }
    },
    [router]
  );

  const inputExclusiveProps: {
    [key: string]: {
      onChange: React.ChangeEventHandler<HTMLInputElement>;
      inputRef: React.MutableRefObject<HTMLInputElement | undefined>;
    };
  } = {
    password: {
      onChange: validatePassword,
      inputRef: passwordRef,
    },
    confirmPassword: {
      onChange: validatePassword,
      inputRef: confirmPasswordRef,
    },
  };

  return (
    <div className="flex w-3/5 min-w-min max-w-sm flex-col items-center gap-16">
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-8 font-alt"
      >
        <div className="flex flex-col gap-4">
          {inputFields.map((data, index) => {
            return (
              <Input
                key={index}
                {...{ ...data }}
                disabled={isLoading}
                inputRef={inputExclusiveProps[data.name]?.inputRef}
                onChange={inputExclusiveProps[data.name]?.onChange}
              />
            );
          })}
        </div>

        <Submit value="Sign Up" disabled={isLoading} />
      </form>

      <div className="flex gap-2 text-sm text-Alabaster-600">
        Already have an account?
        <ArrowLink text="Sign In" href="/signin" />
      </div>
    </div>
  );
};

export default SignUp;

const inputFields: InputProps[] = [
  {
    name: "name",
    icon: "user",
    placeholder: "name",
    type: "text",
    minLength: 2,
    maxLength: 32,
  },
  {
    name: "email",
    icon: "mail",
    placeholder: "email",
    type: "email",
  },
  {
    name: "password",
    icon: "lock",
    placeholder: "password",
    type: "password",
    minLength: 8,
    maxLength: 16,
  },
  {
    name: "confirmPassword",
    icon: "asterisk",
    placeholder: "confirm password",
    type: "password",
    minLength: 8,
    maxLength: 16,
  },
];
