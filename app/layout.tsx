import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Pandaroute",
  description:
    "A personalised route from QA / Test Analyst to Product Manager: find your gaps, practise what matters, and build evidence you can show.",
};

// viewportFit: "cover" is what makes env(safe-area-inset-*) resolve to real
// values; without it the CTA sits under the iPhone home indicator.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // The keyboard shrinks the viewport instead of overlaying it, so a sticky CTA
  // stays above the keyboard rather than behind it.
  interactiveWidget: "resizes-content",
  themeColor: "#fff8eb",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
