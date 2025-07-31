import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Services from '@/components/sections/Services';
import Contact from '@/components/sections/Contact';
import { COMPANY } from '@/lib/constants';

export default function Home() {
  return (
    <>
      <Head>
        <title>{COMPANY.name} - Swiss Bitcoin, Blockchain & AI Innovation</title>
        <meta name="description" content={COMPANY.description} />
        <meta name="keywords" content="Bitcoin, Blockchain, AI, Machine Learning, Software Development, Switzerland, Zug, FinTech" />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${COMPANY.name} - Swiss Bitcoin, Blockchain & AI Innovation`} />
        <meta property="og:description" content={COMPANY.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://wrytes.io" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${COMPANY.name} - Swiss Bitcoin, Blockchain & AI Innovation`} />
        <meta name="twitter:description" content={COMPANY.description} />
        
        {/* Additional SEO */}
        <meta name="author" content={COMPANY.name} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://wrytes.io" />
      </Head>
      
      <Layout>
        <Hero />
        <About />
        <Services />
        <Contact />
      </Layout>
    </>
  );
}