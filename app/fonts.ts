import { Inter, JetBrains_Mono, Fraunces } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin'],
  weight: 'variable',
  style: 'normal',
  display: 'swap',
  variable: '--font-sans',
})

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: 'variable',
  style: 'normal',
  display: 'swap',
  variable: '--font-mono',
})

export const fraunces = Fraunces({
  subsets: ['latin'],
  weight: 'variable',
  style: ['italic'],
  display: 'swap',
  variable: '--font-display',
})
