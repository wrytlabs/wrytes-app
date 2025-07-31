import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import Card from '@/components/ui/Card';
import ContactForm from '@/components/ui/ContactForm';
import { COMPANY } from '@/lib/constants';

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-dark-surface">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Get in Touch
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Ready to start your next project? Let&apos;s discuss how we can bring your vision to life 
            with Swiss precision and cutting-edge technology.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">
                Let&apos;s Start a Conversation
              </h3>
              <p className="text-text-secondary leading-relaxed mb-8">
                Whether you need custom software development, blockchain solutions, 
                or AI integration, our team is ready to help you achieve your goals.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent-orange/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="w-5 h-5 text-accent-orange" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Location</h4>
                  <p className="text-text-secondary">
                    {COMPANY.location}
                  </p>
                  <p className="text-text-muted text-sm">
                    Heart of European FinTech
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent-orange/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5 text-accent-orange" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Email</h4>
                  <p className="text-text-secondary">
                    hello@wrytes.io
                  </p>
                  <p className="text-text-muted text-sm">
                    We respond within 24 hours
                  </p>
                </div>
              </div>

              {/* Response Time */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent-orange/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faPhone} className="w-5 h-5 text-accent-orange" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Response Time</h4>
                  <p className="text-text-secondary">
                    24 hours or less
                  </p>
                  <p className="text-text-muted text-sm">
                    Swiss punctuality guaranteed
                  </p>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <Card className="mt-8">
              <h4 className="text-white font-semibold mb-4">Business Hours</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Monday - Friday</span>
                  <span className="text-white">9:00 - 18:00 CET</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Saturday</span>
                  <span className="text-white">10:00 - 16:00 CET</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Sunday</span>
                  <span className="text-text-muted">Closed</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="h-full">
              <h3 className="text-2xl font-bold text-white mb-6">
                Send us a Message
              </h3>
              <ContactForm />
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}