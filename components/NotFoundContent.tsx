type NotFoundLink = { href: string; label: string; hrefLang?: string; lang?: string };

export default function NotFoundContent({
  title,
  body,
  links,
}: {
  title: string;
  body: string;
  links: NotFoundLink[];
}) {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 20,
        padding: "0 clamp(16px, 5vw, 64px)",
        background: "var(--ms-bg)",
        color: "var(--ms-fg)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-mono)",
          color: "var(--ms-orange-text)",
          margin: 0,
        }}
      >
        404
      </p>
      <h1 style={{ fontSize: "clamp(32px, 6vw, 64px)", fontWeight: 700, margin: 0 }}>
        {title}
      </h1>
      <p style={{ fontSize: "var(--text-body)", color: "var(--ms-fg-soft)", margin: 0 }}>
        {body}
      </p>
      <nav style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            hrefLang={link.hrefLang}
            lang={link.lang}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-mono)",
              color: "var(--ms-orange-text)",
            }}
          >
            {link.label} →
          </a>
        ))}
      </nav>
    </main>
  );
}
