import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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
      const projectCard = e.target.closest('[data-cursor="project"], .projects-tab-content');
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
    images: ["/grammar_placeholder.jpg"]
  },
  {
    title: "FilmFolks",
    description: "A movie review platform where users can browse, review, and rate films with a modern UI.",
    tech: ["React", "Node.js", "MongoDB"],
    link: "https://github.com/BlxrryFxce17/FilmFolks",
    liveLink: "https://filmfolks-client.vercel.app",
    images: ["/filmfolks_placeholder.jpg"]
  },
  {
    title: "AirCanvas",
    description: "A computer vision application allowing users to draw in thin air using hand tracking gestures.",
    tech: ["Python", "OpenCV"],
    link: "https://github.com/BlxrryFxce17/AirCanvas",
    images: ["/fakenews_placeholder.jpg"]
  },
  {
    title: "AI Grammar Corrector",
    description: "A web app that uses NLP models to detect and correct grammar mistakes in user text.",
    tech: ["Python", "NLP", "Hugging Face"],
    link: "https://github.com/BlxrryFxce17/AI-Grammar-Corrector",
    images: ["/grammar_placeholder.jpg"]
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
              <div className="tab-slideshow">
                <ProjectSlideshow images={activeProject.images} title={activeProject.title} />
              </div>
              <div className="tab-details" data-cursor="project">
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
    <section className="section toolbox-section" id="skills" style={{ padding: '6rem 0', overflow: 'hidden' }}>
      <div className="toolbox-header" style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#fff', margin: 0 }}>
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
  return (
    <section className="section stats-section" style={{ padding: '4rem 0' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>GitHub <span className="text-gradient">Activity</span></h2>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '0 1rem' }}
      >
        <div style={{
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '1000px',
          width: '100%',
          overflowX: 'auto',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
        }}>
          <GitHubCalendar 
            username="BlxrryFxce17" 
            colorScheme="dark"
            theme={{
              dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
            }}
            style={{ margin: '0 auto' }}
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
        </div>
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
              <div className="hero-portrait-card">
                <div className="portrait-circles">
                  <div className="circle c1"></div>
                  <div className="circle c2"></div>
                  <div className="circle c3"></div>
                </div>
                <img src="/portrait.jpg" alt="Akash V Portrait" className="portrait-img" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Toolbox />

      <section className="section" id="about" style={{ padding: '8rem 0' }}>
        <ScrollRevealText text="I'm a Computer Science student based in India, focused on full-stack development, machine learning, and AI projects. I enjoy building real-world apps and solving problems with code." />
      </section>
      <section className="section" style={{ paddingBottom: '2rem' }}>
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
      <section className="section" style={{ padding: '4rem 0 6rem 0', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem' }}>Interested in <span className="text-gradient">collaborating?</span></h2>
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
    <section className="section contact-section" id="contact" style={{ paddingTop: '10rem', minHeight: '80vh' }}>
      <div className="contact-container">
        <div className="contact-content">
          <GlitchText original="Let's Build Something Together." as="h2" type="cssOnly" />
          <p className="contact-desc">
            I'm currently available for full-time opportunities. If you have a project that needs some creative magic, I'd love to hear about it.
          </p>
          <div className="contact-methods" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            <a href="mailto:akashvmsn@gmail.com" className="contact-pill">akashvmsn@gmail.com</a>
            <a href="https://wa.me/918904819430" target="_blank" rel="noopener noreferrer" className="contact-pill" style={{ background: 'rgba(255,255,255,0.05)' }}>+91 89048 19430</a>
            <a href="https://github.com/BlxrryFxce17" target="_blank" rel="noopener noreferrer" className="contact-pill" style={{ background: 'rgba(255,255,255,0.05)' }}>GitHub</a>
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

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [overdriveCount, setOverdriveCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    console.log(
      "%cWelcome to the dark side of the web, choom.\n%cIf you're reading this, we should probably build something together.\nDrop me a line: akashvmsn@gmail.com", 
      "color: #00f0ff; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px #00f0ff;", 
      "color: #a1a1aa; font-size: 14px;"
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








