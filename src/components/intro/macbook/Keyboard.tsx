/** Deck keyboard + trackpad. Purely presentational, sized from the lid width. */
export function Keyboard({ W }: { W: number }) {
  const rows = [14, 14, 13, 12, 9];
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: "7%",
          right: "7%",
          top: "10%",
          height: "42%",
          borderRadius: W * 0.008,
          background: "linear-gradient(180deg, #0b0d11 0%, #05070a 100%)",
          boxShadow: "inset 0 1px 2px rgba(0,0,0,.95), inset 0 0 0 1px rgba(255,255,255,.035)",
          display: "grid",
          gridTemplateRows: `repeat(${rows.length}, 1fr)`,
          gap: W * 0.0032,
          padding: W * 0.005,
        }}
      >
        {rows.map((n, r) => (
          <div key={r} style={{ display: "grid", gridTemplateColumns: `repeat(${n}, 1fr)`, gap: W * 0.0032 }}>
            {Array.from({ length: n }).map((__, c) => (
              <div
                key={c}
                style={{
                  borderRadius: Math.max(1, W * 0.0022),
                  background: "linear-gradient(180deg, #1a1e25 0%, #0c0f13 100%)",
                  boxShadow: "0 1px 0 rgba(0,0,0,.85), inset 0 1px 0 rgba(255,255,255,.05)",
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* trackpad */}
      <div
        style={{
          position: "absolute",
          left: "31%",
          right: "31%",
          top: "57%",
          height: "31%",
          borderRadius: W * 0.006,
          background: "linear-gradient(180deg, #1e232a 0%, #161a20 100%)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,.055), inset 0 2px 6px rgba(0,0,0,.35)",
        }}
      />
    </>
  );
}
