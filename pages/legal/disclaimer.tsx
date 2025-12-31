import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import Card from '@/components/ui/Card';
import { COMPANY } from '@/lib/constants';

export default function RiskDisclaimer() {
  return (
    <>
      <Head>
        <title>Risk Disclaimer - {COMPANY.name}</title>
        <meta
          name="description"
          content="Important risk disclosures for Distributed Ledger Technology and software platform activities."
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
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faExclamationTriangle} className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Risk Disclaimer</h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              Important risk disclosures for Distributed Ledger Technology and software platform
              activities.
            </p>
          </motion.div>

          {/* Risk Disclaimer Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <Card>
              <div className="space-y-8">
                {/* General Warning */}
                <section>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6 mb-6">
                    <h2 className="text-2xl font-bold text-yellow-500 mb-4 flex items-center gap-3">
                      <FontAwesomeIcon icon={faExclamationTriangle} className="w-6 h-6" />
                      Important Risk Warning
                    </h2>
                    <p className="text-text-secondary">
                      Distributed Ledger Technology and software platform activities involve substantial risk of loss. You
                      should carefully consider whether participating in Distributed Ledger Technology protocols
                      is suitable for you in light of your financial circumstances and risk
                      tolerance.{' '}
                      <strong className="text-white">
                        You may lose some or all of your invested capital.
                      </strong>
                    </p>
                  </div>
                </section>

                {/* Market Risks */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Market and Volatility Risks
                  </h2>
                  <div className="text-text-secondary space-y-3">
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        <strong className="text-white">Extreme Volatility:</strong> Digital asset
                        prices can fluctuate dramatically within short periods
                      </li>
                      <li>
                        <strong className="text-white">Market Manipulation:</strong> Digital asset markets
                        may be subject to manipulation and artificial price movements
                      </li>
                      <li>
                        <strong className="text-white">Liquidity Risks:</strong> You may not be able
                        to exit positions quickly or at desired prices
                      </li>
                      <li>
                        <strong className="text-white">Market Crashes:</strong> Digital asset
                        markets can experience severe and prolonged downturns
                      </li>
                      <li>
                        <strong className="text-white">Correlation Risks:</strong> Different
                        digital assets may move together during market stress
                      </li>
                    </ul>
                  </div>
                </section>

                {/* Technology Risks */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Technology and Smart Contract Risks
                  </h2>
                  <div className="text-text-secondary space-y-3">
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        <strong className="text-white">Smart Contract Vulnerabilities:</strong> Code
                        bugs or exploits could result in loss of funds
                      </li>
                      <li>
                        <strong className="text-white">Protocol Failures:</strong> Distributed Ledger Technology protocols
                        may fail, be hacked, or operate incorrectly
                      </li>
                      <li>
                        <strong className="text-white">Blockchain Network Issues:</strong> Network
                        congestion, forks, or failures can affect transactions
                      </li>
                      <li>
                        <strong className="text-white">Irreversible Transactions:</strong>{' '}
                        Blockchain transactions cannot be reversed once confirmed
                      </li>
                      <li>
                        <strong className="text-white">Key Management:</strong> Loss of private keys
                        results in permanent loss of access to funds
                      </li>
                      <li>
                        <strong className="text-white">Software Bugs:</strong> Platform or wallet
                        software may contain critical vulnerabilities
                      </li>
                    </ul>
                  </div>
                </section>

                {/* Regulatory Risks */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Regulatory and Legal Risks</h2>
                  <div className="text-text-secondary space-y-3">
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        <strong className="text-white">Regulatory Changes:</strong> New laws or
                        regulations could restrict or prohibit crypto activities
                      </li>
                      <li>
                        <strong className="text-white">Tax Implications:</strong> Crypto
                        transactions may have complex and changing tax consequences
                      </li>
                      <li>
                        <strong className="text-white">Legal Uncertainty:</strong> The legal status
                        of cryptocurrencies varies by jurisdiction
                      </li>
                      <li>
                        <strong className="text-white">Compliance Requirements:</strong> You may be
                        subject to reporting or compliance obligations
                      </li>
                      <li>
                        <strong className="text-white">Enforcement Actions:</strong> Regulators may
                        take action against crypto platforms or users
                      </li>
                    </ul>
                  </div>
                </section>

                {/* Operational Risks */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Operational and Platform Risks
                  </h2>
                  <div className="text-text-secondary space-y-3">
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        <strong className="text-white">Platform Downtime:</strong> Our platform may
                        be temporarily unavailable
                      </li>
                      <li>
                        <strong className="text-white">Data Loss:</strong> Technical failures could
                        result in loss of transaction data
                      </li>
                      <li>
                        <strong className="text-white">Cybersecurity Threats:</strong> Hacking
                        attempts and security breaches are ongoing risks
                      </li>
                      <li>
                        <strong className="text-white">Third-Party Dependencies:</strong> We rely on
                        external services that may fail or change
                      </li>
                      <li>
                        <strong className="text-white">Network Congestion:</strong> High blockchain
                        usage can cause delays and high fees
                      </li>
                    </ul>
                  </div>
                </section>

                {/* Financial Risks */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Financial and Investment Risks
                  </h2>
                  <div className="text-text-secondary space-y-3">
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        <strong className="text-white">Total Loss:</strong> You may lose your entire
                        investment
                      </li>
                      <li>
                        <strong className="text-white">Impermanent Loss:</strong> Liquidity
                        provision can result in losses vs. holding assets
                      </li>
                      <li>
                        <strong className="text-white">Yield Variability:</strong> Returns from DeFi
                        protocols can fluctuate significantly
                      </li>
                      <li>
                        <strong className="text-white">Slippage:</strong> Large transactions may not
                        execute at expected prices
                      </li>
                      <li>
                        <strong className="text-white">Gas Fees:</strong> Transaction costs can be
                        high and unpredictable
                      </li>
                      <li>
                        <strong className="text-white">Opportunity Cost:</strong> Funds locked in
                        protocols cannot be used elsewhere
                      </li>
                    </ul>
                  </div>
                </section>

                {/* Protocol Disclaimer */}
                <section>
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-6 mb-6">
                    <h2 className="text-2xl font-bold text-orange-500 mb-4">Protocol Disclaimer</h2>
                    <p className="text-text-secondary text-lg font-medium">
                      <strong className="text-white">
                        Wrytes.io focuses on providing software development tools and accurate data for Distributed Ledger Technology protocols. We do not audit or endorse protocols - users must conduct their own due diligence.
                      </strong>
                    </p>
                  </div>
                </section>

                {/* No Financial Advice */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">No Financial Advice</h2>
                  <div className="text-text-secondary space-y-3">
                    <p className="font-semibold text-white">
                      {COMPANY.name} does not provide financial, investment, or trading advice.
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>All information is for educational and informational purposes only</li>
                      <li>We do not recommend any specific investments or trading strategies</li>
                      <li>Past performance does not guarantee future results</li>
                      <li>
                        You should consult with qualified financial advisors before making
                        investment decisions
                      </li>
                      <li>
                        We are not responsible for your investment decisions or their outcomes
                      </li>
                    </ul>
                  </div>
                </section>

                {/* User Responsibilities */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Your Responsibilities</h2>
                  <div className="text-text-secondary space-y-3">
                    <p>Before using our platform or engaging in any Distributed Ledger Technology activities, you must:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        Understand the risks involved and accept full responsibility for your
                        decisions
                      </li>
                      <li>Only invest what you can afford to lose completely</li>
                      <li>Conduct your own research and due diligence</li>
                      <li>Ensure compliance with all applicable laws in your jurisdiction</li>
                      <li>Maintain proper security practices for your wallets and accounts</li>
                      <li>Stay informed about regulatory developments in your area</li>
                      <li>Consider seeking professional financial and legal advice</li>
                    </ul>
                  </div>
                </section>

                {/* No Guarantees */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    No Guarantees or Warranties
                  </h2>
                  <div className="text-text-secondary space-y-3">
                    <p>{COMPANY.name} makes no guarantees or warranties regarding:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        The performance, profitability, or success of any investment or strategy
                      </li>
                      <li>The availability, functionality, or reliability of our platform</li>
                      <li>The accuracy, completeness, or timeliness of any information provided</li>
                      <li>The security or protection of your funds or data</li>
                      <li>Compliance with future regulatory requirements</li>
                      <li>The continued operation of third-party protocols or services</li>
                    </ul>
                  </div>
                </section>

                {/* Jurisdiction-Specific Risks */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Jurisdiction-Specific Considerations
                  </h2>
                  <div className="text-text-secondary space-y-3">
                    <p>
                      Digital asset regulations vary significantly by jurisdiction. You are
                      responsible for understanding and complying with all applicable laws in your
                      location, including:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Digital asset interaction and ownership restrictions</li>
                      <li>Tax reporting and payment obligations</li>
                      <li>Anti-money laundering (AML) requirements</li>
                      <li>Know Your Customer (KYC) compliance</li>
                      <li>Securities laws and investment regulations</li>
                      <li>Consumer protection requirements</li>
                    </ul>
                  </div>
                </section>

                {/* Acceptance */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Acceptance of Risk</h2>
                  <div className="text-text-secondary space-y-3">
                    <p className="font-semibold text-white">
                      By using our platform, you acknowledge that you have read, understood, and
                      accepted all the risks outlined in this disclaimer.
                    </p>
                    <p>
                      You confirm that you are using our services at your own risk and that you will
                      not hold {COMPANY.name}, its officers, directors, employees, or affiliates
                      liable for any losses you may incur.
                    </p>
                  </div>
                </section>

                {/* Contact Information */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Questions or Concerns</h2>
                  <div className="text-text-secondary space-y-3">
                    <p>If you have questions about these risk disclosures, please contact us:</p>
                    <div className="bg-dark-surface p-4 rounded-lg">
                      <p>
                        <strong className="text-white">Email:</strong> hello@wrytes.io
                      </p>
                      <p>
                        <strong className="text-white">Subject:</strong> Risk Disclaimer Inquiry
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
