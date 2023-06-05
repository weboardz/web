import GitHubLogo from "@/assets/github-logo.svg";
import GoogleLogo from "@/assets/google-logo.svg";
import Image from "next/image";

const types = {
  Google: {
    logo: GoogleLogo,
    bgColor: "bg-white",
    borderColor: "border-Alabaster-200",
    textColor: "text-Alabaster-600",
  },
  GitHub: {
    logo: GitHubLogo,
    bgColor: "bg-Alabaster-950",
    borderColor: "border-Alabaster-950",
    textColor: "text-white",
  },
};

const OAuthButton = ({
  type,
  disabled = false,
}: {
  type: keyof typeof types;
  key?: string | number;
  disabled?: boolean;
}) => {
  const { logo, bgColor, borderColor, textColor } = types[type];
  return (
    <button
      className={`${bgColor} ${borderColor} ${textColor} flex w-full items-center justify-center gap-4 rounded-md border-2 py-2 font-bold transition-shadow hover:shadow-md`}
    >
      <Image src={logo} alt="" width={26} />
      Sign In with {type}
    </button>
  );
};

export { OAuthButton };
