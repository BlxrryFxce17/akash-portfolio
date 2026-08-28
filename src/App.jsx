import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import "./App.css";
import Certifications from "./components/Certifications";

// 1. Magnetic Custom Cursor
const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isGithubHover, setIsGithubHover] = useState(false);
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
      const interactable = e.target.closest('a, button, input, select, textarea, .btn, .project-card, [role="button"]');
      const githubLink = e.target.closest('[data-cursor="github"]');
      const isMagnetic = e.target.closest('a, button, .btn');

      setIsHovering(!!interactable && !githubLink);
      setIsGithubHover(!!githubLink);
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

  if (hoverTarget) {
    const rect = hoverTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Pull cursor 15% towards the center for a very subtle magnetic snap
    targetX = mousePosition.x + (centerX - mousePosition.x) * 0.15;
    targetY = mousePosition.y + (centerY - mousePosition.y) * 0.15;
  }

  return (
    <>
      <motion.div
        className="cursor-dot"
        animate={{
          x: targetX - 4,
          y: targetY - 4,
          opacity: isVisible ? (isHovering || isGithubHover ? 0 : 1) : 0,
          scale: (isHovering || isGithubHover) ? 0 : 1
        }}
        transition={{ type: "tween", duration: 0.15, ease: "linear" }}
      />
      <motion.div
        className="cursor-ring"
        animate={{
          x: targetX - (isGithubHover ? 8 : (isHovering ? 32 : 16)),
          y: targetY - (isGithubHover ? 8 : (isHovering ? 32 : 16)),
          width: isGithubHover ? 16 : (isHovering ? 64 : 32),
          height: isGithubHover ? 16 : (isHovering ? 64 : 32),
          backgroundColor: isGithubHover ? "rgba(255,255,255,0.8)" : (isHovering ? "rgba(255,255,255,0.15)" : "transparent"),
          borderColor: (isHovering || isGithubHover) ? "transparent" : "rgba(255,255,255,0.5)",
          opacity: isVisible ? 1 : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.5 }}
      />
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
    images: ["/projects/fabrica/image.png", "/projects/fabrica/image copy.png"]
  },
  {
    title: "AI Job Finder",
    description: "An AI-powered application that scrapes job postings and matches them to your resume.",
    tech: ["JavaScript", "AI"],
    link: "https://github.com/BlxrryFxce17/AI-Job-Finder",
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
              <div className="tab-details">
                <h3>{activeProject.title}</h3>
                <p>{activeProject.description}</p>
                <div className="tech-stack">
                  {activeProject.tech.map((t, i) => (
                    <span key={i} className="tech-badge">{t}</span>
                  ))}
                </div>
                <a href={activeProject.link} target="_blank" rel="noreferrer" data-cursor="github" className="github-link" style={{ marginTop: '1rem', alignSelf: 'flex-start' }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                  Source Code
                </a>
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
  return (
    <motion.div
      className="splash-screen"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.8, delay: 1.5, ease: "easeInOut" }}
      onAnimationComplete={() => setIsLoading(false)}
    >
      <motion.div
        className="splash-logo"
        initial={{ opacity: 0, scale: 0.9, letterSpacing: "5px" }}
        animate={{ opacity: 1, scale: 1, letterSpacing: "10px" }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        AKASH V.
      </motion.div>
      <motion.div
        className="splash-progress"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.2, ease: "easeInOut" }}
      />
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

const ExperienceTimeline = () => {
  return (
    <section className="section experience-section" id="experience">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={containerVariants}
      >
        <GlitchText original="Experience & Education" as="h2" type="scramble" />
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
      </motion.div>
    </section>
  );
};

const GitHubStats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('https://api.github.com/users/BlxrryFxce17')
      .then(res => res.json())
      .then(data => {
        if (!data.message) {
          setStats({
            repos: data.public_repos,
            followers: data.followers,
            following: data.following
          });
        }
      })
      .catch(err => console.error(err));
  }, []);

  if (!stats) return null;

  return (
    <section className="section stats-section">
      <motion.div
        className="stats-container"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.5 }}
        variants={containerVariants}
      >
        <motion.div className="stat-box" variants={itemVariants}>
          <h3>{stats.repos}</h3>
          <p>Public Repos</p>
        </motion.div>
        <motion.div className="stat-box" variants={itemVariants}>
          <h3>{stats.followers}</h3>
          <p>Followers</p>
        </motion.div>
        <motion.div className="stat-box" variants={itemVariants}>
          <h3>{stats.following}</h3>
          <p>Following</p>
        </motion.div>
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

function App() {
  const { scrollY, scrollYProgress } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [overdriveCount, setOverdriveCount] = useState(0);

  // Secret Console Easter Egg
  useEffect(() => {
    console.log(
      "%cWelcome to the dark side of the web, choom.\n%cIf you're reading this, we should probably build something together.\nDrop me a line: akashvmsn@example.com", 
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

  // Body scroll lock during splash screen
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isLoading]);

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

  // Navbar hiding logic
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 50) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <>
      <CustomCursor />
      {isLoading && <SplashScreen setIsLoading={setIsLoading} />}

      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ParallaxBackground scrollYProgress={scrollYProgress} />
          {/* Floating Pill Navbar */}
          <motion.div
            className="navbar-container"
            variants={{
              visible: { y: 0, opacity: 1 },
              hidden: { y: "-150%", opacity: 0 }
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <header className="navbar">
              <div className="logo">Akash V</div>
              <nav>
                <a href="#about">About</a>
                <a href="#projects">Projects</a>
                <a href="#contact">Contact</a>
              </nav>
            </header>
          </motion.div>

          {/* Hero Section */}
          <section
            className="section hero"
            id="home"
            onMouseMove={handleHeroMouseMove}
            onMouseLeave={handleHeroMouseLeave}
            style={{ perspective: "1000px" }}
          >
            <motion.div
              className="hero-content-centered"
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {/* Floating Top Left Badge */}
              <div className="hero-floating-badge top-right">
                <strong>Full Stack Dev</strong><br />
                Software Engineer
              </div>


              {/* Floating Bottom Left Badge */}
              <div className="hero-floating-badge top-left">
                BASED IN<br />
                <strong>Mangalore, India</strong>
              </div>


              {/* Cyberpunk Neon Grid Background */}
              <div className="hero-cyber-grid"></div>

              {/* Center Intro Text */}
              <div className="hero-center-intro" style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '800px', margin: '0 auto', padding: '0 20px', marginTop: '10vh' }}>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  style={{ fontSize: '4.5rem', fontWeight: 700, marginBottom: '1.25rem', color: '#fff' }}
                >
                  Hi, I'm <GlitchText original="Akash V" className="text-electric-blue" />
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  style={{ fontSize: '1.25rem', color: '#a1a1aa', lineHeight: 1.8, marginBottom: '3rem' }}
                >
                  I build <span className="text-neon-green">full-stack web apps</span>, <span className="text-vivid-orange">machine learning projects</span>, and <span className="text-hot-pink">mobile applications</span> with a focus on clean code and <span className="text-bright-yellow">performance</span>.
                </motion.p>

                {/* Buttons positioned directly under the text */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}
                >
                  <a href="#projects" className="btn-pill dark">Projects</a>
                  <a href="/AKVSH.pdf" target="_blank" className="btn-pill light">RESUME</a>
                </motion.div>
              </div>
            </motion.div>
          </section>

          <Toolbox />

          {/* About */}
          <section className="section" id="about" style={{ padding: '8rem 0' }}>
            <ScrollRevealText text="I'm a Computer Science student based in India, focused on full-stack development, machine learning, and AI projects. I enjoy building real-world apps and solving problems with code." />
          </section>

          <ExperienceTimeline />

          <ProjectsTabs />

          <Certifications />

          {/* Contact */}
          <section className="section contact-section" id="contact">
            <motion.div
              className="contact-container"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={containerVariants}
            >
              <motion.div className="contact-content" variants={itemVariants}>
                <GlitchText original="Let's Build Something Together." as="h2" type="cssOnly" />
                <p className="contact-desc">
                  I'm currently available for freelance work and full-time opportunities. If you have a project that needs some creative magic, I'd love to hear about it.
                </p>

                <div className="contact-methods">
                  <a href="mailto:akashvmsn@example.com" className="contact-pill">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    akashvmsn@example.com
                  </a>
                  <a href="https://www.linkedin.com/in/akashv10/" target="_blank" rel="noreferrer" className="contact-pill">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                    LinkedIn
                  </a>
                </div>
              </motion.div>

              <motion.form className="contact-form" variants={itemVariants} onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                  <input type="text" id="name" placeholder=" " required />
                  <label htmlFor="name">Your Name</label>
                </div>
                <div className="form-group">
                  <input type="email" id="email" placeholder=" " required />
                  <label htmlFor="email">Email Address</label>
                </div>
                <div className="form-group">
                  <textarea id="message" rows="4" placeholder=" " required></textarea>
                  <label htmlFor="message">Message</label>
                </div>
                <button type="submit" className="btn primary submit-btn">
                  Send Message
                </button>
              </motion.form>
            </motion.div>
          </section>

          {/* Footer */}
          <footer className="footer">
            <p onClick={() => setOverdriveCount(c => c + 1)} style={{ cursor: 'pointer', userSelect: 'none' }}>
              © 2026 Akash V. All rights reserved.
            </p>
          </footer>
        </motion.div>
      )}
    </>
  );
}

export default App;








