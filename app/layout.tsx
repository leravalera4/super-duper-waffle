import type { Metadata } from 'next'
import { Orbitron } from 'next/font/google'
import './globals.css'
import { WalletContextProvider } from "@/components/wallet-provider"

const orbitron = Orbitron({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'RPS Magic Block - Rock Paper Scissors on Solana',
  description: 'Play Rock Paper Scissors on the Solana blockchain. Stake SOL, challenge players, and climb the leaderboard in this exciting Web3 game.',
  icons: {
    icon: [
      {
        url: '/icons/logo.svg',
        type: 'image/svg+xml',
      }
    ],
    apple: [
      {
        url: '/icons/logo.svg',
        type: 'image/svg+xml',
      }
    ],
  },
  manifest: '/manifest.json',
  viewport: 'width=device-width, initial-scale=1.0',
  themeColor: '#000000',
  openGraph: {
    title: 'RPS Magic Block - Rock Paper Scissors on Solana',
    description: 'Play Rock Paper Scissors on the Solana blockchain. Stake SOL, challenge players, and climb the leaderboard in this exciting Web3 game.',
    images: [{ url: '/icons/logo.svg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RPS Magic Block - Rock Paper Scissors on Solana',
    description: 'Play Rock Paper Scissors on the Solana blockchain. Stake SOL, challenge players, and climb the leaderboard in this exciting Web3 game.',
    images: ['/icons/logo.svg'],
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={orbitron.className}>
      <body>
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </body>
    </html>
  )
}
