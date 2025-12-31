import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileContract,
  faShieldAlt,
  faExclamationTriangle,
  faGavel,
} from '@fortawesome/free-solid-svg-icons';
import Card from '@/components/ui/Card';
import { COMPANY } from '@/lib/constants';

const legalPages = [
  {
    title: 'Legal Notice',
    description: 'Company information and legal requirements as per Swiss law.',
    href: '/legal/notice',
    icon: faFileContract,
  },
  {
    title: 'Privacy Policy',
    description: 'How we collect, use, and protect your personal data.',
    href: '/legal/privacy',
    icon: faShieldAlt,
  },
  {
    title: 'Terms of Service',
    description: 'Terms and conditions for using our platform and services.',
    href: '/legal/terms',
    icon: faGavel,
  },
  {
    title: 'Risk Disclaimer',
    description: 'Important risk disclosures for Distributed Ledger Technology and software platform activities.',
    href: '/legal/disclaimer',
    icon: faExclamationTriangle,
  },
];

export default function LegalIndex() {
  return (
    <>
      <Head>
        <title>Legal Information - {COMPANY.name}</title>
        <meta
          name="description"
          content="Legal documents and compliance information for Wrytes AG."
        />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="mt-16 min-h-screen bg-dark-bg">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Legal Information</h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              Important legal documents and compliance information for {COMPANY.name} operations and
              services.
            </p>
          </motion.div>

          {/* Legal Documents Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {legalPages.map((page, index) => (
              <motion.div
                key={page.href}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Link href={page.href}>
                  <Card className="h-full hover:border-accent-orange/50 transition-colors cursor-pointer group">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-accent-orange/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-accent-orange/30 transition-colors">
                        <FontAwesomeIcon icon={page.icon} className="w-5 h-5 text-accent-orange" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent-orange transition-colors">
                          {page.title}
                        </h3>
                        <p className="text-text-secondary leading-relaxed">{page.description}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Company Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 text-center"
          >
            <Card className="max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-white mb-4">Contact Information</h3>
              <div className="space-y-2 text-text-secondary">
                <p>
                  <strong className="text-white">{COMPANY.name}</strong>
                </p>
                <p>{COMPANY.address}</p>
                <p>Email: hello@wrytes.io</p>
              </div>
              <p className="text-text-muted text-sm mt-4">
                For legal inquiries or compliance questions, please contact us directly.
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}
