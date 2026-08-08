import type { Metadata } from "next";
import { Aref_Ruqaa, Tajawal, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const arefRuqaa = Aref_Ruqaa({
  weight: ["400", "700"],
  subsets: ["arabic", "latin"],
  variable: "--font-aref",
  display: "swap",
});

const tajawal = Tajawal({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["arabic", "latin"],
  variable: "--font-tajawal",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  weight: ["400", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "بيت الذهب | مجوهرات فاخرة",
  description: "مجوهرات فاخرة — تصاميم استثنائية بلمسة عربية أصيلة",
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  metadataBase: new URL("https://beit-al-dahab-jewellery.vercel.app"),
  openGraph: {
    title: "بيت الذهب | مجوهرات فاخرة",
    description: "مجوهرات فاخرة — تصاميم استثنائية بلمسة عربية أصيلة",
    url: "https://beit-al-dahab-jewellery.vercel.app",
    siteName: "بيت الذهب",
    locale: "ar_KW",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "بيت الذهب | مجوهرات فاخرة",
    description: "مجوهرات فاخرة — تصاميم استثنائية بلمسة عربية أصيلة",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${arefRuqaa.variable} ${tajawal.variable} ${cormorant.variable} h-full antialiased`}
    >
      <head>
        <script
          type="module"
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}