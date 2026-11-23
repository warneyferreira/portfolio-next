#!/usr/bin/env node
/* Gera public/curriculo-warney-rego.pdf a partir de src/data/portfolio.ts.
   O Chrome imprime o HTML em A4; texto e links continuam selecionáveis. */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import ts from "typescript";

const root = resolve(import.meta.dirname, "..");
const dataPath = join(root, "src/data/portfolio.ts");
const outPath = join(root, "public/curriculo-warney-rego.pdf");

const js = ts.transpileModule(readFileSync(dataPath, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;

const { profile, resume, contact, experience, projects, education, certifications } = await import(
  `data:text/javascript;base64,${Buffer.from(js).toString("base64")}`
);

const esc = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]
  );

const link = (href, label) => `<a href="${esc(href)}">${esc(label)}</a>`;

const results = (items) => {
  const measured = items.filter((item) => item.value);
  const notes = items.filter((item) => !item.value);
  return [
    measured.length
      ? measured.map((item) => `<strong>${esc(item.value)}</strong> ${esc(item.label)}`).join("; ")
      : "",
    ...notes.map((item) => esc(item.label)),
  ].filter(Boolean);
};

const bullets = (job) => (job.resume ? job.resume.map(esc) : results(job.results));

const job = (entry) => {
  const items = bullets(entry);
  return `
    <article class="job">
      <h3>${esc(entry.company)} — ${esc(entry.role)}${entry.promotedTo ? ` → ${esc(entry.promotedTo)}` : ""}</h3>
      <p class="meta">${esc(entry.period)}</p>
      ${entry.resume ? "" : `<p>${esc(entry.summary)}</p>`}
      ${items.length ? `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>` : ""}
    </article>`;
};

const project = projects[0];

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>Currículo — ${esc(profile.name)}</title>
<meta name="author" content="${esc(profile.name)}">
<style>
  @page {
    size: A4;
    margin: 12mm 16mm 14mm;
    @bottom-left { content: "Warney Rego · warneyrego.com"; font-size: 7.4pt; color: #666; }
    @bottom-right { content: counter(page); font-size: 7.4pt; color: #666; }
  }
  * { box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body {
    margin: 0;
    color: #111;
    font-family: "DejaVu Sans", sans-serif;
    font-size: 9.2pt;
    line-height: 1.35;
  }
  h1 { margin: 0; font-size: 19.5pt; line-height: 1.05; letter-spacing: -0.02em; }
  .role { margin: 3pt 0 0; font-size: 10.2pt; font-weight: 700; }
  .contact { margin: 5pt 0 0; color: #444; font-size: 8.2pt; line-height: 1.45; }
  a { color: inherit; text-decoration: none; }
  section { margin-top: 12pt; }
  h2 {
    margin: 0 0 6pt;
    padding-bottom: 2.5pt;
    border-bottom: 1.1pt solid #111;
    font-size: 9.6pt;
    letter-spacing: 0.06em;
  }
  .job { margin-top: 9pt; }
  .job:first-of-type { margin-top: 0; }
  h3 { margin: 0; font-size: 9.8pt; line-height: 1.3; }
  .meta { margin: 1.5pt 0 3pt; color: #555; font-size: 8.1pt; }
  p { margin: 0 0 3pt; }
  ul { margin: 2pt 0 0; padding-left: 12pt; }
  li { margin: 0 0 2.2pt; }
  strong { font-weight: 700; }
  .page-break { break-before: page; }
  .certs { margin: 0; padding: 0; list-style: none; }
  .cert { margin: 0 0 4pt; break-inside: avoid; }
  .cert strong { display: block; }
  .cert span { color: #555; font-size: 8.1pt; }
  .skills p { margin-bottom: 3.5pt; }
</style>
</head>
<body>
  <header>
    <h1>${esc(profile.name)}</h1>
    <p class="role">${esc(resume.role)}</p>
    <p class="contact">${esc(contact.city)} · ${link(`mailto:${contact.email}`, contact.email)} · ${link(contact.phone.href, contact.phone.label)}</p>
    <p class="contact">${link(profile.site, profile.site.replace(/^https?:\/\//, ""))} · ${link(contact.linkedin, "LinkedIn")} · ${link(contact.github, "GitHub")}</p>
  </header>

  <section>
    <h2>PERFIL</h2>
    <p>${esc(resume.summary)}</p>
  </section>

  <section>
    <h2>EXPERIÊNCIA PROFISSIONAL</h2>
    ${experience.map(job).join("")}
  </section>

  <div class="page-break"></div>

  <section>
    <h2>PROJETO EM DESTAQUE</h2>
    <h3>${esc(project.name)} — ${esc(project.subtitle)}</h3>
    <p class="meta">${link(project.href, new URL(project.href).hostname.replace(/^www\./, ""))}</p>
    <p>${esc(project.description)}</p>
    <ul>${project.highlights.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
  </section>

  <section>
    <h2>FORMAÇÃO</h2>
    ${education
      .map(
        (item) => `
      <h3>${esc(item.course)}</h3>
      <p class="meta">${esc(item.institution)} · ${esc(item.period)}</p>
      <p>${item.highlights.map(esc).join("; ")}.</p>`
      )
      .join("")}
  </section>

  <section>
    <h2>CERTIFICAÇÕES</h2>
    <ul class="certs">
      ${certifications
        .map(
          (item) => `
        <li class="cert">
          <strong>${esc(item.name)}</strong>
          <span>${esc(item.issuer)} · ${esc(item.date)}${item.badge ? ` · ${esc(item.badge)}` : ""}</span>
        </li>`
        )
        .join("")}
    </ul>
  </section>

  <section class="skills">
    <h2>COMPETÊNCIAS TÉCNICAS</h2>
    ${resume.skills
      .map(
        (group) =>
          `<p><strong>${esc(group.label)}:</strong> ${group.items.map(esc).join(", ")}.</p>`
      )
      .join("")}
  </section>
</body>
</html>`;

const dir = mkdtempSync(join(tmpdir(), "curriculo-"));
const htmlPath = join(dir, "curriculo.html");
writeFileSync(htmlPath, html);

try {
  execFileSync(process.env.CHROME ?? "google-chrome", [
    "--headless",
    "--no-sandbox",
    "--disable-gpu",
    "--no-pdf-header-footer",
    `--print-to-pdf=${outPath}`,
    `file://${htmlPath}`,
  ], { stdio: "inherit" });
  console.log(`PDF gerado em ${outPath}`);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
