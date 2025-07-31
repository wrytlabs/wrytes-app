import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import { COMPANY } from '@/lib/constants';

const values = [
  {
    title: 'Swiss Precision',
    description: 'Every line of code, every solution crafted with the meticulous attention to detail Switzerland is known for.',
  },
  {
    title: 'Innovation First',
    description: 'Pioneering technologies in Bitcoin, Blockchain, and AI to shape the future of finance and technology.',
  },
  {
    title: 'Global Impact',
    description: 'Building tools and solutions that create value worldwide, backed by Swiss reliability and expertise.',
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
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            About {COMPANY.name}
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            {COMPANY.description}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="h-full">
              <h3 className="text-2xl font-bold mb-4 text-white">
                Innovation from the Heart of Europe
              </h3>
              <p className="text-text-secondary mb-6 leading-relaxed">
                Based in {COMPANY.location}, we combine Swiss engineering excellence with 
                cutting-edge technology expertise. Our focus spans software development, 
                research & development, Bitcoin/Blockchain solutions, and AI applications.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent-orange rounded-full" />
                  <span className="text-text-secondary">Software Development across sectors</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent-gold rounded-full" />
                  <span className="text-text-secondary">Bitcoin & Blockchain expertise</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent-orange rounded-full" />
                  <span className="text-text-secondary">AI & Machine Learning solutions</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent-gold rounded-full" />
                  <span className="text-text-secondary">Option trading on Bitcoin for cashflow</span>
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
                <h3 className="text-2xl font-bold text-white mb-2">
                  {COMPANY.location}
                </h3>
                <p className="text-text-secondary">
                  Global Financial Technology Hub
                </p>
              </div>
              <p className="text-text-secondary leading-relaxed">
                Strategically located in Switzerland&apos;s most dynamic tech ecosystem, 
                we leverage the country&apos;s reputation for excellence, stability, and 
                innovation in financial technology.
              </p>
            </Card>
          </motion.div>
        </div>

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
                <h4 className="text-xl font-bold mb-3 text-white">
                  {value.title}
                </h4>
                <p className="text-text-secondary leading-relaxed">
                  {value.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}