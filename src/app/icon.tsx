import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/**
 * Browser-tab mark: the site's acid on the site's void, as a hard-edged
 * monogram. A dark glyph on a bright ground rather than the reverse — at 16px
 * the bright shape is what survives, and it stays visible whether the browser
 * chrome is light or dark.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ccff3d",
          borderRadius: 14,
          color: "#05060a",
          fontSize: 46,
          fontWeight: 700,
          fontFamily: "sans-serif",
          letterSpacing: -2,
          // Optical centring — the K sits high in its em box.
          paddingBottom: 3,
        }}
      >
        K
      </div>
    ),
    size,
  );
}
