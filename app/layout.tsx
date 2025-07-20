import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import TrailingCursor from "@/components/use-canvasCursor"

export const metadata: Metadata = {
  title: "Vikum Karunathilake",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <TrailingCursor />
      </body>
    </html>
  )
}
