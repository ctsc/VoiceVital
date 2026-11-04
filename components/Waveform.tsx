const heights = [
  28, 46, 62, 78, 94, 110, 94, 78, 62, 46, 28, 40, 70, 98, 118, 98, 70, 40, 28, 48, 66, 84, 100, 116,
  100, 84, 66, 48, 28, 52, 72, 92, 120, 138, 120, 92, 72, 52, 28, 44, 68, 88, 108, 124, 108, 88, 68,
  44, 28, 38, 58, 78, 96, 112, 96, 78, 58, 38, 28, 42, 64, 86, 104, 122, 104, 86, 64, 42,
]

export default function Waveform() {
  return (
    <div className="hero__wave" aria-hidden="true">
      {heights.map((h, i) => (
        <span
          key={i}
          style={{
            height: `${h * 0.55}px`,
            animationDelay: `${(i % 12) * 0.08}s`,
          }}
        />
      ))}
    </div>
  )
}
