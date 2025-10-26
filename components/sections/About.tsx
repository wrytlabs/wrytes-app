import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import { COMPANY } from '@/lib/constants';

const values = [
  {
    title: 'Profit-Driven Independence',
    description:
      'Operating exclusively with company assets, with profits directly funding advanced research and development initiatives.',
  },
  {
    title: 'Proprietary Excellence',
    description:
      'Developing cutting-edge Bitcoin option trading strategies that generate revenue to fuel continuous innovation and R&D expansion.',
  },
  {
    title: 'Swiss Precision',
    description:
      'Every strategy, every solution crafted with the meticulous attention to detail Switzerland is known for.',
  },
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-dark-surface">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">About {COMPANY.name}</h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            {COMPANY.description}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Company Operations */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="h-full mb-5">
              <h3 className="text-2xl font-bold mb-4 text-white">
                R&D and Software Development Focus
              </h3>
              <p className="text-text-secondary mb-4 leading-relaxed">
                Our daily operations center on cutting-edge research and software development in
                blockchain technologies. We build innovative solutions while our proprietary trading
                strategies provide the independence to pursue long-term research goals.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent-orange rounded-full" />
                  <span className="text-text-secondary">Blockchain protocol development</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent-orange rounded-full" />
                  <span className="text-text-secondary">Smart contract innovation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent-orange rounded-full" />
                  <span className="text-text-secondary">Decentralized application research</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent-orange rounded-full" />
                  <span className="text-text-secondary">
                    Funded by proprietary Bitcoin option trading
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Location Highlight */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card gradient className="h-full text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-accent-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-accent-orange rounded-full animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{COMPANY.location}</h3>
                <p className="text-text-secondary">Global Financial Technology Hub</p>
              </div>
              <p className="text-text-secondary leading-relaxed text-left">
                Located in Switzerland's dynamic tech ecosystem, leveraging progressive blockchain
                infrastructure and regulatory frameworks for advanced crypto business capabilities.
              </p>
            </Card>
          </motion.div>
        </div>

        {/* Name Origin Story */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card className="">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-4 text-center">
                The Meaning Behind <span className="text-accent-orange">Wrytes</span>
              </h3>
              <p className="text-text-secondary leading-relaxed mb-4">
                Our name combines <strong className="text-white">"write"</strong> and{' '}
                <strong className="text-white">"rights"</strong> - reflecting our vision to write
                code that empowers digital ownership, transparency, and user sovereignty through
                innovative blockchain technologies.
              </p>
              <p className="text-text-secondary leading-relaxed">
                From developing transparent blockchain applications to encoding immutable ownership
                rights, Wrytes represents the intersection of code craftsmanship and digital freedom
                - pushing the boundaries of what's possible for blockchain innovation.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-accent-orange rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Write</h4>
                  <p className="text-text-secondary text-sm">
                    Blockchain protocols, smart contracts, decentralized applications, and
                    privacy-preserving technologies
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-accent-orange rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Rights</h4>
                  <p className="text-text-secondary text-sm">
                    Digital sovereignty, transparent ownership, privacy protection, and user
                    empowerment
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card>
                <h4 className="text-xl font-bold mb-3 text-white">{value.title}</h4>
                <p className="text-text-secondary leading-relaxed">{value.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
