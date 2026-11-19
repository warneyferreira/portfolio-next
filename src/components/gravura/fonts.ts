import { Bricolage_Grotesque, Martian_Mono } from "next/font/google";

export const sans = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-sans",
});

export const mono = Martian_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});
