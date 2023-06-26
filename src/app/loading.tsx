import Logo from "@/assets/logo.svg";
import Image from "next/image";

const Loading = () => {
  return (
    <main className="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center gap-10">
      <Image src={Logo} alt="Logo" />
    </main>
  );
};

export default Loading;
