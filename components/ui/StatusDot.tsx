type StatusDotProps = {
  pulse?: boolean;
  color?: string;
};

export default function StatusDot({ pulse = true, color = "var(--ms-orange)" }: StatusDotProps) {
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
          className="ms-pulse-anim"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: color,
            opacity: 0.4,
          }}
        />
      )}
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: color,
        }}
      />
    </span>
  );
}
