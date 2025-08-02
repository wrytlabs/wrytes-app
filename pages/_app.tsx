import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import '../styles/globals.css'
import Layout from '@/components/layout/Layout'
import { AuthProvider } from '@/contexts/AuthContext'
import { TransactionQueueProvider } from '@/contexts/TransactionQueueContext'
import { ApolloProvider } from '@/lib/graphql/provider'
import AppKitProvider from '@/lib/web3/appkit-provider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${inter.variable} font-sans`}>
      <AppKitProvider>
        <ApolloProvider>
          <AuthProvider>
            <TransactionQueueProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
              <Toaster position="bottom-right" />
            </TransactionQueueProvider>
          </AuthProvider>
        </ApolloProvider>
      </AppKitProvider>
    </div>
  );
}