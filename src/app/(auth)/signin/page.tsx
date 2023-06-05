import {
  ArrowLink,
  Input,
  InputProps,
  OAuthButton,
  Submit,
} from "@/components";

const SignIn = () => {
  return (
    <div className="flex w-3/5 min-w-min max-w-sm flex-col items-center gap-16">
      <form action="#" className="flex w-full flex-col gap-8 font-alt">
        <div className="flex flex-col gap-4">
          {inputFields.map((data, index) => (
            <Input key={index} {...{ ...data }} />
          ))}

          <label
            htmlFor="checkbox"
            className="flex items-center gap-2 font-medium text-Alabaster-300"
          >
            <input
              id="checkbox"
              type="checkbox"
              className="h-5 w-5 cursor-pointer rounded-md border-2 border-Alabaster-200 text-AliceBlue-400"
            />
            Remember me
          </label>
        </div>

        <Submit value="Sign In" />

        <div className="relative flex items-center justify-center">
          <div className="h-[2px] w-full bg-Alabaster-200" />
          <p className="absolute bg-white p-2 text-sm font-bold text-Alabaster-500">
            OR
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <OAuthButton type="Google" />
          <OAuthButton type="GitHub" />
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
  },
];
