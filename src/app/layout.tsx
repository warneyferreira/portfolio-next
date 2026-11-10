import type { Metadata } from "next";
import { Bricolage_Grotesque, Martian_Mono } from "next/font/google";
import { profile } from "@/data/portfolio";
import "./globals.css";

const title = `${profile.name} | ${profile.role}`;

const sans = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-sans",
});

const mono = Martian_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(profile.site),
  title,
  description: profile.description,
  openGraph: {
    title,
    description: profile.description,
    url: profile.site,
    locale: "pt_BR",
    type: "profile",
  },
  twitter: { description: profile.description },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
