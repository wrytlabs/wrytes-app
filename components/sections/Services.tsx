import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCode, 
  faLightbulb, 
  faBrain 
} from '@fortawesome/free-solid-svg-icons';
import { faBitcoin } from '@fortawesome/free-brands-svg-icons';
import Card from '@/components/ui/Card';
import { SERVICES } from '@/lib/constants';

const iconMap = {
  'software-development': faCode,
  'innovation-rd': faLightbulb,
  'bitcoin-blockchain': faBitcoin,
  'ai-ml': faBrain,
};

export default function Services() {
  return (
    <section id="services" className="py-24 bg-dark-bg">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Our Services
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Comprehensive solutions spanning software development, emerging technologies, 
            and financial innovation.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full text-center group">
                {/* Icon */}
                <div className="mb-6">
                  <div className="w-16 h-16 bg-accent-orange/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-accent-orange/30 transition-colors">
                    <FontAwesomeIcon 
                      icon={iconMap[service.id as keyof typeof iconMap]} 
                      className="w-8 h-8 text-accent-orange" 
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {service.title}
                  </h3>
                  <p className="text-text-secondary mb-6">
                    {service.description}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3 text-left">
                      <div className="w-1.5 h-1.5 bg-accent-orange rounded-full mt-2 flex-shrink-0" />
                      <span className="text-text-secondary text-sm leading-relaxed">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Card className="max-w-4xl mx-auto" gradient>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-orange mb-2">10+</div>
                <div className="text-text-secondary">Years Combined Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-orange mb-2">50+</div>
                <div className="text-text-secondary">Projects Delivered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-orange mb-2">24/7</div>
                <div className="text-text-secondary">Swiss Precision</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}