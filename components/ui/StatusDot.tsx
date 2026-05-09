type StatusDotProps = {
  pulse?: boolean;
};

export default function StatusDot({ pulse = true }: StatusDotProps) {
  return (
    <span
      aria-hidden="true"
      style={{
        position: "relative",
        display: "inline-flex",
        width: 8,
        height: 8,
        flexShrink: 0,
      }}
    >
      {pulse && (
        <span
          className="animate-pulse"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "var(--ms-orange)",
            opacity: 0.3,
            animation: "ms-pulse var(--anim-pulse) ease-out infinite",
          }}
        />
      )}
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "var(--ms-orange)",
        }}
      />
    </span>
  );
}
