import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Certifications.css';

const CERTS = [
  {
    id: 'google-solution',
    title: 'Google Solution Challenge',
    issuer: 'Google',
    file: '/certifications/Google Solution Challenge.jpg',
    color: '#f59e0b',
    year: '2026',
    category: 'Innovation & Cloud',
    description: 'Developed scalable solution addressing UN Sustainable Development Goals.'
  },
  {
    id: 'ibm-cloud',
    title: 'Introduction to Cloud',
    issuer: 'IBM',
    file: '/certifications/IBM CC0101EN Certificate _ Cognitive Class.png',
    color: '#0f62fe',
    year: '2024',
    category: 'Cloud Computing',
    description: 'Foundations of cloud architecture, deployment models, and services.'
  },
  {
    id: 'ibm-db',
    title: 'SQL & Relational Databases',
    issuer: 'IBM',
    file: '/certifications/IBM DB0101EN Certificate _ Cognitive Class.png',
    color: '#3b82f6',
    year: '2024',
    category: 'Databases',
    description: 'Relational data modeling, complex SQL queries, and normalization.'
  },
  {
    id: 'ibm-se',
    title: 'Software Engineering Essentials',
    issuer: 'IBM',
    file: '/certifications/IBM SE0101EN Certificate _ Cognitive Class.png',
    color: '#a855f7',
    year: '2024',
    category: 'Engineering',
    description: 'Agile methodologies, SDLC practices, CI/CD, and system architecture.'
  },
  {
    id: 'oosd-uml',
    title: 'OOSD Using UML, Java & Patterns',
    issuer: 'NPTEL / IIT',
    file: '/certifications/Object Oriented System Development Using UML, Java And Patterns.png',
    color: '#ec4899',
    year: '2025',
    category: 'OOP & Architecture',
    description: 'Design patterns, object-oriented system analysis, and Java development.'
  },
  {
    id: 'problem-solving',
    title: 'Problem Solving (Basic)',
    issuer: 'HackerRank',
    file: '/certifications/Problem Solving.png',
    color: '#10b981',
    year: '2025',
    category: 'Algorithms',
    description: 'Data structures, time complexity optimization, and algorithmic puzzles.'
  },
  {
    id: 'python-infosys',
    title: 'Python Basics',
    issuer: 'Infosys Springboard',
    file: '/certifications/Python Basics (Infosys Springboard).png',
    color: '#06b6d4',
    year: '2025',
    category: 'Programming',
    description: 'Core programming logic, functional concepts, and data structures.'
  },
  {
    id: 'python-programming',
    title: 'Python Programming Mastery',
    issuer: 'Cert Authority',
    file: '/certifications/Python Programming.png',
    color: '#8b5cf6',
    year: '2025',
    category: 'Programming',
    description: 'Advanced Python paradigms, automation scripts, and module design.'
  },
  {
    id: 'python-hackerrank',
    title: 'Python Assessment',
    issuer: 'HackerRank',
    file: '/certifications/python_basic certificate.png',
    color: '#14b8a6',
    year: '2025',
    category: 'Programming',
    description: 'Verified technical proficiency in Python syntax and operations.'
  }
];

export default function Certifications() {
  const sectionRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [coinEffect, setCoinEffect] = useState(false);
  const [btnPressed, setBtnPressed] = useState(null);
  const [selectedModal, setSelectedModal] = useState(null);
  const [filter, setFilter] = useState('ALL');

  const currentCert = CERTS[activeIdx];
  const categories = ['ALL', 'Google', 'IBM', 'HackerRank', 'NPTEL / IIT', 'Infosys Springboard'];

  const filteredCerts = filter === 'ALL'
    ? CERTS
    : CERTS.filter(c => c.issuer.toLowerCase().includes(filter.toLowerCase()));

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  function handlePrev() {
    if (isSpinning) return;
    triggerBtn('prev');
    setActiveIdx(i => (i - 1 + CERTS.length) % CERTS.length);
  }

  function handleNext() {
    if (isSpinning) return;
    triggerBtn('next');
    setActiveIdx(i => (i + 1) % CERTS.length);
  }

  function handleSpin() {
    if (isSpinning) return;
    triggerBtn('spin');
    setIsSpinning(true);
    let count = 0;
    const timer = setInterval(() => {
      setActiveIdx(Math.floor(Math.random() * CERTS.length));
      count++;
      if (count >= 12) {
        clearInterval(timer);
        const finalPick = Math.floor(Math.random() * CERTS.length);
        setActiveIdx(finalPick);
        setIsSpinning(false);
      }
    }, 80);
  }

  function handleInsertCoin() {
    if (coinEffect || isSpinning) return;
    setCoinEffect(true);
    setTimeout(() => {
      setCoinEffect(false);
      handleSpin();
    }, 450);
  }

  function triggerBtn(name) {
    setBtnPressed(name);
    setTimeout(() => setBtnPressed(null), 180);
  }

  function selectCert(cert) {
    const originalIndex = CERTS.findIndex(c => c.id === cert.id);
    if (originalIndex !== -1) {
      setActiveIdx(originalIndex);
    }
  }

  useEffect(() => {
    function handleKeyDown(e) {
      if (selectedModal) {
        if (e.key === 'Escape') setSelectedModal(null);
        return;
      }

      if (!isInView) return;

      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || document.activeElement?.isContentEditable) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleSpin();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
      if (e.code === 'KeyC') {
        handleInsertCoin();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSpinning, selectedModal, coinEffect, isInView]);

  return (
    <section className="section certifications-section" id="certifications" ref={sectionRef}>
      <div className="cert-container">
        {/* Section Header */}
        <div className="cert-page-title">
          <span className="arcade-badge">🕹️ 1984 COIN-OP SYSTEM</span>
          <h2 className="section-title text-center">
            Certifications <span className="text-gradient-orange">Arcade</span>
          </h2>
          <p className="cert-page-desc">
            Step up to the cabinet to browse credentials or pick directly from the verified catalog.
          </p>
        </div>

        {/* Main Content Layout */}
        <div className="arcade-layout">
          {/* LEFT: PHYSICAL 3D ARCADE CABINET */}
          <div className="arcade-cabinet-wrapper">
            <div className="arcade-cabinet">
              {/* Outer T-Molding Orange Vinyl Trim */}
              <div className="cabinet-tmolding tmolding-left" />
              <div className="cabinet-tmolding tmolding-right" />

              {/* Top Angled Canopy */}
              <div className="cab-canopy">
                <div className="canopy-top-edge" />
                <div className="canopy-light-strip" />
              </div>

              {/* Backlit Marquee Sign */}
              <div className="cab-marquee-box">
                <div className="speaker-vents vent-left"><span /><span /><span /></div>
                <div className="marquee-glass">
                  <div className="marquee-neon-title">CERTIFICATIONS</div>
                  <div className="marquee-neon-sub">VERIFIED CREDENTIAL ARCADE • 25¢</div>
                </div>
                <div className="speaker-vents vent-right"><span /><span /><span /></div>
              </div>

              {/* CRT Monitor Chamber (Deep Recessed) */}
              <div className="cab-monitor-hood">
                <div className="crt-bezel-frame">
                  <div className="crt-glass-screen">
                    <div className="crt-scanlines-layer" />
                    <div className="crt-glare-layer" />

                    {/* HUD Header */}
                    <div className="crt-hud">
                      <span className="hud-badge">LEVEL {String(activeIdx + 1).padStart(2, '0')}/{String(CERTS.length).padStart(2, '0')}</span>
                      <span className="hud-issuer" style={{ color: currentCert.color }}>● {currentCert.issuer}</span>
                      <span className="hud-year">{currentCert.year}</span>
                    </div>

                    {/* Certificate Stage */}
                    <div
                      className="crt-stage"
                      onClick={() => !isSpinning && setSelectedModal(currentCert)}
                      title="Tap screen to inspect fullscreen"
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentCert.id + (isSpinning ? '-spin' : '-view')}
                          className="crt-cert-container"
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.96 }}
                          transition={{ duration: 0.16 }}
                        >
                          <div className="crt-img-wrapper">
                            <img
                              src={currentCert.file}
                              alt={currentCert.title}
                              className={`crt-cert-img ${isSpinning ? 'spin-flicker' : ''}`}
                            />
                            {!isSpinning && (
                              <div className="crt-hover-lens">
                                <span>🔍 CLICK TO VIEW FULLSCREEN</span>
                              </div>
                            )}
                          </div>
                          <div className="crt-caption-bar">
                            <span className="caption-text">{currentCert.title}</span>
                            <span className="caption-tag">{currentCert.category}</span>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>

              {/* Physical Angled Control Deck */}
              <div className="cab-control-deck">
                {/* 3D Joystick */}
                <div className="deck-stick-col" onClick={handleNext} title="Click joystick to browse next">
                  <div className="joystick-base-plate">
                    <div className="joystick-metal-shaft">
                      <div className="joystick-ball-head" />
                    </div>
                  </div>
                  <span className="deck-text-lbl">JOYSTICK</span>
                </div>

                {/* 4 Convex 3D Push Buttons */}
                <div className="deck-buttons-cluster">
                  <div className="btns-row">
                    <button
                      className={`arcade-push-btn btn-amber ${btnPressed === 'prev' ? 'is-pressed' : ''}`}
                      onClick={handlePrev}
                      disabled={isSpinning}
                      title="Previous Certificate"
                    >
                      <span className="btn-inner">◀ PREV</span>
                    </button>
                    <button
                      className={`arcade-push-btn btn-emerald ${btnPressed === 'next' ? 'is-pressed' : ''}`}
                      onClick={handleNext}
                      disabled={isSpinning}
                      title="Next Certificate"
                    >
                      <span className="btn-inner">NEXT ▶</span>
                    </button>
                  </div>
                  <div className="btns-row">
                    <button
                      className={`arcade-push-btn btn-ruby ${btnPressed === 'spin' || isSpinning ? 'is-pressed' : ''}`}
                      onClick={handleSpin}
                      disabled={isSpinning}
                      title="Spin random certificate (Space)"
                    >
                      <span className="btn-inner">{isSpinning ? 'ROLLING…' : '🎲 SPIN'}</span>
                    </button>
                    <button
                      className={`arcade-push-btn btn-sapphire ${btnPressed === 'view' ? 'is-pressed' : ''}`}
                      onClick={() => { triggerBtn('view'); setSelectedModal(currentCert); }}
                      title="View fullscreen"
                    >
                      <span className="btn-inner">🔍 VIEW</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Cast-Metal Coin Door with Dual 25¢ Insert Slots */}
              <div className="cab-coin-door-section">
                <div
                  className={`coin-insert-panel ${coinEffect ? 'coin-drop-anim' : ''}`}
                  onClick={handleInsertCoin}
                  title="Click to insert 25¢ token & spin!"
                >
                  <div className="coin-slot-module">
                    <div className="coin-reject-button">
                      <span className="coin-cents">25¢</span>
                      <span className="coin-action">{coinEffect ? 'ACCEPTED!' : 'INSERT COIN'}</span>
                    </div>
                    <div className="coin-slit-metal" />
                  </div>
                  <div className="coin-return-tray">
                    <span>COIN RETURN</span>
                  </div>
                </div>
              </div>

              {/* Base Pedestal */}
              <div className="cab-pedestal-feet" />
            </div>

            {/* Keyboard Shortcuts Hint */}
            <div className="cabinet-desktop-keys">
              <span><kbd>Space</kbd> Random Spin</span>
              <span><kbd>←</kbd> <kbd>→</kbd> Browse</span>
              <span><kbd>C</kbd> Drop Coin</span>
            </div>
          </div>

          {/* RIGHT: DIRECT CREDENTIAL DIRECTORY */}
          <div className="credentials-directory">
            <div className="directory-card">
              <div className="directory-header">
                <div>
                  <h3 className="directory-title">📜 Verified Credentials</h3>
                  <p className="directory-subtitle">Select any certificate to preview on the arcade display</p>
                </div>
                <span className="directory-counter">{filteredCerts.length} OF {CERTS.length}</span>
              </div>

              {/* Category Filter Pills */}
              <div className="directory-filters">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`filter-pill ${filter === cat ? 'is-active' : ''}`}
                    onClick={() => setFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* List of Certificates */}
              <div className="directory-list">
                {filteredCerts.map((cert) => {
                  const isSelected = currentCert.id === cert.id;
                  return (
                    <div
                      key={cert.id}
                      className={`directory-item ${isSelected ? 'is-selected' : ''}`}
                      onClick={() => selectCert(cert)}
                    >
                      <div className="item-issuer-badge" style={{ backgroundColor: `${cert.color}20`, color: cert.color, borderColor: cert.color }}>
                        {cert.issuer.slice(0, 3).toUpperCase()}
                      </div>
                      <div className="item-details">
                        <div className="item-heading">
                          <h4 className="item-title">{cert.title}</h4>
                          <span className="item-year">{cert.year}</span>
                        </div>
                        <p className="item-desc">{cert.description}</p>
                      </div>
                      <button
                        className="item-view-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          selectCert(cert);
                          setSelectedModal(cert);
                        }}
                        title="View fullscreen"
                      >
                        Inspect ↗
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Certificate Modal */}
      <AnimatePresence>
        {selectedModal && (
          <motion.div
            className="cert-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedModal(null)}
          >
            <motion.div
              className="cert-modal-box"
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <span className="modal-issuer" style={{ color: selectedModal.color }}>
                    ● {selectedModal.issuer} • {selectedModal.year}
                  </span>
                  <h3 className="modal-title">{selectedModal.title}</h3>
                </div>
                <div className="modal-actions">
                  <a
                    href={selectedModal.file}
                    target="_blank"
                    rel="noreferrer"
                    className="modal-open-link"
                  >
                    Open Original File ↗
                  </a>
                  <button
                    className="modal-close-btn"
                    onClick={() => setSelectedModal(null)}
                    title="Close"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="modal-image-body">
                <img
                  src={selectedModal.file}
                  alt={selectedModal.title}
                  className="modal-image"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
