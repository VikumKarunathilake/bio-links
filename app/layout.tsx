import type React from "react"
import { useEffect } from "react"
import type { Metadata } from "next"
import "./globals.css"
import TrailingCursor from "@/components/use-canvasCursor"

export const metadata: Metadata = {
  title: "Vikum Karunathilake",
  description: "Full-stack web developer using AI to build scalable and modern web apps.",
  keywords: ["Vikum Karunathilake", "Full-stack Developer", "AI Web Apps", "Next.js", "Portfolio"],
  authors: [{ name: "Vikum Karunathilake", url: "https://github.com/VikumKarunathilake" }],
  creator: "Vikum Karunathilake",
  openGraph: {
    title: "Vikum Karunathilake",
    description: "Building modern full-stack apps with the help of AI.",
    siteName: "Vikum Karunathilake Portfolio",
    locale: "en_US",
    type: "website",
  },
  themeColor: "#1e1e2f",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {children}
        <TrailingCursor />
      </body>
    </html>
  )
}
