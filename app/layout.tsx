import type { Metadata } from "next";
import { Archivo, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Nav from "./components/Nav";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const plex = IBM_Plex_Sans({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const title = "Vigil — know when your AI coding agent needs you";
const description =
  "A quiet Windows widget for AI coding agents. It ignores the work, opens only when a decision needs you, and lets you answer above the taskbar. Claude Code ships now; Codex is in source.";

export const metadata: Metadata = {
  title,
  description,
  // Absolute base for og:image and friends. This was vigil.dev — a domain we
  // do not own, which was answering with a 114-byte parking page, so every
  // shared link resolved its preview image to a stranger's server.
  metadataBase: new URL("https://vigilit.app"),
  openGraph: {
    title,
    description,
    type: "website",
    images: ["/shots/desk-approve.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/shots/desk-approve.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${archivo.variable} ${plex.variable} ${plexMono.variable} antialiased`}
      >
        <Nav />
        {children}
      </body>
    </html>
  );
}
