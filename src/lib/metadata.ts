import type { Metadata } from "next";
import { profile } from "@/data/portfolio";

const title = `${profile.name} | ${profile.role}`;

/* Seletor, Gravura e Luxúria são documentos separados, cada um com o seu
   layout raiz, e repetem os mesmos metadados. */
export const siteMetadata: Metadata = {
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
