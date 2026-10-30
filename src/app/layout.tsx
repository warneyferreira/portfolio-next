import type { Metadata } from "next";
import { profile } from "@/data/portfolio";

const title = `${profile.name} | ${profile.role}`;

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
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
