import type React from "react"
import type { Metadata, Viewport } from "next"
import ClientLayout from "./clientLayout"

export const metadata: Metadata = {
  title: {
    default: "Vikum Karunathilake - Full-Stack Developer",
    template: "%s | Vikum Karunathilake",
  },
  description:
    "Full-stack web developer focused on creating scalable applications using AI tools. Student, Tech Explorer, and passionate about building modern web experiences.",
  keywords: [
    "Vikum Karunathilake",
    "Full-stack Developer",
    "AI Web Apps",
    "Next.js",
    "React",
    "TypeScript",
    "Portfolio",
    "Web Development",
    "Student Developer",
    "Tech Explorer",
    "Modern Web Apps",
    "Scalable Applications",
    "AI Integration",
    "Frontend Development",
    "Backend Development",
  ],
  authors: [{ name: "Vikum Karunathilake", url: "https://github.com/VikumKarunathilake" }],
  creator: "Vikum Karunathilake",
  publisher: "Vikum Karunathilake",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Vikum Karunathilake - Full-Stack Developer",
    description:
      "Building modern full-stack applications with the power of AI. Student, Tech Explorer, and passionate developer creating scalable web solutions.",
    siteName: "Vikum Karunathilake Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vikum Karunathilake - Full-Stack Developer",
    description: "Building modern full-stack applications with AI. Student & Tech Explorer.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/site.webmanifest",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1e1e2f" },
  ],
  colorScheme: "dark light",
  category: "technology",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1e1e2f" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientLayout>{children}</ClientLayout>
}
