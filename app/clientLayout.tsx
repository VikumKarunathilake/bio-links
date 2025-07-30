"use client"

import type React from "react"
import TrailingCursor from "@/components/use-canvasCursor"
import "./globals.css"

export default function ClientLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <meta name="msapplication-TileColor" content="#8b5cf6" />
                <meta name="msapplication-config" content="/browserconfig.xml" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
            </head>
            <body
                className="antialiased select-none"
                onContextMenu={(e: React.MouseEvent<HTMLBodyElement>) => e.preventDefault()}
                onDragStart={(e: React.DragEvent<HTMLBodyElement>) => e.preventDefault()}
                onMouseDown={(e: React.MouseEvent<HTMLBodyElement>) => e.preventDefault()} // Replaces onSelectStart
                style={{
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none",
                    WebkitTouchCallout: "none",
                    WebkitTapHighlightColor: "transparent",
                }}
            >
                {children}
                <TrailingCursor />

                {/* Disable right-click and other interactions */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
              document.addEventListener('contextmenu', e => e.preventDefault());
              document.addEventListener('selectstart', e => e.preventDefault());
              document.addEventListener('dragstart', e => e.preventDefault());
              document.addEventListener('keydown', e => {
                if (
                  e.keyCode === 123 || // F12
                  (e.ctrlKey && e.shiftKey && ['I','C','J'].includes(e.key.toUpperCase())) ||
                  (e.ctrlKey && e.key.toUpperCase() === 'U')
                ) e.preventDefault();
              });
              window.addEventListener('beforeprint', e => e.preventDefault());
              
              // Disable right-click context menu
              document.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
              });
              
              // Disable text selection
              document.addEventListener('selectstart', function(e) {
                e.preventDefault();
                return false;
              });
              
              // Disable drag
              document.addEventListener('dragstart', function(e) {
                e.preventDefault();
                return false;
              });
              
              // Disable F12, Ctrl+Shift+I, Ctrl+U, etc.
              document.addEventListener('keydown', function(e) {
                // F12
                if (e.keyCode === 123) {
                  e.preventDefault();
                  return false;
                }
                // Ctrl+Shift+I
                if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
                  e.preventDefault();
                  return false;
                }
                // Ctrl+U
                if (e.ctrlKey && e.keyCode === 85) {
                  e.preventDefault();
                  return false;
                }
                // Ctrl+Shift+C
                if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
                  e.preventDefault();
                  return false;
                }
                // Ctrl+Shift+J
                if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
                  e.preventDefault();
                  return false;
                }
              });
              
              // Disable print
              window.addEventListener('beforeprint', function(e) {
                e.preventDefault();
                return false;
              });
            
            `,
                    }}
                />
            </body>
        </html>
    )
}
