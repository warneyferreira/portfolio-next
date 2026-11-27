import Link from "next/link";
import { contact, profile } from "@/data/portfolio";
import SectionHead from "../section/SectionHead";
import { availability } from "../copy";
import layout from "../section/section.module.css";
import s from "./contact.module.css";

/* Contato: o fecho. O título, depois uma frase, o e-mail grande, os
   caminhos e onde ele está. O rodapé fecha no mesmo fundo. */
export default function Contact() {
  return (
    <div className={s.close}>
      <section id="contato" className={s.contact} aria-labelledby="contato-titulo">
        <div className={s.content}>
          <div className={layout.inner}>
            <SectionHead id="contato-titulo" title="Contato" />

            <div className={s.lead} data-depth="2">
              <p className={s.message}>{contact.letter}</p>

              <a className={s.email} href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            </div>

            <div className={s.ways}>
              <div className={s.actions}>
                <a
                  className={s.pill}
                  href={contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                  <span className={layout.srOnly}> (abre em nova aba)</span>
                </a>
                <a
                  className={s.pill}
                  href={contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                  <span className={layout.srOnly}> (abre em nova aba)</span>
                </a>
                <a className={s.pill} href={contact.phone.href}>
                  {contact.phone.label}
                  <span className={layout.srOnly}> (telefone)</span>
                </a>
              </div>

              <dl className={s.facts}>
                <div>
                  <dt>Cidade</dt>
                  <dd>{contact.city}</dd>
                </div>
                <div>
                  <dt>Disponibilidade</dt>
                  <dd>{availability}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <footer className={s.footer}>
        <div className={s.inner}>
          <p className={s.signature}>
            <span className={s.person}>{profile.name}</span>
            <span>{profile.location}</span>
            <span>2026</span>
          </p>

          <div className={s.footerLinks}>
            <a href={profile.resume} download>
              Currículo em PDF
            </a>
            <Link href="/">Versão clássica</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
