import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Card from '@/components/ui/Card';
import { COMPANY } from '@/lib/constants';

export default function TermsOfService() {
  return (
    <>
      <Head>
        <title>Terms of Service - {COMPANY.name}</title>
        <meta name="description" content="Terms of Service for Wrytes AG platform and services." />
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Terms of Service</h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              Terms and conditions for using the Wrytes AG platform and services.
            </p>
          </motion.div>

          {/* Terms Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <Card>
              <div className="space-y-8">
                {/* Agreement */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Agreement to Terms</h2>
                  <div className="text-text-secondary space-y-3">
                    <p>
                      By accessing and using the {COMPANY.name} platform and services, you agree to
                      be bound by these Terms of Service and all applicable laws and regulations. If
                      you do not agree with any of these terms, you are prohibited from using this
                      platform.
                    </p>
                    <p>
                      These terms constitute a legally binding agreement between you and{' '}
                      {COMPANY.name}.
                    </p>
                  </div>
                </section>

                {/* Service Description */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Service Description</h2>
                  <div className="text-text-secondary space-y-3">
                    <p>
                      Wrytes AG provides a DeFi management platform that allows users to interact
                      with various decentralized finance protocols. Our services include:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Multi-protocol vault management and yield optimization</li>
                      <li>Transaction queue management and batch operations</li>
                      <li>Portfolio analytics and performance tracking</li>
                      <li>Blockchain technology research and development tools</li>
                      <li>Technical consulting and development services</li>
                    </ul>
                  </div>
                </section>

                {/* Eligibility */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Eligibility</h2>
                  <div className="text-text-secondary space-y-3">
                    <p>To use our platform, you must:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Be at least 18 years of age</li>
                      <li>Have the legal capacity to enter into binding agreements</li>
                      <li>Not be prohibited from using our services under applicable laws</li>
                      <li>
                        Comply with all local laws and regulations regarding cryptocurrency and DeFi
                      </li>
                      <li>Provide accurate and complete information when required</li>
                    </ul>
                  </div>
                </section>

                {/* Account Responsibilities */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Account and Wallet Responsibilities
                  </h2>
                  <div className="text-text-secondary space-y-3">
                    <p>When using our platform, you are responsible for:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        Maintaining the security of your cryptocurrency wallets and private keys
                      </li>
                      <li>Ensuring the accuracy of all transaction data and addresses</li>
                      <li>Understanding the risks associated with blockchain transactions</li>
                      <li>Complying with all applicable laws in your jurisdiction</li>
                      <li>Not using the platform for any illegal or unauthorized purposes</li>
                      <li>Safeguarding your authentication credentials and access methods</li>
                    </ul>
                    <p className="mt-4 font-semibold text-white">
                      We do not store private keys or have access to your funds. You are solely
                      responsible for the security of your cryptocurrency assets.
                    </p>
                  </div>
                </section>

                {/* Acceptable Use */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Acceptable Use Policy</h2>
                  <div className="text-text-secondary space-y-3">
                    <p>You agree not to use our platform to:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Engage in any illegal activities or violate any applicable laws</li>
                      <li>
                        Attempt to gain unauthorized access to our systems or other users&apos
                        accounts
                      </li>
                      <li>Interfere with or disrupt the operation of our platform</li>
                      <li>
                        Use our services for money laundering, terrorism financing, or other illicit
                        activities
                      </li>
                      <li>Manipulate markets or engage in fraudulent trading activities</li>
                      <li>Violate any intellectual property rights</li>
                      <li>Transmit malicious code, viruses, or other harmful content</li>
                      <li>Impersonate other individuals or entities</li>
                    </ul>
                  </div>
                </section>

                {/* Platform Availability */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Platform Availability</h2>
                  <div className="text-text-secondary space-y-3">
                    <p>
                      We strive to maintain high availability of our platform, but we cannot
                      guarantee uninterrupted service. Our platform may be temporarily unavailable
                      due to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Scheduled maintenance and updates</li>
                      <li>Unexpected technical issues or outages</li>
                      <li>Network congestion or blockchain-related delays</li>
                      <li>Security incidents or necessary protective measures</li>
                      <li>Force majeure events beyond our control</li>
                    </ul>
                    <p className="mt-4">
                      We will make reasonable efforts to notify users of planned downtime and
                      restore services as quickly as possible.
                    </p>
                  </div>
                </section>

                {/* Financial Disclaimers */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Financial Disclaimers</h2>
                  <div className="text-text-secondary space-y-3">
                    <p className="font-semibold text-white">Important Financial Disclaimers:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>We do not provide financial, investment, or trading advice</li>
                      <li>All information is for educational and informational purposes only</li>
                      <li>Past performance does not guarantee future results</li>
                      <li>
                        Cryptocurrency and DeFi activities involve significant financial risks
                      </li>
                      <li>You may lose some or all of your invested capital</li>
                      <li>We are not responsible for investment decisions or outcomes</li>
                      <li>
                        Always consult with qualified financial professionals before making
                        investment decisions
                      </li>
                    </ul>
                  </div>
                </section>

                {/* Limitation of Liability */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
                  <div className="text-text-secondary space-y-3">
                    <p>
                      To the maximum extent permitted by applicable law, {COMPANY.name} shall not be
                      liable for:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Any direct, indirect, incidental, special, or consequential damages</li>
                      <li>Loss of profits, data, or other intangible losses</li>
                      <li>Damages resulting from blockchain network issues or delays</li>
                      <li>Smart contract vulnerabilities or protocol failures</li>
                      <li>Third-party service failures or security breaches</li>
                      <li>Market volatility or investment losses</li>
                      <li>Unauthorized access to your wallet or accounts</li>
                    </ul>
                    <p className="mt-4 font-semibold text-white">
                      Our total liability to you for any claims shall not exceed the amount you paid
                      to us for services in the 12 months preceding the claim.
                    </p>
                  </div>
                </section>

                {/* Indemnification */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Indemnification</h2>
                  <div className="text-text-secondary space-y-3">
                    <p>
                      You agree to indemnify and hold harmless {COMPANY.name}, its officers,
                      directors, employees, and agents from any claims, damages, losses, or expenses
                      arising from:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Your use of our platform or services</li>
                      <li>Your violation of these terms of service</li>
                      <li>Your violation of applicable laws or regulations</li>
                      <li>Your infringement of third-party rights</li>
                      <li>Your negligent or wrongful conduct</li>
                    </ul>
                  </div>
                </section>

                {/* Intellectual Property */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Intellectual Property</h2>
                  <div className="text-text-secondary space-y-3">
                    <p>
                      All content, features, and functionality of our platform, including but not
                      limited to text, graphics, logos, software, and design, are owned by{' '}
                      {COMPANY.name} or its licensors and are protected by intellectual property
                      laws.
                    </p>
                    <p>
                      You are granted a limited, non-exclusive, non-transferable license to use our
                      platform for its intended purposes. You may not:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Copy, modify, or distribute our proprietary content</li>
                      <li>Reverse engineer or attempt to extract source code</li>
                      <li>Use our trademarks or branding without permission</li>
                      <li>Create derivative works based on our platform</li>
                    </ul>
                  </div>
                </section>

                {/* Termination */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Termination</h2>
                  <div className="text-text-secondary space-y-3">
                    <p>
                      We reserve the right to terminate or suspend your access to our platform
                      immediately, without prior notice, for any reason, including:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Violation of these terms of service</li>
                      <li>Suspected illegal or fraudulent activity</li>
                      <li>Security concerns or threats</li>
                      <li>Extended periods of inactivity</li>
                      <li>Technical or business reasons</li>
                    </ul>
                    <p className="mt-4">
                      Upon termination, your right to use our platform ceases immediately.
                      Provisions regarding liability, indemnification, and dispute resolution shall
                      survive termination.
                    </p>
                  </div>
                </section>

                {/* Governing Law */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Governing Law and Jurisdiction
                  </h2>
                  <div className="text-text-secondary space-y-3">
                    <p>
                      These terms of service are governed by and construed in accordance with the
                      laws of Switzerland. Any disputes arising from these terms or your use of our
                      platform shall be subject to the exclusive jurisdiction of the courts in Zug,
                      Switzerland.
                    </p>
                  </div>
                </section>

                {/* Changes to Terms */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Changes to Terms</h2>
                  <div className="text-text-secondary space-y-3">
                    <p>
                      We reserve the right to modify these terms of service at any time. Material
                      changes will be notified through our platform or via email. Your continued use
                      of our platform after changes become effective constitutes acceptance of the
                      updated terms.
                    </p>
                  </div>
                </section>

                {/* Contact Information */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
                  <div className="text-text-secondary space-y-3">
                    <p>If you have questions about these terms of service, please contact us:</p>
                    <div className="bg-dark-surface p-4 rounded-lg">
                      <p>
                        <strong className="text-white">Email:</strong> hello@wrytes.io
                      </p>
                      <p>
                        <strong className="text-white">Subject:</strong> Terms of Service Inquiry
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
