import { contact, profile } from "@/data/portfolio";
import EarthCanvas from "@/components/footer/EarthCanvas";
import s from "./contact.module.css";

export default function Contact() {
  return (
    <div className={s.close}>
      <section id="contato" aria-labelledby="contact-title" className={s.contact}>
        <div className={s.heading}>
          <h2 id="contact-title">Contato<span aria-hidden="true">.</span></h2>
        </div>

        <div className={s.correspondence}>
          <div className={s.letter}>
            <p className={s.message}>{contact.letter}</p>
            <p className={s.email}>
              <span>Escreva para</span>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </p>
          </div>

          <div className={s.seal} aria-hidden="true">
            <span className={s.sealInk} />
          </div>
        </div>

        <div className={s.details}>
          <dl className={s.facts}>
            <div><dt>Cidade</dt><dd>{contact.city}</dd></div>
            <div><dt>Agenda</dt><dd>{contact.schedule}</dd></div>
          </dl>
          <ul className={s.links}>
            <li><a href={profile.resume}>Currículo em PDF</a></li>
            <li><a href={contact.phone.href}>{contact.phone.label}</a></li>
            <li><a href={contact.linkedin}>LinkedIn</a></li>
            <li><a href={contact.github}>GitHub</a></li>
            <li><a href={profile.site}>warneyrego.com</a></li>
          </ul>
        </div>
      </section>
      <footer className={s.footer}>
        <p>{profile.name} · {profile.location} · 2026</p>
        <EarthCanvas />
      </footer>
    </div>
  );
}
