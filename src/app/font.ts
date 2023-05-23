import { Luckiest_Guy, Poppins } from "next/font/google";

const luckiestguy = Luckiest_Guy({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-luckiest-guy",
});

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export { luckiestguy, poppins };
