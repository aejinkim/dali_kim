import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const googleSansFlex = localFont({
  src: "../../public/font/Google_Sans_Flex/GoogleSansFlex-VariableFont_GRAD,ROND,opsz,slnt,wdth,wght.ttf",
  variable: "--font-google-sans-flex",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dali Kim | Head of Design & Product Designer Portfolio",
  description: "Interactive portfolio of Dali Kim, a Product Designer with 15+ years of experience leading design across mission-critical satellite ground control systems and multi-billion dollar DeFi protocols.",
  keywords: ["Dali Kim", "Head of Design", "Product Designer", "Web3 UX", "DeFi Design", "Initia", "Anchor Protocol", "Satellite Ground Control Systems"],
  authors: [{ name: "Dali Kim", url: "https://linkedin.com/in/dali-k-50780379/" }],
  openGraph: {
    title: "Dali Kim | Head of Design & Product Designer Portfolio",
    description: "15+ years designing where complexity meets consequence — from mission-critical satellite control systems to DeFi protocols with $16B+ TVL.",
    type: "website",
    locale: "en_US",
    url: "https://dali-kim.vercel.app",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.jpg"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${googleSansFlex.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
