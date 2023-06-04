import { Roboto_Flex, Rubik } from "next/font/google";
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
      <body className={`${roboto.className} ${rubik.className} p-14`}>
        {children}
      </body>
    </html>
  );
}
