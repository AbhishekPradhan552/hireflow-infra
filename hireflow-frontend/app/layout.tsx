import "./globals.css" // MUST HAVE

import { Geist } from "next/font/google"
import { cn } from "@/lib/utils"
import ReactQueryProvider from "@/lib/query-client"
import { Toaster } from "@/components/ui/sonner"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>

      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>

      <body
        className={cn(
          "min-h-screen antialiased",
          //Global layered background
          "bg-gradient-to-b from-background via-muted/30 to-muted/60"
        )}
      >
        <ReactQueryProvider>

          {/* App Wrapper */}
          <div className="relative w-full overflow-x-hidden">

            {/* Subtle premium glow */}
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.04),transparent)]" />

            {/* App Content */}
            {children}

          </div>

          <Toaster richColors position="top-right" />

        </ReactQueryProvider>
      </body>
    </html>
  )
}