import type { Metadata } from "next"
import { Geist } from "next/font/google"

import "./globals.css"
import { APP_LOCALE } from "@/lib/locale"
import { cn } from "@/lib/utils"
import { messages } from "@/messages"
import { Providers } from "@/providers"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: messages.products.title,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang={APP_LOCALE}
      className={cn("font-sans antialiased", geist.variable)}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
