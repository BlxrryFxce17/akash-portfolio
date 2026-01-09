import "./App.css";

function App() {
  return (
    <>
      {/* Navbar */}
      <header className="navbar">
        <div className="logo">Akash V</div>
        <nav>
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="hero" id="home">
        <div className="hero-content">
          <p className="tag">Full-Stack & ML Developer</p>
          <h1>Hi, I'm Akash</h1>
          <p className="hero-text">
            I build full-stack web apps, machine learning projects, and mobile
            applications.
          </p>
          <div className="hero-buttons">
            <a href="#projects" className="btn primary">
              View Projects
            </a>
            <a
              href="Akash CV.pdf"
              className="btn secondary"
              target="_blank"
              rel="noreferrer"
            >
              Download Resume
            </a>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section" id="about">
        <h2>About Me</h2>
        <p>
          I'm a Computer Science student based in India, focused on
          full-stack development, machine learning, and AI projects. I enjoy
          building real-world apps and solving problems with code.
        </p>
        <div className="skills">
          <div className="skill-group">
            <h3>Frontend</h3>
            <p>HTML, CSS, JavaScript, React, Angular</p>
          </div>
          <div className="skill-group">
            <h3>Backend</h3>
            <p>Node.js, Express, REST APIs, MongoDB / SQL</p>
          </div>
          <div className="skill-group">
            <h3>ML & Tools</h3>
            <p>Python, Hugging Face, Git, Firebase, Cloud</p>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="section" id="projects">
        <h2>Projects</h2>
        <div className="projects-grid">
          <div className="project-card">
            <h3>FilmFolks</h3>
            <p>
              A movie review platform where users can browse, review, and rate
              films with a modern UI.
            </p>
            <p className="tech">React · Node.js · MongoDB</p>
            <div className="project-links">
              <a
                href="https://github.com/BlxrryFxce17/FilmFolks"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>

          <div className="project-card">
            <h3>AI Grammar Corrector</h3>
            <p>
              A web app that uses NLP models to detect and correct grammar
              mistakes in user text.
            </p>
            <p className="tech">Python · NLP · Hugging Face</p>
            <div className="project-links">
              <a href="#" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </div>
          </div>

          <div className="project-card">
            <h3>Fake News Detection App</h3>
            <p>
              Mobile app that classifies news headlines as real or fake using
              machine learning models.
            </p>
            <p className="tech">Flutter · Python · ML</p>
            <div className="project-links">
              <a href="#" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="section" id="contact">
        <h2>Contact</h2>
        <p>
          If you want to collaborate or have an opportunity, feel free to reach
          out.
        </p>
        <div className="contact-info">
          <p>
            Email:
            <a href="mailto:akashvmsn@example.com">
              akashvmsn@example.com
            </a>
          </p>
          <p>
            GitHub:
            <a
              href="https://github.com/BlxrryFxce17"
              target="_blank"
              rel="noreferrer"
            >
              github.com/BlxrryFxce17
            </a>
          </p>
          <p>
            LinkedIn:
            <a
              href="https://www.linkedin.com/in/akashv10/"
              target="_blank"
              rel="noreferrer"
            >
              Akash V
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Akash V. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;
