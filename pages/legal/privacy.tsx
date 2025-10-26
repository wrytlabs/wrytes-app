import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Card from '@/components/ui/Card';
import { COMPANY } from '@/lib/constants';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - {COMPANY.name}</title>
        <meta
          name="description"
          content="Privacy policy for Wrytes AG explaining how we collect, use, and protect your personal data."
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Privacy Policy</h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              How we collect, use, and protect your personal data in compliance with Swiss Data
              Protection Act and GDPR.
            </p>
          </motion.div>

          {/* Privacy Policy Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <Card>
              <div className="space-y-8">
                {/* Controller Information */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Data Controller</h2>
                  <div className="text-text-secondary space-y-3">
                    <p>The data controller responsible for processing your personal data is:</p>
                    <div className="bg-dark-surface p-4 rounded-lg">
                      <p>
                        <strong className="text-white">{COMPANY.name}</strong>
                      </p>
                      <p>{COMPANY.location}</p>
                      <p>Email: hello@wrytes.io</p>
                    </div>
                  </div>
                </section>

                {/* Data We Collect */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Data We Collect</h2>
                  <div className="text-text-secondary space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Automatically Collected Data
                      </h3>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>IP address and location data</li>
                        <li>Browser type and version</li>
                        <li>Operating system</li>
                        <li>Website usage patterns and analytics</li>
                        <li>Device information</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Wallet Connection Data
                      </h3>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Wallet addresses (public keys only)</li>
                        <li>Transaction signatures for authentication</li>
                        <li>Blockchain transaction history (public data)</li>
                        <li>Network preferences (Ethereum, Base, etc.)</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Communication Data</h3>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Email addresses when you contact us</li>
                        <li>Correspondence and support requests</li>
                        <li>Feedback and survey responses</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* How We Use Data */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Data</h2>
                  <div className="text-text-secondary space-y-3">
                    <p>We process your personal data for the following purposes:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        <strong className="text-white">Platform Operation:</strong> To provide and
                        maintain our DeFi management platform
                      </li>
                      <li>
                        <strong className="text-white">Authentication:</strong> To verify your
                        identity through wallet signatures
                      </li>
                      <li>
                        <strong className="text-white">Security:</strong> To protect against fraud,
                        abuse, and security threats
                      </li>
                      <li>
                        <strong className="text-white">Analytics:</strong> To understand usage
                        patterns and improve our services
                      </li>
                      <li>
                        <strong className="text-white">Communication:</strong> To respond to
                        inquiries and provide support
                      </li>
                      <li>
                        <strong className="text-white">Legal Compliance:</strong> To comply with
                        applicable laws and regulations
                      </li>
                    </ul>
                  </div>
                </section>

                {/* Legal Basis */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Legal Basis for Processing</h2>
                  <div className="text-text-secondary space-y-3">
                    <p>We process your personal data based on the following legal grounds:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        <strong className="text-white">Legitimate Interest:</strong> For platform
                        operation, security, and analytics
                      </li>
                      <li>
                        <strong className="text-white">Consent:</strong> For cookies and optional
                        data collection
                      </li>
                      <li>
                        <strong className="text-white">Legal Obligation:</strong> For compliance
                        with Swiss and EU regulations
                      </li>
                      <li>
                        <strong className="text-white">Contract Performance:</strong> To provide
                        requested services
                      </li>
                    </ul>
                  </div>
                </section>

                {/* Data Sharing */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Data Sharing and Third Parties
                  </h2>
                  <div className="text-text-secondary space-y-4">
                    <p>We may share your data with the following third parties:</p>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Service Providers</h3>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Hosting and infrastructure providers</li>
                        <li>Analytics services (Google Analytics, etc.)</li>
                        <li>Security and monitoring services</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Blockchain Networks</h3>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Transaction data is publicly visible on blockchain networks</li>
                        <li>Smart contract interactions are transparent and immutable</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Legal Requirements</h3>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Law enforcement when legally required</li>
                        <li>Regulatory authorities for compliance purposes</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Data Retention */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Data Retention</h2>
                  <div className="text-text-secondary space-y-3">
                    <p>We retain your personal data for the following periods:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        <strong className="text-white">Usage Data:</strong> 24 months for analytics
                        purposes
                      </li>
                      <li>
                        <strong className="text-white">Authentication Data:</strong> Until account
                        deletion or 7 years for compliance
                      </li>
                      <li>
                        <strong className="text-white">Communication Data:</strong> 3 years for
                        support and legal purposes
                      </li>
                      <li>
                        <strong className="text-white">Blockchain Data:</strong> Permanently stored
                        on public blockchains
                      </li>
                    </ul>
                  </div>
                </section>

                {/* Your Rights */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
                  <div className="text-text-secondary space-y-3">
                    <p>Under Swiss Data Protection Act and GDPR, you have the following rights:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        <strong className="text-white">Access:</strong> Request information about
                        your personal data
                      </li>
                      <li>
                        <strong className="text-white">Rectification:</strong> Correct inaccurate
                        personal data
                      </li>
                      <li>
                        <strong className="text-white">Erasure:</strong> Request deletion of your
                        personal data
                      </li>
                      <li>
                        <strong className="text-white">Portability:</strong> Receive your data in a
                        structured format
                      </li>
                      <li>
                        <strong className="text-white">Restriction:</strong> Limit processing of
                        your data
                      </li>
                      <li>
                        <strong className="text-white">Objection:</strong> Object to processing
                        based on legitimate interest
                      </li>
                      <li>
                        <strong className="text-white">Withdraw Consent:</strong> Revoke consent for
                        consent-based processing
                      </li>
                    </ul>
                    <p className="mt-4">
                      To exercise these rights, please contact us at hello@wrytes.io with your
                      request.
                    </p>
                  </div>
                </section>

                {/* Cookies */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Cookies and Tracking</h2>
                  <div className="text-text-secondary space-y-3">
                    <p>
                      We use cookies and similar technologies to improve your experience. You can
                      control cookie preferences through your browser settings. Essential cookies
                      are required for platform functionality.
                    </p>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Cookie Types</h3>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>
                          <strong className="text-white">Essential:</strong> Required for basic
                          platform functionality
                        </li>
                        <li>
                          <strong className="text-white">Analytics:</strong> Help us understand
                          usage patterns
                        </li>
                        <li>
                          <strong className="text-white">Preferences:</strong> Remember your
                          settings and choices
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Security */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
                  <div className="text-text-secondary space-y-3">
                    <p>
                      We implement appropriate technical and organizational measures to protect your
                      personal data against unauthorized access, alteration, disclosure, or
                      destruction. This includes:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Encryption of data in transit and at rest</li>
                      <li>Regular security assessments and updates</li>
                      <li>Access controls and authentication measures</li>
                      <li>Employee training on data protection</li>
                      <li>Incident response procedures</li>
                    </ul>
                  </div>
                </section>

                {/* International Transfers */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    International Data Transfers
                  </h2>
                  <div className="text-text-secondary space-y-3">
                    <p>
                      Some of our service providers may be located outside Switzerland and the EEA.
                      When transferring data internationally, we ensure adequate protection through:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>European Commission adequacy decisions</li>
                      <li>Standard contractual clauses</li>
                      <li>Other appropriate safeguards</li>
                    </ul>
                  </div>
                </section>

                {/* Contact and Complaints */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Contact and Complaints</h2>
                  <div className="text-text-secondary space-y-3">
                    <p>
                      For questions about this privacy policy or to exercise your rights, contact us
                      at:
                    </p>
                    <div className="bg-dark-surface p-4 rounded-lg">
                      <p>
                        <strong className="text-white">Email:</strong> hello@wrytes.io
                      </p>
                      <p>
                        <strong className="text-white">Subject:</strong> Privacy Inquiry
                      </p>
                    </div>
                    <p className="mt-4">
                      If you believe we have not adequately addressed your concerns, you have the
                      right to lodge a complaint with the Swiss Federal Data Protection and
                      Information Commissioner (FDPIC) or your local data protection authority.
                    </p>
                  </div>
                </section>

                {/* Changes */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Changes to This Policy</h2>
                  <div className="text-text-secondary space-y-3">
                    <p>
                      We may update this privacy policy from time to time. We will notify you of any
                      material changes by posting the new policy on this page and updating the
                      &quotLast updated&quot date below.
                    </p>
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
