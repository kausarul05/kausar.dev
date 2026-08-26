import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getContent } from "@/lib/content";

export const alt = "Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The card people see when the link is pasted into LinkedIn, X or Slack.
 * Built at request time from the same tokens the site uses.
 */
export default async function OpengraphImage() {
  const { site } = await getContent();
  const photoPath = site.photo.replace(/^\//, "");
  const photo = readFileSync(join(process.cwd(), "public", photoPath)).toString("base64");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#05060a",
          backgroundImage:
            "radial-gradient(900px circle at 15% -10%, #6d4dff55, transparent 60%), radial-gradient(700px circle at 95% 110%, #3ddcff33, transparent 60%)",
          color: "#eceef5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 12, height: 12, borderRadius: 999, background: "#ccff3d" }} />
            <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, color: "#868c9e" }}>
              {`PORTFOLIO — ${site.edition}`}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 96,
              fontWeight: 700,
              letterSpacing: -4,
              lineHeight: 1.02,
              marginTop: 28,
            }}
          >
            {site.name}
          </div>

          <div style={{ display: "flex", fontSize: 38, color: "#ccff3d", marginTop: 18 }}>
            {site.role}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: "#868c9e",
              marginTop: 26,
              lineHeight: 1.4,
            }}
          >
            {`React · Next.js · TypeScript · React Native — ${site.location}`}
          </div>
        </div>

        <div style={{ display: "flex", position: "relative" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- satori renders raw <img>; next/image is not available here */}
          <img
            src={`data:image/jpeg;base64,${photo}`}
            width={340}
            height={340}
            style={{
              borderRadius: 999,
              objectFit: "cover",
              border: "2px solid rgba(204,255,61,0.35)",
            }}
            alt=""
          />
        </div>
      </div>
    ),
    size,
  );
}
