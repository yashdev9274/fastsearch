import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Icons } from '@/components/Icons'
import SearchBar from '@/components/SearchBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ANICHAR',
  description: 'Search your favourite Anime character!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <div className='relative min-h-screen isolate overflow-hidden border-b border-gray-200 bg-white text-slate-900'>
          <svg
            className='absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]'
            aria-hidden='true'>
            <defs>
              <pattern
                id='0787a7c5-978c-4f66-83c7-11c213f99cb7'
                width={200}
                height={200}
                x='50%'
                y={-1}
                patternUnits='userSpaceOnUse'>
                <path d='M.5 200V.5H200' fill='none' />
              </pattern>
            </defs>
            <rect
              width='100%'
              height='100%'
              strokeWidth={0}
              fill='url(#0787a7c5-978c-4f66-83c7-11c213f99cb7)'
            />
          </svg>

          <div className='mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex gap-16 lg:px-8 lg:py-24'>
            <div className='h-full w-full flex flex-col items-center gap-4'>
              <Icons.Sparkles className='h-16 w-16' />

              <h1 className='tracking-tight text-4xl sm:text-6xl font-bold'>
                Search your Anime Character
              </h1>

              <p className='max-w-xl text-center text-lg text-slate-700'>
                A search engine to search your favourite Anime Character.
                <br />What is your favourite ANIME 😏?
              </p>

              <div className='mx-auto mt-16 w-full max-w-2xl flex flex-col'>
                <SearchBar />

                {children}
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
