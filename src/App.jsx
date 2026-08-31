import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};
import "./App.css";
import "./saas.css";
import Certifications from "./components/Certifications";
import { GitHubCalendar } from 'react-github-calendar';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

// 1. Magnetic Custom Cursor
const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hoverType, setHoverType] = useState('default'); // 'default', 'link', 'project', 'github'
  const [hoverTarget, setHoverTarget] = useState(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsPointer(mediaQuery.matches);

    const handler = (e) => setIsPointer(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!isPointer) return;

    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      const interactable = e.target.closest('a, button, input, select, textarea, .btn, [role="button"]');
      const projectCard = e.target.closest('[data-cursor="project"]');
      const githubLink = e.target.closest('[data-cursor="github"], .react-activity-calendar__calendar rect');
      const textNode = e.target.closest('h1, h2, h3, h4, p, span, [data-cursor="text"], .splash-logo');
      const isMagnetic = e.target.closest('a, button, .btn');

      if (githubLink) {
        setHoverType('github');
      } else if (projectCard) {
        setHoverType('project');
      } else if (interactable) {
        setHoverType('link');
      } else if (textNode) {
        setHoverType('text');
      } else {
        setHoverType('default');
      }

      setHoverTarget(isMagnetic ? isMagnetic : null);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isPointer]);

  if (!isPointer) return null;

  let targetX = mousePosition.x;
  let targetY = mousePosition.y;

  if (hoverTarget && (hoverType === 'link' || hoverType === 'github')) {
    const rect = hoverTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Pull cursor 15% towards the center for a very subtle magnetic snap
    targetX = mousePosition.x + (centerX - mousePosition.x) * 0.15;
    targetY = mousePosition.y + (centerY - mousePosition.y) * 0.15;
  }

  const getRingSize = () => {
    switch (hoverType) {
      case 'github': return 16;
      case 'project': return 80;
      case 'text': return 100;
      case 'link': return 64;
      default: return 32;
    }
  };

  const getRingColor = () => {
    switch (hoverType) {
      case 'github': return '#39d353';
      case 'project': return 'rgba(255, 255, 255, 0.1)';
      case 'text': return '#ffffff';
      default: return '#ffffff';
    }
  };

  const ringSize = getRingSize();

  return (
    <>
      <motion.div
        className="cursor-glow"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '800px',
          height: '800px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0) 65%)',
          mixBlendMode: 'screen',
          pointerEvents: 'none',
          zIndex: -1,
        }}
        animate={{
          x: mousePosition.x - 400,
          y: mousePosition.y - 400,
          opacity: isVisible ? 1 : 0
        }}
        transition={{ type: "tween", duration: 1, ease: "easeOut" }}
      />
      <motion.div
        className="cursor-dot"
        animate={{
          x: targetX - 5,
          y: targetY - 5,
          opacity: isVisible ? (hoverType !== 'default' ? 0 : 1) : 0,
          scale: hoverType !== 'default' ? 0 : 1,
          mixBlendMode: 'difference'
        }}
        transition={{ type: "tween", duration: 0.15, ease: "linear" }}
      />
      <motion.div
        className="cursor-ring"
        animate={{
          x: targetX - ringSize / 2,
          y: targetY - ringSize / 2,
          width: ringSize,
          height: ringSize,
          backgroundColor: hoverType === 'project' ? 'rgba(255, 255, 255, 0.1)' : (hoverType === 'link' || hoverType === 'text' ? '#ffffff' : 'transparent'),
          borderColor: hoverType === 'link' || hoverType === 'text' ? 'transparent' : getRingColor(),
          backdropFilter: hoverType === 'project' ? 'blur(4px)' : 'none',
          opacity: isVisible ? 1 : 0,
          mixBlendMode: (hoverType === 'default' || hoverType === 'link' || hoverType === 'text') ? 'difference' : 'normal'
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.5 }}
      >
        <AnimatePresence>
          {hoverType === 'project' && (
            <motion.span
              className="cursor-text"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              VIEW
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

const TextReveal = ({ text, delayOffset = 0 }) => {
  const words = text.split(" ");
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: delayOffset * i },
    }),
  };

  const child = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 12, stiffness: 100 },
    },
  };

  return (
    <motion.div
      style={{ display: "inline-flex", flexWrap: "wrap", gap: "0.25em" }}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <motion.span variants={child} key={index}>
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

const PROJECT_DATA = [
  {
    title: "Fabrica",
    description: "A modern B2B textile marketplace connecting buyers and suppliers with real-time inventory management.",
    tech: ["React", "JavaScript", "Node.js"],
    link: "https://github.com/BlxrryFxce17/Fabrica",
    liveLink: "https://fabrica-iota.vercel.app",
    images: ["/projects/fabrica/image.png", "/projects/fabrica/image copy.png"]
  },
  {
    title: "AI Job Finder",
    description: "An AI-powered application that scrapes job postings and matches them to your resume.",
    tech: ["JavaScript", "AI"],
    link: "https://github.com/BlxrryFxce17/AI-Job-Finder",
    liveLink: "https://ai-job-finder.vercel.app",
    images: ["/projects/ai-job-finder/image.png", "/projects/ai-job-finder/image copy.png", "/projects/ai-job-finder/image copy 2.png", "/projects/ai-job-finder/image copy 3.png"]
  },
  {
    title: "RythmRing",
    description: "A rhythm and music exploration application.",
    tech: ["React", "JavaScript"],
    link: "https://github.com/BlxrryFxce17/RythmRing",
    images: ["/projects/RythmRing/image.png", "/projects/RythmRing/image copy.png", "/projects/RythmRing/image copy 3.png"]
  },
  {
    title: "MealQuest",
    description: "A React Native recipe app to search meals, view ingredients, and save favourites with Firebase auth.",
    tech: ["React Native", "TypeScript", "Firebase"],
    link: "https://github.com/BlxrryFxce17/MealQuest",
    images: ["https://placehold.co/800x450/0f172a/fff?text=MealQuest"]
  },
  {
    title: "FilmFolks",
    description: "A movie review platform where users can browse, review, and rate films with a modern UI.",
    tech: ["React", "Node.js", "MongoDB"],
    link: "https://github.com/BlxrryFxce17/FilmFolks",
    liveLink: "https://filmfolks-client.vercel.app",
    images: ["https://placehold.co/800x450/0f172a/fff?text=FilmFolks"]
  },
  {
    title: "AirCanvas",
    description: "A computer vision application allowing users to draw in thin air using hand tracking gestures.",
    tech: ["Python", "OpenCV"],
    link: "https://github.com/BlxrryFxce17/AirCanvas",
    images: ["https://placehold.co/800x450/0f172a/fff?text=AirCanvas"]
  },
  {
    title: "AI Grammar Corrector",
    description: "A web app that uses NLP models to detect and correct grammar mistakes in user text.",
    tech: ["Python", "NLP", "Hugging Face"],
    link: "https://github.com/BlxrryFxce17/AI-Grammar-Corrector",
    images: ["https://placehold.co/800x450/0f172a/fff?text=AI+Grammar+Corrector"]
  }
];

const ProjectSlideshow = ({ images, title }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="focus-slideshow">
      {images.map((imgSrc, idx) => (
        <img
          key={idx}
          src={imgSrc}
          alt={`${title} Slide ${idx}`}
          style={{
            position: idx === 0 ? 'relative' : 'absolute',
            top: 0,
            left: 0,
            opacity: currentImgIndex === idx ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      ))}
    </div>
  );
};

const ProjectsTabs = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeProject = PROJECT_DATA[activeIdx];

  return (
    <section className="section" id="projects">
      <h2>Selected Works</h2>
      <div className="projects-tabs-container">
        <div className="projects-tab-list">
          {PROJECT_DATA.map((proj, idx) => (
            <button
              key={idx}
              className={`projects-tab-button ${activeIdx === idx ? 'active' : ''}`}
              onClick={() => setActiveIdx(idx)}
              data-cursor="magnetic"
            >
              {proj.title}
            </button>
          ))}
        </div>

        <div className="projects-tab-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
              <div className="tab-slideshow" data-cursor="project">
                <ProjectSlideshow images={activeProject.images} title={activeProject.title} />
              </div>
              <div className="tab-details">
                <h3>{activeProject.title}</h3>
                <p>{activeProject.description}</p>
                <div className="tech-stack">
                  {activeProject.tech.map((t, i) => (
                    <span key={i} className="tech-badge">{t}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', alignSelf: 'flex-start' }}>
                  <a href={activeProject.link} target="_blank" rel="noreferrer" data-cursor="github" className="github-link">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                    Source Code
                  </a>
                  {activeProject.liveLink && (
                    <a href={activeProject.liveLink} target="_blank" rel="noreferrer" data-cursor="magnetic" className="github-link" style={{ background: 'rgba(255,255,255,0.1)' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const ParallaxBackground = ({ scrollYProgress }) => {
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div className="global-bg">
      <motion.div className="bg-orb orb-1" style={{ y: y1 }} />
      <motion.div className="bg-orb orb-2" style={{ y: y2 }} />
      <motion.div className="bg-orb orb-3" style={{ y: y3 }} />
    </div>
  );
};

const SplashScreen = ({ setIsLoading }) => {
  const loadingTexts = [
    "Initializing environment...",
    "Loading assets...",
    "Preparing something awesome..."
  ];
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev < loadingTexts.length - 1 ? prev + 1 : prev));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="splash-screen"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.8, delay: 2.8, ease: "easeInOut" }}
      onAnimationComplete={() => setIsLoading(false)}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <motion.div
          className="splash-logo"
          initial={{ opacity: 0, scale: 0.9, letterSpacing: "5px" }}
          animate={{ opacity: 1, scale: 1, letterSpacing: "10px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ marginBottom: '10px' }}
        >
          AKASH V.
        </motion.div>
        
        <AnimatePresence mode="wait">
          <motion.div
            style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', fontWeight: '500', letterSpacing: '1px' }}
            key={textIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {loadingTexts[textIndex]}
          </motion.div>
        </AnimatePresence>

        <motion.div
          className="splash-progress"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
};

const TECH_STACK_DATA = [
  { name: 'React', category: 'Frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' },
  { name: 'JavaScript', category: 'Frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' },
  { name: 'TypeScript', category: 'Frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg' },
  { name: 'HTML5', category: 'Frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg' },
  { name: 'CSS3', category: 'Frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg' },
  { name: 'Angular', category: 'Frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angularjs/angularjs-original.svg' },
  { name: 'Node.js', category: 'Backend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg' },
  { name: 'Express', category: 'Backend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg' },
  { name: 'MongoDB', category: 'Backend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg' },
  { name: 'SQL', category: 'Backend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuresqldatabase/azuresqldatabase-original.svg' },
  { name: 'Python', category: 'ML & Tools', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg' },
  { name: 'Git', category: 'ML & Tools', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg' },
  { name: 'Firebase', category: 'ML & Tools', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg' },
  { name: 'AWS', category: 'ML & Tools', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' },
];

const Toolbox = () => {
  const half = Math.ceil(TECH_STACK_DATA.length / 2);
  const topRowTech = TECH_STACK_DATA.slice(0, half);
  const bottomRowTech = TECH_STACK_DATA.slice(half);

  // Triple the items for infinite marquee
  const topMarqueeItems = [...topRowTech, ...topRowTech, ...topRowTech];
  const bottomMarqueeItems = [...bottomRowTech, ...bottomRowTech, ...bottomRowTech];

  return (
    <section className="section toolbox-section bg-accent-4" id="skills" style={{ padding: '6rem 0', overflow: 'hidden' }}>
      <div className="toolbox-header" style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '700', margin: 0 }}>
          Skills & Technologies
        </h2>
      </div>

      <div className="marquee-wrapper" data-cursor="magnetic" style={{ flexDirection: 'column', gap: '2rem' }}>
        <div className="marquee-track">
          {topMarqueeItems.map((tech, idx) => (
            <motion.div
              key={`top-${idx}`}
              className="tech-pill-marquee"
              whileHover={{ scale: 1.15 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <img src={tech.icon} alt={tech.name} style={{ width: '24px', height: '24px' }} />
              {tech.name}
            </motion.div>
          ))}
        </div>
        <div className="marquee-track" style={{ animationDirection: 'reverse' }}>
          {bottomMarqueeItems.map((tech, idx) => (
            <motion.div
              key={`bottom-${idx}`}
              className="tech-pill-marquee"
              whileHover={{ scale: 1.15 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <img src={tech.icon} alt={tech.name} style={{ width: '24px', height: '24px' }} />
              {tech.name}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Character = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0.1, 1]);
  return (
    <motion.span style={{ opacity }}>
      {children}
    </motion.span>
  );
};

const ScrollRevealText = ({ text }) => {
  const container = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 85%", "end 50%"]
  });

  const characters = text.split("");

  return (
    <p ref={container} className="scroll-reveal-text">
      {characters.map((char, i) => {
        const start = i / characters.length;
        const end = start + (1 / characters.length);
        return <Character key={i} progress={scrollYProgress} range={[start, end]}>{char}</Character>
      })}
    </p>
  );
};

const TimelineItem = ({ year, title, company, align, hoverImage }) => {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 300 };
  const cursorXSpring = useSpring(x, springConfig);
  const cursorYSpring = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    x.set(e.clientX);
    y.set(e.clientY);
  };

  return (
    <motion.div
      className={`timeline-item ${align}`}
      initial={{ opacity: 0, x: align === 'left' ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, amount: 0.5 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      style={{ position: 'relative' }}
    >
      <div className="timeline-content">
        <div className="timeline-year">{year}</div>
        <h3>{title}</h3>
        <p>{company}</p>
      </div>
      <div className="timeline-dot" />

      {hoverImage && (
        <AnimatePresence>
          {isHovered && (
            <motion.img
              src={hoverImage}
              alt="Preview"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{
                position: 'fixed',
                top: cursorYSpring,
                left: cursorXSpring,
                translateX: "10%", // offset from cursor slightly
                translateY: "-50%",
                width: "500px",
                borderRadius: "8px",
                pointerEvents: "none",
                zIndex: 9999,
                boxShadow: "0 10px 40px rgba(0,255,255,0.2), 0 0 0 1px rgba(255,255,255,0.1)"
              }}
            />
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
};





const GitHubStats = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="section stats-section" style={{ padding: '4rem 0' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>GitHub <span className="text-gradient">Activity</span></h2>
      <motion.div 
        className="github-calendar-container"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
        style={{ 
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          padding: isMobile ? '1.5rem 1rem' : '2rem',
          maxWidth: '1000px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          margin: '0 auto'
        }}>
          <GitHubCalendar 
            username="BlxrryFxce17" 
            colorScheme="dark"
            theme={{
              dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
            }}
            blockSize={isMobile ? 8 : 12}
            blockMargin={isMobile ? 2 : 4}
            fontSize={isMobile ? 10 : 14}
            hideColorLegend={isMobile}
            transformData={isMobile ? (data) => {
              const now = new Date();
              const cutoff = new Date(now.getFullYear(), now.getMonth() - 3, 1);
              return data.filter(d => new Date(d.date) >= cutoff);
            } : undefined}
            style={{ margin: '0 auto', width: '100%' }}
            renderBlock={(block, activity) => {
              const dateObj = new Date(activity.date);
              const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              
              return React.cloneElement(block, {
                'data-tooltip-id': 'react-tooltip',
                'data-tooltip-content': JSON.stringify({ count: activity.count, date: formattedDate }),
              });
            }}
          />
          <Tooltip 
            id="react-tooltip" 
            style={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', padding: '6px 12px', fontSize: '14px', zIndex: 99999 }} 
            render={({ content }) => {
              if (!content) return null;
              try {
                const data = JSON.parse(content);
                const countText = data.count === 0 ? 'No Commits' : `${data.count} contributions`;
                return (
                  <span>
                    <strong>{countText}</strong> on {data.date}
                  </span>
                );
              } catch (e) {
                return content;
              }
            }}
          />
      </motion.div>
    </section>
  );
};


// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 70, damping: 15 },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  },
};

const GlitchText = ({ original, as: Component = "span", className = "", style = {}, type = "sequential" }) => {
  const [text, setText] = useState(original);
  const [isGlitching, setIsGlitching] = useState(false);
  const randomTimer = React.useRef(null);
  
  const chars = "!<>-_\\\\/[]{}—=+*^?#________";

  const triggerGlitch = React.useCallback(() => {
    if (isGlitching) return;
    
    if (type === "cssOnly") {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 300);
      return;
    }
    
    if (type === "scramble") {
      setIsGlitching(true);
      setText(original.split("").map(c => c === " " ? " " : chars[Math.floor(Math.random() * chars.length)]).join(""));
      setTimeout(() => { setText(original); setIsGlitching(false); }, 300);
      return;
    }

    // sequential type
    setIsGlitching(true);
    let iterations = 0;
    const interval = setInterval(() => {
      setText(original.split("").map((letter, index) => {
        if(index < iterations) return original[index];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(""));
      
      if(iterations >= original.length) {
        clearInterval(interval);
        setIsGlitching(false);
      }
      iterations += 1/3;
    }, 50);
  }, [isGlitching, original, type]);

  useEffect(() => {
    const queueNextGlitch = () => {
      const delay = Math.random() * 10000 + 5000; // Random delay between 5s and 15s
      randomTimer.current = setTimeout(() => {
        triggerGlitch();
        queueNextGlitch();
      }, delay);
    };
    queueNextGlitch();
    return () => clearTimeout(randomTimer.current);
  }, [triggerGlitch]);

  const handleMouseEnter = () => {
    triggerGlitch();
  };
  
  const handleMouseLeave = () => {
    if (!isGlitching) setText(original);
  };

  return (
    <Component 
      className={`${className} ${isGlitching ? 'glitching' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ display: 'inline-block', cursor: 'default', ...style }}
    >
      {text}
    </Component>
  );
};

// --- PAGES ---

const Home = () => {
  const timelineRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"]
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      <section className="section hero" id="home" style={{ perspective: "1000px" }}>
        <div className="hero-content-centered">
          <div className="hero-floating-badge top-right">
            <strong>Full Stack Dev</strong><br />Software Engineer
          </div>
          <div className="hero-floating-badge top-left">
            BASED IN<br /><strong>Mangalore, India</strong>
          </div>
          <div className="hero-cyber-grid"></div>
          <div className="hero-split-container">
            {/* Left: Text Details */}
            <div className="hero-left-content">
              <div className="hero-expanding-text">DEVELOPER PORTFOLIO</div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="split-title"
              >
                Hi, I'm <span className="text-electric-blue">Akash V</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="hero-tagline"
              >
                I build <span className="text-neon-green">full-stack web apps</span>, <span className="text-vivid-orange">machine learning projects</span>, and <span className="text-hot-pink">mobile applications</span> with a focus on clean code and <span className="text-bright-yellow">performance</span>.
              </motion.p>
              
              {/* Buttons positioned directly under the text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}
              >
                <Link to="/projects" className="btn-pill dark">Projects</Link>
                <a href="/AKVSH.pdf" target="_blank" className="btn-pill light">RESUME</a>
              </motion.div>
            </div>

            {/* Right: Portrait Photo */}
            <motion.div 
              className="hero-right-content"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="hero-portrait-card">
                  <div className="portrait-circles">
                    <div className="circle c1"></div>
                    <div className="circle c2"></div>
                    <div className="circle c3"></div>
                  </div>
                  <img src="/portrait.jpg" alt="Akash V Portrait" className="portrait-img" />
                </div>

                <div className="hero-social-links">
                  <a href="https://github.com/BlxrryFxce17" target="_blank" rel="noreferrer" data-cursor="magnetic" aria-label="GitHub">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>
                  </a>
                  <a href="https://www.linkedin.com/in/akashv10" target="_blank" rel="noreferrer" data-cursor="magnetic" aria-label="LinkedIn">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                  <a href="https://x.com/kai_zenn10" target="_blank" rel="noreferrer" data-cursor="magnetic" aria-label="X (Twitter)">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a href="https://www.instagram.com/kai.zenn_10/?utm_source=ig_web_button_share_sheet" target="_blank" rel="noreferrer" data-cursor="magnetic" aria-label="Instagram">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </a>
                  <a href="https://www.reddit.com/user/Blxrry_Fxce_17/" target="_blank" rel="noreferrer" data-cursor="magnetic" aria-label="Reddit">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .466c.842.842 2.484.915 2.961.915.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 0-.466.336.336 0 0 0-.466 0c-.326.311-1.305.719-2.495.719-1.114 0-2.12-.352-2.496-.715a.333.333 0 0 0-.234-.1z"/></svg>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Toolbox />

      <section className="section bg-accent-1" id="about" style={{ padding: '8rem 5%' }}>
        <ScrollRevealText text="I'm a Computer Science student based in India, focused on full-stack development, machine learning, and AI projects. I enjoy building real-world apps and solving problems with code." />
      </section>

      {/* Experience & Education Section */}
      <section className="section experience-section bg-accent-2" id="experience" style={{ paddingBottom: '6rem', position: 'relative', overflow: 'hidden' }}>
        <FloatingShapes />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <GlitchText original="Experience & Education" as="h2" type="scramble" style={{ marginBottom: '4rem', textAlign: 'center' }} />
          <div className="timeline-container" ref={timelineRef}>
            <div className="timeline-line">
              <motion.div style={{ scaleY, originY: 0, backgroundColor: 'var(--neon-green)', width: '100%', height: '100%', borderRadius: '4px' }} />
            </div>
            <TimelineItem
              year="Jan 2026 - Jun 2026"
              title="Full Stack Developer Intern"
              company="Techpath"
              align="left"
              hoverImage="/certifications/TechPath.png"
            />
            <TimelineItem year="2024 - 2026" title="Master of Computer Applications (MCA)" company="St. Aloysius (Deemed to be University)" align="right" />
            <TimelineItem year="2021 - 2024" title="Bachelor of Computer Applications (BCA)" company="Srinivas University" align="left" />
          </div>
        </div>
      </section>

      <section className="section bg-accent-3" style={{ paddingBottom: '2rem' }}>
        <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Featured <span className="text-gradient">Projects</span></h2>
        <div className="projects-grid">
          {PROJECT_DATA.filter(p => p.title === "AirCanvas" || p.title === "AI Job Finder").map((project, index) => (
            <motion.div className="project-card" key={index} variants={fadeUpVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
              <div className="card-spotlight"></div>
              <div className="project-image-placeholder">
                <img src={project.images[0]} alt={project.title} />
              </div>
              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="tech-stack">
                  {project.tech.map((tech, i) => <span key={i} className="tech-badge">{tech}</span>)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link to="/projects" className="btn primary">View All Projects</Link>
        </div>
      </section>

      <Certifications />

      {/* Landing Page Contact Section */}
      <section className="section bg-accent-4" style={{ padding: '4rem 5% 6rem 5%', textAlign: 'center', width: '100%', overflow: 'hidden' }}>
        <h2 style={{ marginBottom: '1rem', whiteSpace: 'normal', wordWrap: 'break-word' }}>Interested in <span className="text-gradient">collaborating?</span></h2>
        <p style={{ color: '#a1a1aa', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
          I'm always open to discussing product design work or partnership opportunities.
        </p>
        <Link to="/contact" className="btn-pill dark" style={{ display: 'inline-block', fontSize: '1.2rem', padding: '1rem 3rem' }}>Get In Touch</Link>
      </section>
    </>
  );
};

const ExperiencePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ paddingTop: '10rem', minHeight: '100vh' }}
    >
      <section className="section experience-section">
        <div className="container">
          <GlitchText original="Experience & Education" as="h2" type="scramble" style={{ marginBottom: '4rem', textAlign: 'center' }} />
          <div className="timeline-container">
            <div className="timeline-line" />
            <TimelineItem
              year="Jan 2026 - Jun 2026"
              title="Full Stack Developer Intern"
              company="Techpath"
              align="left"
              hoverImage="/certifications/TechPath.png"
            />
            <TimelineItem year="2024 - 2026" title="Master of Computer Applications (MCA)" company="St. Aloysius (Deemed to be University)" align="right" />
            <TimelineItem year="2021 - 2024" title="Bachelor of Computer Applications (BCA)" company="Srinivas University" align="left" />
          </div>
        </div>
      </section>
    </motion.div>
  );
};

const ProjectsPage = () => {
  return (
    <div style={{ paddingTop: '6rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, margin: 0 }}>
          Featured <span className="text-gradient">Projects</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '1rem' }}>
          A selection of my best technical work.
        </p>
      </div>
      <ProjectsTabs />
      <div style={{ marginTop: '4rem' }}>
        <GitHubStats />
      </div>
    </div>
  );
};

const ContactPage = () => {
  return (
    <section className="section contact-section bg-accent-1" id="contact" style={{ paddingTop: '10rem', minHeight: '80vh' }}>
      <div className="contact-container">
        <div className="contact-content">
          <GlitchText original="Let's Build Something Together." as="h2" type="cssOnly" />
          <p className="contact-desc">
            I'm currently available for full-time opportunities. If you have a project that needs some creative magic, I'd love to hear about it.
          </p>
          <div className="contact-methods" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            <a href="mailto:akashvmsn@gmail.com" className="contact-pill">akashvmsn@gmail.com</a>
            <a href="https://wa.me/918904819430" target="_blank" rel="noopener noreferrer" className="contact-pill" style={{ background: 'rgba(255,255,255,0.05)' }}>+91 89048 19430</a>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <a href="https://github.com/BlxrryFxce17" target="_blank" rel="noopener noreferrer" className="contact-pill" style={{ background: 'rgba(255,255,255,0.05)' }}>GitHub</a>
              <a href="https://www.linkedin.com/in/akashv10" target="_blank" rel="noopener noreferrer" className="contact-pill" style={{ background: 'rgba(255,255,255,0.05)' }}>LinkedIn</a>
              <a href="https://x.com/kai_zenn10" target="_blank" rel="noopener noreferrer" className="contact-pill" style={{ background: 'rgba(255,255,255,0.05)' }}>X (Twitter)</a>
              <a href="https://www.instagram.com/kai.zenn_10/" target="_blank" rel="noopener noreferrer" className="contact-pill" style={{ background: 'rgba(255,255,255,0.05)' }}>Instagram</a>
              <a href="https://www.reddit.com/user/Blxrry_Fxce_17/" target="_blank" rel="noopener noreferrer" className="contact-pill" style={{ background: 'rgba(255,255,255,0.05)' }}>Reddit</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const OverlayMenu = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="overlay-menu-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <button className="overlay-close-btn" onClick={onClose} aria-label="Close menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          
          <div className="overlay-menu-content">
            <div className="overlay-menu-left">
              <nav className="overlay-nav-links">
                <Link to="/" onClick={onClose}><span>01</span> Introduction</Link>
                <Link to="/experience" onClick={onClose}><span>02</span> Experience & Education</Link>
                <Link to="/projects" onClick={onClose}><span>03</span> Projects</Link>
                <Link to="/contact" onClick={onClose}><span>04</span> Contact</Link>
              </nav>
            </div>
            
            <div className="overlay-menu-right">
              <div className="overlay-info-block">
                <h4>SOCIALS</h4>
                <a href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="https://github.com/BlxrryFxce17" target="_blank" rel="noopener noreferrer">GitHub</a>
                <a href="https://wa.me/918904819430" target="_blank" rel="noopener noreferrer">WhatsApp</a>
              </div>
              
              <div className="overlay-info-block">
                <h4>GET IN TOUCH</h4>
                <a href="mailto:akashvmsn@gmail.com">akashvmsn@gmail.com</a>
                <p>WhatsApp: +91 89048 19430</p>
              </div>
              
              <div className="overlay-info-block">
                <h4>LOCATION</h4>
                <p>Mangalore, India</p>
                <p className="sub-text">Working Remotely</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const FloatingShapes = () => {
  const containerRef = React.useRef(null);
  const shapesData = React.useRef([]);
  const shapeRefs = React.useRef([]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    let width = container.clientWidth;
    let height = container.clientHeight;

    // Initialize shapes once
    if (shapesData.current.length === 0) {
      shapesData.current = Array.from({ length: 35 }).map(() => {
        const typeRand = Math.random();
        let type = 'circle';
        if (typeRand > 0.85) type = 'cross';
        else if (typeRand > 0.7) type = 'hollow';
        else if (typeRand > 0.55) type = 'square';
        else if (typeRand > 0.4) type = 'triangle';
        else if (typeRand > 0.25) type = 'dot';
        
        const size = Math.random() * 80 + 20;
        return {
          type,
          size,
          radius: size / 2,
          x: Math.random() * (width - size),
          y: Math.random() * (height - size),
          vx: (Math.random() - 0.5) * 0.4, // Slower initial speed
          vy: (Math.random() - 0.5) * 0.4,
          vRot: (Math.random() - 0.5) * 0.4, // Slower rotation
          rotation: Math.random() * 360,
          opacity: Math.random() * 0.15 + 0.1,
        };
      });
    }

    let animationFrameId;

    const update = () => {
      width = container.clientWidth;
      height = container.clientHeight;

      for (let i = 0; i < shapesData.current.length; i++) {
        let s1 = shapesData.current[i];

        // Wall collision (gentle bounce)
        if (s1.x <= 0) { s1.x = 0; s1.vx *= -1; }
        if (s1.x + s1.size >= width) { s1.x = width - s1.size; s1.vx *= -1; }
        if (s1.y <= 0) { s1.y = 0; s1.vy *= -1; }
        if (s1.y + s1.size >= height) { s1.y = height - s1.size; s1.vy *= -1; }

        // Object collision
        for (let j = i + 1; j < shapesData.current.length; j++) {
          let s2 = shapesData.current[j];
          let dx = (s2.x + s2.radius) - (s1.x + s1.radius);
          let dy = (s2.y + s2.radius) - (s1.y + s1.radius);
          let distance = Math.sqrt(dx * dx + dy * dy);
          let minDist = s1.radius + s2.radius;
          
          if (distance < minDist && distance > 0.1) {
            // Gentle push apart
            let overlap = minDist - distance;
            let nx = dx / distance;
            let ny = dy / distance;
            
            // Reduced repulsion force for calmer movement
            let pushX = nx * (overlap * 0.01);
            let pushY = ny * (overlap * 0.01);
            
            s1.vx -= pushX;
            s1.vy -= pushY;
            s2.vx += pushX;
            s2.vy += pushY;
          }
        }

        // Speed limit (very slow max speed)
        let speed = Math.sqrt(s1.vx * s1.vx + s1.vy * s1.vy);
        const maxSpeed = 0.4;
        if (speed > maxSpeed) {
          s1.vx = (s1.vx / speed) * maxSpeed;
          s1.vy = (s1.vy / speed) * maxSpeed;
        }

        // Add tiny minimum speed to prevent them from stopping completely
        if (speed < 0.05) {
          s1.vx += (Math.random() - 0.5) * 0.01;
          s1.vy += (Math.random() - 0.5) * 0.01;
        }

        s1.x += s1.vx;
        s1.y += s1.vy;
        s1.rotation += s1.vRot;
      }

      // Render
      shapeRefs.current.forEach((el, i) => {
        if (el && shapesData.current[i]) {
          const s = shapesData.current[i];
          el.style.transform = `translate(${s.x}px, ${s.y}px) rotate(${s.rotation}deg)`;
        }
      });

      animationFrameId = requestAnimationFrame(update);
    };

    update();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {shapesData.current.map((s, i) => {
        let content = null;
        if (s.type === 'circle') {
          content = <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: `rgba(var(--shape-color, 255, 255, 255), ${s.opacity})` }} />;
        } else if (s.type === 'hollow') {
          content = <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: `1px solid rgba(var(--shape-color, 255, 255, 255), ${s.opacity * 2})` }} />;
        } else if (s.type === 'square') {
          content = <div style={{ width: '100%', height: '100%', backgroundColor: `rgba(var(--shape-color, 255, 255, 255), ${s.opacity})` }} />;
        } else if (s.type === 'triangle') {
          content = (
            <div style={{ 
              width: 0, height: 0, 
              borderLeft: `${s.size/2}px solid transparent`,
              borderRight: `${s.size/2}px solid transparent`,
              borderBottom: `${s.size}px solid rgba(var(--shape-color, 255, 255, 255), ${s.opacity})` 
            }} />
          );
        } else if (s.type === 'dot') {
          content = <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: `rgba(var(--shape-color, 255, 255, 255), ${s.opacity * 3})`, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />;
        } else {
          content = (
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: '20%', right: '20%', height: '1px', backgroundColor: `rgba(var(--shape-color, 255, 255, 255), ${s.opacity * 3})` }} />
              <div style={{ position: 'absolute', left: '50%', top: '20%', bottom: '20%', width: '1px', backgroundColor: `rgba(var(--shape-color, 255, 255, 255), ${s.opacity * 3})` }} />
            </div>
          );
        }

        return (
          <div
            key={i}
            ref={(el) => shapeRefs.current[i] = el}
            style={{
              position: 'absolute',
              width: s.type === 'triangle' || s.type === 'dot' ? 'auto' : s.size,
              height: s.type === 'triangle' || s.type === 'dot' ? 'auto' : s.size,
              top: 0, left: 0, // Using translate for positioning
              willChange: 'transform'
            }}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [overdriveCount, setOverdriveCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [isDarkMode]);

  const { scrollY, scrollYProgress } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 50) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });
  // Secret Console Easter Egg
  useEffect(() => {
    if (window.__easterEggPrinted) return;
    window.__easterEggPrinted = true;

    console.log(
      "%c>> INITIATING NEURAL HANDSHAKE...\n" +
      "%c========================================\n" +
      "          A  K  A  S  H   V.\n" +
      "========================================\n" +
      "%c[+] SYSTEM BREACH DETECTED.\n" +
      "[+] Welcome to the dark side of the web, choom.\n" +
      "[+] Looks like you enjoy poking around under the hood.\n\n" +
      "%c>> Let's build something preem together.\n" +
      ">> Ping me: %cakashvmsn@gmail.com", 
      "color: #a1a1aa; font-size: 12px;",
      "color: #00f0ff; font-weight: bold; text-shadow: 0 0 5px #00f0ff;",
      "color: #ff003c; font-size: 14px; font-weight: bold;",
      "color: #a1a1aa; font-size: 14px;",
      "color: #ff00ea; font-size: 14px; font-weight: bold; text-decoration: underline;"
    );
  }, []);

  // Overdrive Mode logic
  useEffect(() => {
    if (overdriveCount >= 5) {
      document.body.classList.toggle("overdrive-mode");
      setOverdriveCount(0); // reset so they can toggle it off by clicking 5 more times
    }
  }, [overdriveCount]);

  // Body scroll lock during splash screen or menu
  useEffect(() => {
    if (isLoading || isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isLoading, isMenuOpen]);

  // 3D Tilt Hero Logic
  const heroMouseX = useMotionValue(0);
  const heroMouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 300 };
  const heroSpringX = useSpring(heroMouseX, springConfig);
  const heroSpringY = useSpring(heroMouseY, springConfig);
  const rotateX = useTransform(heroSpringY, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(heroSpringX, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleHeroMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    heroMouseX.set(x);
    heroMouseY.set(y);
  };

  const handleHeroMouseLeave = () => {
    heroMouseX.set(0);
    heroMouseY.set(0);
  };

  // 4. Parallax Background
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <Router>
      <ScrollToTop />
      <CustomCursor />
      <OverlayMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      {isLoading && <SplashScreen setIsLoading={setIsLoading} />}

      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ParallaxBackground scrollYProgress={scrollYProgress} />
          
          {/* Restored Standard Top Navbar */}
          <header className="saas-navbar">
            <div className="saas-logo">
              <Link to="/" className="expanding-logo-wrapper">
                <span className="logo-initials">av</span><span className="logo-dot">.</span>
                <span className="logo-full">akash v</span>
              </Link>
            </div>
            <nav className="saas-nav-actions">
              <a href="/AKVSH.pdf" target="_blank" className="nav-btn-resume">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                Resume
              </a>
              <button
                className="theme-toggle nav-icon-btn"
                onClick={() => setIsDarkMode(!isDarkMode)}
                aria-label="Toggle theme"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
              </button>
              <button className="nav-btn-menu" onClick={() => setIsMenuOpen(true)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                MENU
              </button>
            </nav>
          </header>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/experience" element={<ExperiencePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>

          <div style={{ display: 'flex', width: '100%', height: '6px' }}>
            {['#7c3aed', '#ec4899', '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#6366f1', '#4c1d95'].map((color, index) => (
              <div key={index} style={{ flex: 1, backgroundColor: color }} />
            ))}
          </div>
          {/* Footer */}
          <footer className="footer">
            <p onClick={() => setOverdriveCount(c => c + 1)} style={{ cursor: 'pointer', userSelect: 'none' }}>
              © 2026 Akash V. All rights reserved.
            </p>
          </footer>
        </motion.div>
      )}
    </Router>
  );
}

export default App;








