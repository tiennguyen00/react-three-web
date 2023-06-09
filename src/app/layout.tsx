import classNames from "classnames";
import "./globals.css";
import {Inter} from "next/font/google";
import {luckiestguy, poppins} from "./font";

const inter = Inter({subsets: ["latin"]});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html
      lang="en"
      className={classNames(luckiestguy.variable, poppins.variable)}
    >
      <body className={inter.className}>{children}</body>
    </html>
  );
}
