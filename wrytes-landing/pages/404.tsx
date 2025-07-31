import Head from 'next/head'
import Link from 'next/link'

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Page Not Found | Wrytes AG</title>
      </Head>
      
      <div className="min-h-screen bg-dark-bg text-text-primary flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4 text-accent-orange">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-text-secondary mb-8">
            The page you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link 
            href="/"
            className="inline-block bg-accent-orange text-white px-6 py-3 rounded-xl hover:bg-opacity-90 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </>
  )
}