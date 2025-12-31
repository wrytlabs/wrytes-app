import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Card from '@/components/ui/Card';
import { COMPANY } from '@/lib/constants';

export default function LegalNotice() {
  return (
    <>
      <Head>
        <title>Legal Notice - {COMPANY.name}</title>
        <meta
          name="description"
          content="Legal notice and company information for Wrytes AG as required by Swiss law."
        />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="mt-16 min-h-screen bg-dark-bg">
        <div className="container mx-auto px-4 py-16">
          {/* Back Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Link
              href="/legal"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-orange transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
              Back to Legal Documents
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Legal Notice</h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              Company information and legal requirements as per Swiss Federal Act on Unfair
              Competition (UCA).
            </p>
          </motion.div>

          {/* Legal Notice Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <Card>
              <div className="space-y-8">
                {/* Company Information */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Company Information</h2>
                  <div className="space-y-3 text-text-secondary">
                    <div>
                      <strong className="text-white">Company Name:</strong> {COMPANY.name}
                    </div>
                    <div>
                      <strong className="text-white">Company ID:</strong>{' '}
                      <a
                        href={COMPANY.registry}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-orange hover:text-accent-orange/80 transition-colors underline"
                      >
                        {COMPANY.uid}
                      </a>
                    </div>
                    <div>
                      <strong className="text-white">Legal Form:</strong> Aktiengesellschaft (AG)
                    </div>
                    <div>
                      <strong className="text-white">Registered Address:</strong> {COMPANY.address}
                    </div>
                    <div>
                      <strong className="text-white">Email:</strong> hello@wrytes.io
                    </div>
                    <div>
                      <strong className="text-white">Website:</strong> wrytes.io
                    </div>
                  </div>
                </section>

                {/* Business Activities */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Business Activities</h2>
                  <div className="text-text-secondary space-y-3">
                    <p>
                      Wrytes AG is a Swiss research and development company specializing in
                      blockchain technology and software development. Our core business activities
                      include:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Proprietary cryptocurrency trading strategies and operations</li>
                      <li>Blockchain technology research and development</li>
                      <li>Software development services for clients and partners</li>
                      <li>Platform development and innovation</li>
                      <li>Strategic partnerships and technology consulting</li>
                    </ul>
                  </div>
                </section>

                {/* Regulatory Information */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Regulatory Information</h2>
                  <div className="text-text-secondary space-y-3">
                    <p>
                      Wrytes AG operates in compliance with Swiss law and regulations. Our business
                      activities are conducted in accordance with:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Swiss Federal Act on Unfair Competition (UCA)</li>
                      <li>Swiss Data Protection Act (DPA)</li>
                      <li>Swiss Anti-Money Laundering Act (AMLA)</li>
                      <li>Swiss Distributed Ledger Technology (DLT) Act</li>
                      <li>Applicable FINMA guidelines and regulations</li>
                    </ul>
                  </div>
                </section>

                {/* Limitation of Liability */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
                  <div className="text-text-secondary space-y-3">
                    <p>
                      The information provided on this website is for general informational purposes
                      only. While we strive to keep the information accurate and up-to-date, we make
                      no representations or warranties of any kind about the completeness, accuracy,
                      reliability, or availability of the information.
                    </p>
                    <p>
                      Wrytes AG shall not be liable for any direct, indirect, incidental, special,
                      or consequential damages arising from the use of this website or the
                      information contained herein.
                    </p>
                  </div>
                </section>

                {/* Intellectual Property */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Intellectual Property</h2>
                  <div className="text-text-secondary space-y-3">
                    <p>
                      All content on this website, including but not limited to text, graphics,
                      logos, images, and software, is the property of Wrytes AG or its licensors and
                      is protected by Swiss and international copyright and trademark laws.
                    </p>
                  </div>
                </section>

                {/* Contact for Legal Matters */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Legal Inquiries</h2>
                  <div className="text-text-secondary space-y-3">
                    <p>
                      For legal inquiries, compliance questions, or other formal communications,
                      please contact us at:
                    </p>
                    <div className="bg-dark-surface p-4 rounded-lg">
                      <p>
                        <strong className="text-white">Email:</strong> hello@wrytes.io
                      </p>
                      <p>
                        <strong className="text-white">Subject:</strong> Legal Inquiry
                      </p>
                    </div>
                  </div>
                </section>

                {/* Last Updated */}
                <section className="pt-6 border-t border-dark-surface">
                  <p className="text-text-muted text-sm">Last updated: October 26, 2025</p>
                </section>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}
