"use client";

import {
  ArrowLink,
  Input,
  InputProps,
  OAuthButton,
  Submit,
} from "@/components";
import { convertFormDataToObject } from "@/lib/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      e.preventDefault();

      const { email, password, rememberMe } = convertFormDataToObject(
        new FormData(e.currentTarget)
      );

      setIsLoading(true);

      try {
        await axios.post("/api/auth/signin", { email, password, rememberMe });
        router.push("/home");
      } catch (error) {
        alert("Could not Sign In");
        setIsLoading(false);
      }
    },
    [router]
  );

  return (
    <div className="flex w-3/5 min-w-min max-w-sm flex-col items-center gap-16">
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-8 font-alt"
      >
        <div className="flex flex-col gap-4">
          {inputFields.map((data, index) => (
            <Input key={index} {...{ ...data }} disabled={isLoading} />
          ))}

          <label
            htmlFor="rememberMe"
            className="flex items-center gap-2 font-medium text-Alabaster-300"
          >
            <input
              id="rememberMe"
              type="checkbox"
              name="rememberMe"
              disabled={isLoading}
              className="h-5 w-5 cursor-pointer rounded-md border-2 border-Alabaster-200 text-AliceBlue-400"
            />
            Remember me
          </label>
        </div>

        <Submit value="Sign In" disabled={isLoading} />

        <div className="relative flex items-center justify-center">
          <div className="h-[2px] w-full bg-Alabaster-200" />
          <p className="absolute bg-white p-2 text-sm font-bold text-Alabaster-500">
            OR
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <OAuthButton type="Google" disabled={isLoading} />
          <OAuthButton type="GitHub" disabled={isLoading} />
        </div>
      </form>

      <div className="flex gap-2 text-sm text-Alabaster-600">
        Don’t have an account?
        <ArrowLink text="Sign Up" href="/signup" />
      </div>
    </div>
  );
};

export default SignIn;

const inputFields: InputProps[] = [
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
];
