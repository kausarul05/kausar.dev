import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Home-screen icon. Roomier than the tab mark, so the acid dot from the site's
 * wordmark comes along with the monogram.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          background: "#05060a",
          backgroundImage:
            "radial-gradient(140px circle at 20% 12%, #6d4dff66, transparent 62%)",
          color: "#ccff3d",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 104, fontWeight: 700, letterSpacing: -5 }}>K</div>
        <div style={{ display: "flex", width: 12, height: 12, borderRadius: 999, background: "#ccff3d" }} />
      </div>
    ),
    size,
  );
}
