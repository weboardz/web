import DarkLogo from "@/assets/logo-dark.svg";
import LightLogo from "@/assets/logo-white.svg";
import Image from "next/image";
import Link from "next/link";

const themes = {
  light: { logo: LightLogo, color: "text-BlackHaze-100" },
  dark: { logo: DarkLogo, color: "text-BlackHaze-600" },
};

const Logo = ({ theme }: { theme: keyof typeof themes }) => {
  const { logo, color } = themes[theme];
  return (
    <Link href="/" className="flex items-center gap-4">
      <Image src={logo} alt="Logo" />
      <span className={`font-alt text-2xl font-bold ${color}`}>WeBoard</span>
    </Link>
  );
};

export { Logo };
