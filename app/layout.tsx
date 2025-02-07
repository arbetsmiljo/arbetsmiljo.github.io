import { Footer } from "@arbetsmarknad/components/Footer";
import { HeaderMenu } from "@arbetsmarknad/components/HeaderMenu";
import { Page } from "@arbetsmarknad/components/Page";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "arbetsmiljo.github.io",
  description: "Arbetssmiljö data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Page>
          <HeaderMenu
            href="https://arbetsmiljo.github.io"
            text="arbetsmiljo.github.io"
          />
          {children}
          <Footer
            sourceCode={[
              "arbetsmiljo/arbetsmiljo.github.io",
              "arbetsmarknad/components",
            ]}
          />
        </Page>
      </body>
    </html>
  );
}
