import type { Metadata } from "next";
import { Archivo, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

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

const title = "Vigil — stop babysitting your agent";
const description =
  "A dot in the corner of your screen. Silent while Claude Code works — and when it is genuinely stuck, you approve from the dot without leaving what you are doing. Free, Windows, no account.";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL("https://vigil.dev"),
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
        {children}
      </body>
    </html>
  );
}
