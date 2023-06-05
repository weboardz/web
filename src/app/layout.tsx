import BlurBackground from "@/assets/blur-background.svg";
import { Roboto_Flex, Rubik } from "next/font/google";
import Image from "next/image";
import "./globals.css";

const roboto = Roboto_Flex({ subsets: ["latin"], variable: "--font-roboto" });
const rubik = Rubik({ subsets: ["latin"], variable: "--font-rubik" });

export const metadata = {
  title: "WeBoard",
  description: "An interactive way to created diagrams online!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${roboto.className} ${rubik.className} flex h-screen flex-col items-center p-14`}
      >
        <Image
          alt=""
          src={BlurBackground}
          className="top-o absolute right-0 -z-10 max-h-[80%]"
        />
        {children}
      </body>
    </html>
  );
}
