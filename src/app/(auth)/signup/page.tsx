import { ArrowLink, Input, InputProps, Submit } from "@/components";

const SignUp = () => {
  return (
    <div className="flex w-3/5 min-w-min max-w-sm flex-col items-center gap-16">
      <form action="#" className="flex w-full flex-col gap-8 font-alt">
        <div className="flex flex-col gap-4">
          {inputFields.map((data, index) => (
            <Input key={index} {...{ ...data }} />
          ))}
        </div>

        <Submit value="Sign Up" />
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
  },
  {
    name: "confirmPassword",
    icon: "asterisk",
    placeholder: "confirm password",
    type: "password",
  },
];
