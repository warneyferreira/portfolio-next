import { IM_Fell_English_SC, UnifrakturCook } from "next/font/google";

/* Gótica: a textura pesada do título de "Pecado Capital". Romana: versaletes
   de prelo antigo, como o "XAMÃ" acima do título, para links e textos curtos. */
export const gotica = UnifrakturCook({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-gotica",
});

export const romana = IM_Fell_English_SC({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-romana",
});
