import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://evalua.clusterstartuppuebla.com'),
  title: 'Batería de Evaluación | Clúster de Startups de Puebla',
  description: 'Evaluación de nivel de madurez digital para empresas. Diagnóstico personalizado con recomendaciones impulsado por el Clúster de Startups de Puebla.',
  authors: [{ name: 'Clúster de Startups de Puebla' }],
  creator: 'Clúster de Startups de Puebla',
  publisher: 'Clúster de Startups de Puebla',
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    title: 'Batería de Evaluación | Clúster de Startups de Puebla',
    description: 'Evaluación de nivel de madurez digital para empresas. Diagnóstico personalizado con recomendaciones impulsado por el Clúster de Startups de Puebla.',
    siteName: 'Clúster de Startups de Puebla',
    images: [
      {
        url: '/og-img.jpg',
        width: 1200,
        height: 630,
        alt: 'Del Piso de Producción al Dato — Clúster de Startups de Puebla',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Batería de Evaluación | Clúster de Startups de Puebla',
    description: 'Evaluación de nivel de madurez digital para empresas. Diagnóstico personalizado con recomendaciones impulsado por el Clúster de Startups de Puebla.',
    images: ['/og-img.jpg'],
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="bg-background">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
