const STACK_CHIPS = ["C#", ".NET", "Architecture", "TS", "JavaScript", "React", "AI"];

export default function TerminalCard() {
  return (
    <div
      style={{
        background: "var(--ms-surface)",
        border: "1px solid var(--ms-border-strong)",
        borderRadius: "var(--radius-xl)",
        fontFamily: "var(--font-mono)",
        overflow: "hidden",
      }}
    >
      {/* Title bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 16px",
          borderBottom: "1px solid var(--ms-border)",
        }}
      >
        <span
          aria-hidden="true"
          style={{ display: "inline-flex", gap: 4 }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              background: "hsl(var(--color-tl-red))",
            }}
          />
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              background: "hsl(var(--color-tl-yellow))",
            }}
          />
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              background: "hsl(var(--color-tl-green))",
            }}
          />
        </span>
        <span
          style={{
            marginLeft: 24,
            fontSize: "var(--text-label)",
            fontWeight: 400,
            color: "var(--ms-fg-faint)",
          }}
        >
          ~ / status.sh
        </span>
      </div>

      {/* Body */}
      <div
        style={{
          padding: 32,
          fontSize: "var(--text-mono)",
          fontWeight: 400,
          lineHeight: 1.75,
          color: "var(--ms-fg)",
        }}
      >
        <div>
          <span style={{ color: "var(--ms-fg-faint)" }}>$</span> whoami
        </div>
        <div
          style={{
            color: "var(--ms-orange-text)",
            marginBottom: 16,
          }}
        >
          &gt; daniel.trochez
        </div>

        <div>
          <span style={{ color: "var(--ms-fg-faint)" }}>$</span> cat role
        </div>
        <div style={{ marginBottom: 16 }}>→ software_developer</div>

        <div>
          <span style={{ color: "var(--ms-fg-faint)" }}>$</span>{" "}
          ./availability
        </div>
        <div style={{ marginBottom: 16 }}>
          <span style={{ color: "var(--ms-orange-text)" }}>●</span> open
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            marginTop: 8,
          }}
        >
          {STACK_CHIPS.map((chip) => (
            <span
              key={chip}
              style={{
                padding: "2px 8px",
                border: "1px solid var(--ms-border)",
                borderRadius: "var(--radius-sm)",
                fontSize: "var(--text-label)",
                fontWeight: 400,
                color: "var(--ms-fg-soft)",
              }}
            >
              {chip}
            </span>
          ))}
        </div>

        <div
          style={{
            marginTop: 24,
            color: "var(--ms-fg-faint)",
          }}
        >
          ${" "}
          <span
            className="ms-cursor"
            aria-hidden="true"
            style={{
              borderRight: "7px solid var(--ms-orange)",
              paddingRight: 1,
              animation: "ms-cursor var(--anim-cursor) step-end infinite",
            }}
          >
            _
          </span>
        </div>
      </div>
    </div>
  );
}
