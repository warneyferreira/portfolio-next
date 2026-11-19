import { gotica, romana } from "@/components/luxuria/fonts";
import Header from "@/components/luxuria/header/Header";
import { siteMetadata } from "@/lib/metadata";
import "../design-transition.css";
import "./globals.css";

export const metadata = siteMetadata;

export default function LuxuriaLayout({ children }: LayoutProps<"/luxuria">) {
  return (
    <html lang="pt-BR" className={`${gotica.variable} ${romana.variable}`}>
      <body id="inicio">
        <Header />
        {children}
      </body>
    </html>
  );
}
