import { ArrowUpRight, CalendarCheck, Layers, Shield } from "lucide-react";
import { ReactNode } from "react";
import { PredatarBackground } from "./predatar-background";

type BackgroundImageResponse = {
  id: number;
  fileName: string;
  path: string;
  status: boolean;
  creditText: string;
};

async function fetchBackgroundImage(): Promise<BackgroundImageResponse | null> {
  const baseUrl = process.env.PREDATAR_API_BASE_URL;
  if (!baseUrl) {
    console.warn("[PredatarLayout] PREDATAR_API_BASE_URL is not set");
    return null;
  }

  const url = `${baseUrl}/ac/api/v1/BackgroundImage/GetActiveImage`;
  console.log("[PredatarLayout] Fetching background image from:", url);

  try {
    const res = await fetch(url, {
      next: { revalidate: process.env.NODE_ENV === "development" ? 0 : 3600 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      console.warn("[PredatarLayout] API responded with status:", res.status);
      return null;
    }
    const data: BackgroundImageResponse = await res.json();
    console.log("[PredatarLayout] Got background image:", data.fileName, "| credit:", data.creditText);
    return data;
  } catch (err) {
    console.error("[PredatarLayout] Failed to fetch background image:", err);
    return null;
  }
}

type Props = {
  children: ReactNode;
  heading?: string;
  subheading?: string;
};

export async function PredatarLoginnameLayout({
  children,
  heading = "Hello again",
  subheading = "Already have a Predatar account? Login here:",
}: Props) {
  const bgData = await fetchBackgroundImage();
  const predatarBase = process.env.PREDATAR_API_BASE_URL ?? "";

  const backgroundImageUrl = bgData ? `${predatarBase}${bgData.path}/${bgData.fileName}` : null;
  const creditText = bgData?.creditText ?? null;
  // Logo is served locally from /public for reliability. The original source is
  // documented via SHERLOCK_BASE_URL in .env (sherlock.predatar.com).
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const logoUrl = `${basePath}/predatar-logo.png`;

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", flexDirection: "row", minHeight: "100vh" }}>

        {/* Left side — background image + form */}
        <div
          style={{
            position: "relative",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            backgroundColor: "#181d25",
          }}
        >
          <PredatarBackground imageUrl={backgroundImageUrl} />

          {/* Dark overlay */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.45)", zIndex: 1 }} />
          {/* Bottom gradient */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "8rem", background: "linear-gradient(to top, rgba(0,0,0,0.65), transparent)", zIndex: 1 }} />

          {/* Logo */}
          <div style={{ position: "relative", zIndex: 2, padding: "24px 32px 0" }}>
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt="Predatar"
                style={{ height: "40px", width: "auto" }}
              />
            ) : (
              <div style={{ color: "white", fontSize: "1.5rem", fontWeight: 700, letterSpacing: "0.1em" }}>
                <span style={{ color: "#f67600" }}>PRED</span>ATAR
              </div>
            )}
          </div>

          {/* Form area */}
          <div style={{ position: "relative", zIndex: 2, flex: 1, display: "flex", alignItems: "center", padding: "48px 64px" }}>
            <div style={{ width: "100%", maxWidth: "480px" }}>
              <h1 style={{ color: "white", fontSize: "3rem", fontWeight: 700, lineHeight: 1.2, marginBottom: "8px" }}>
                {heading}
              </h1>
              <p style={{ color: "#9ca3af", fontSize: "0.875rem", marginBottom: "32px" }}>
                {subheading}
              </p>
              {children}
            </div>
          </div>

          {/* Footer */}
          <div style={{ position: "relative", zIndex: 2, padding: "0 32px 16px" }}>
            {creditText && (
              <p style={{ color: "rgba(209,213,219,0.8)", fontSize: "0.75rem" }}>{creditText}</p>
            )}
            <p style={{ color: "rgba(209,213,219,0.8)", fontSize: "0.75rem" }}>
              See your imagery here. Send your photos to{" "}
              <a href="mailto:photo@predatar.com" style={{ textDecoration: "underline", color: "inherit" }}>
                photo@predatar.com
              </a>
            </p>
          </div>
        </div>

        {/* Right side — marketing */}
        <div style={{ width: "50%", backgroundColor: "#111827", display: "flex", flexDirection: "column", padding: "48px 56px" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h2 style={{ color: "white", fontSize: "2.25rem", fontWeight: 700, marginBottom: "16px" }}>
              New to Predatar?
            </h2>
            <p style={{ color: "#9ca3af", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "40px" }}>
              Discover Recovery Confidence with the Recovery Assurance platform built for operational resilience.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              <FeatureItem
                icon={<Layers style={{ width: 24, height: 24, color: "#f67600" }} />}
                title="Break down your data silos"
                description="Manage your Recovery Assurance in one place – even if you have complex multi-vendor storage and backup."
              />
              <FeatureItem
                icon={<Shield style={{ width: 24, height: 24, color: "#f67600" }} />}
                title="Validate your recoveries"
                description="Prove your data can be recovered quickly, cleanly and completely – before a crisis."
              />
              <FeatureItem
                icon={<CalendarCheck style={{ width: 24, height: 24, color: "#f67600" }} />}
                title="Get Recovery Confident. Stay Recovery Confident"
                description="Automate recovery testing and malware interrogation of business-critical systems – Every day."
              />
            </div>

            <a
              href="https://www.predatar.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginTop: "40px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                border: "1px solid #4b5563",
                color: "white",
                fontSize: "0.875rem",
                padding: "10px 20px",
                borderRadius: "6px",
                textDecoration: "none",
                width: "fit-content",
              }}
            >
              Visit the website
              <ArrowUpRight style={{ width: 16, height: 16 }} />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

function FeatureItem({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div style={{ display: "flex", gap: "16px" }}>
      <span style={{ flexShrink: 0, marginTop: "2px" }}>{icon}</span>
      <div>
        <h3 style={{ color: "white", fontWeight: 600, fontSize: "0.875rem", marginBottom: "4px" }}>{title}</h3>
        <p style={{ color: "#9ca3af", fontSize: "0.75rem", lineHeight: 1.6 }}>{description}</p>
      </div>
    </div>
  );
}
