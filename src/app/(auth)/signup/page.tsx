"use client";

import { ArrowLink, Input, InputProps, Submit } from "@/components";
import { api } from "@/lib";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const passwordValue = useRef("");

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      e.preventDefault();

      const formData = new FormData(e.currentTarget);
      const data: { [index: string]: any } = {};
      formData.forEach((value, key) => (data[key] = value));

      setIsLoading(true);
      try {
        await api.post("/auth/signup", data);
        router.push("/signin");
      } catch (error) {
        alert("ohhh nooooo!");
        setIsLoading(false);
      }
    },
    [router]
  );

  useEffect(() => {
    inputFields.forEach((input) => {
      switch (input.name) {
        case "password":
          input.onChange = (e) => {
            passwordValue.current = e.currentTarget.value;
          };
          break;

        case "confirmPassword":
          input.onChange = (e) => {
            const confirmPassword = e.currentTarget;
            console.log(confirmPassword.value, passwordValue.current)
            if (confirmPassword.value !== passwordValue.current) {
              confirmPassword.setCustomValidity("Passwords don't match!");
            } else {
              confirmPassword.setCustomValidity("");
            }
          };
          break;
      }
    });
  }, []);

  return (
    <div className="flex w-3/5 min-w-min max-w-sm flex-col items-center gap-16">
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-8 font-alt"
      >
        <div className="flex flex-col gap-4">
          {inputFields.map((data, index) => {
            return <Input key={index} {...{ ...data }} disabled={isLoading} />;
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
