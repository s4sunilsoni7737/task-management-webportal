import type { Metadata } from "next";
import { Providers } from "@/app/providers";
import "./globals.css";

// NOTE: Using the system font stack (see globals.css `body { font-family }`)
// rather than `next/font/google` — this keeps builds reproducible in
// network-restricted environments (CI, sandboxes) without any visual
// difference, since the design calls for "a neutral sans-serif similar to
// Inter, Geist, or SF Pro" rather than Inter specifically.

export const metadata: Metadata = {
  title: "Pyramid",
  description: "A lightweight project and task management workspace.",
};

/**
 * Inline, render-blocking script that applies the persisted theme + color
 * mode before first paint. This is required to satisfy the assessment's
 * "theme should persist across page refreshes" requirement without a
 * flash of the wrong theme — React state isn't available yet at this
 * point, so it reads localStorage directly.
 */
const THEME_INIT_SCRIPT = `
(function() {
  try {
    var raw = localStorage.getItem("dexter-ui");
    var theme = "light";
    var colorMode = "black";
    if (raw) {
      var parsed = JSON.parse(raw);
      theme = (parsed.state && parsed.state.theme) || theme;
      colorMode = (parsed.state && parsed.state.colorMode) || colorMode;
    }
    var root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    root.setAttribute("data-color-mode", colorMode);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
