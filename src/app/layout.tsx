import { mono, sans } from "@/components/gravura/fonts";
import { siteMetadata } from "@/lib/metadata";
import "./globals.css";

export const metadata = siteMetadata;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
