import BlurBackground from "@/assets/blur-background.svg";
import Logo from "@/assets/logo.svg";
import WeBoard from "@/assets/typography.svg";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const LandingPage = () => {
  return (
    <>
      <Image
        alt=""
        src={BlurBackground}
        className="top-o absolute right-0 -z-10 max-h-[80%] w-auto"
      />
      <header className="flex w-full items-center justify-between text-xl text-BlackHaze-800">
        <div className="flex gap-8">
          <Image src={Logo} alt="Logo" />

          <nav className="flex items-center gap-4">
            <a className="font-semibold hover:underline" href="#">
              Explore
            </a>
            <a className="font-semibold hover:underline" href="#">
              About Us
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-8">
          <Link href="/signin" className="font-medium hover:underline">
            Log in
          </Link>
          <Link href="/signup">
            <button className="rounded-xl border-2 border-BlackHaze-800 bg-transparent px-6 py-2 font-semibold">
              Get Started
            </button>
          </Link>
        </div>
      </header>
      <main className="mt-52 flex w-full flex-col items-center gap-14 text-center">
        <h1 className="text-5xl font-bold text-BlackHaze-900">
          Create Diagrams Online With
        </h1>

        <Image src={WeBoard} alt="WeBoard!" />

        <h2 className="w-2/3 text-xl font-medium text-BlackHaze-600">
          Invite your team members to make brainstorms easier, and save your
          boards to be accessed anywhere and anytime!
        </h2>

        <Link href="/signup">
          <button className="group flex items-center rounded-full bg-gradient-to-tr from-AliceBlue-500 to-AliceBlue-400 px-6 py-3 font-semibold text-white">
            Get Started
            <ChevronRight
              size={22}
              className="transition-transform group-hover:translate-x-2"
            />
          </button>
        </Link>
      </main>
    </>
  );
};

export default LandingPage;
