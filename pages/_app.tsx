import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import { WagmiProvider } from 'wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import '../styles/globals.css'
import Layout from '@/components/layout/Layout'
import { AuthProvider } from '@/contexts/AuthContext'
import { config, queryClient } from '@/lib/web3/config'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${inter.variable} font-sans`}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
            <Toaster position="bottom-right" />
          </AuthProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  );
}