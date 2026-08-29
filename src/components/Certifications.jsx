import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Certifications.css';

const certifications = [
  { title: 'Python Programming', file: '/certifications/Python Programming.pdf', color: 'electric-blue' },
  { title: 'Problem Solving', file: '/certifications/Problem Solving.pdf', color: 'neon-green' },
  { title: 'OOSD Using UML', file: '/certifications/Object Oriented System Development Using UML, Java And Patterns.pdf', color: 'vivid-orange' },
  { title: 'IBM CC0101EN', file: '/certifications/IBM CC0101EN Certificate _ Cognitive Class.pdf', color: 'hot-pink' },
  { title: 'IBM DB0101EN', file: '/certifications/IBM DB0101EN Certificate _ Cognitive Class.pdf', color: 'electric-blue' },
  { title: 'IBM SE0101EN', file: '/certifications/IBM SE0101EN Certificate _ Cognitive Class.pdf', color: 'neon-green' },
  { title: 'Python Basics', file: '/certifications/Python Basics (Infosys Springboard).pdf', color: 'bright-yellow' },
  { title: 'Python Basic', file: '/certifications/python_basic certificate.pdf', color: 'hot-pink' }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } }
};

const Certifications = () => {
  const [selectedCert, setSelectedCert] = useState(null);

  return (
    <section className="section certifications-section" id="certifications">
      <div className="cert-container">
        <motion.h2 
          className="section-title text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          My <span className="text-neon-green">Certifications</span>
        </motion.h2>
        
        <motion.div 
          className="cert-masonry"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {certifications.map((cert, index) => (
            <motion.div 
              key={index} 
              className="cert-masonry-item" 
              variants={cardVariants}
              onClick={() => setSelectedCert(cert)}
            >
              <div className="cert-glow" style={{ background: 'var(--' + cert.color + ')' }}></div>
              <div className="cert-iframe-container" style={{ borderColor: 'var(--' + cert.color + ')' }}>
                {/* Embed PDF without toolbars */}
                <img src={cert.file.replace(".pdf", ".png")} alt={cert.title} className="cert-iframe" style={{ objectFit: "contain" }} />
                <div className="cert-overlay">
                  <span className="cert-overlay-text">View Full</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Modal for full view */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div 
            className="cert-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCert(null)}
          >
            <motion.div 
              className="cert-modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="cert-modal-close" onClick={() => setSelectedCert(null)}>✕</button>
              <img src={selectedCert.file.replace(".pdf", ".png")} alt={selectedCert.title} className="cert-modal-iframe" style={{ objectFit: "contain" }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Certifications;



