import ClientLayout from '~/components/ClientLayout'
import type { ReactNode } from 'react'

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html>
      <head></head>
      <body>
        <main>
          <ClientLayout>{children}</ClientLayout>
        </main>
      </body>
    </html>
  )
}

