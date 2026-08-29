# ⚡ Akash V // Digital Portfolio

[![Live Site](https://img.shields.io/badge/Live-Site-00fff5?style=for-the-badge&logo=vercel&logoColor=black)](https://akash-portfolio-psi-five.vercel.app/)

A highly-interactive, cyberpunk-inspired personal portfolio designed to showcase projects, experience, and certifications. Built with modern web technologies, it features smooth physics-based animations, dynamic custom cursors, and hidden easter eggs.

## ✨ Features

- **Cyberpunk Aesthetic**: High-contrast dark mode, electric blue accents, and subtle chromatic aberration effects.
- **Physics-Based Interactions**: Uses Framer Motion for liquid-smooth hover states and a custom cursor.
- **Interactive Gallery**: A dynamic masonry grid for certifications and beautifully displayed project cards.
- **Hidden Easter Eggs**: Keep an eye out for text glitches and try clicking the footer 5 times for "Overdrive Mode."
- **Performance Optimized**: Migrated to Vite for lightning-fast HMR and optimized production builds.

## 🛠️ Tech Stack

- **Framework**: React.js
- **Build Tool**: Vite
- **Animations**: Framer Motion
- **Styling**: Vanilla CSS3 (with CSS variables for theming)
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/BlxrryFxce17/akash-portfolio.git
cd akash-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to see the app.

### Production Build

To generate a production-ready bundle:
```bash
npm run build
```
The optimized files will be output to the `/dist` directory.

## 📂 Project Structure

```text
akash-portfolio/
├── public/                 # Static assets (images, PDFs, certificates)
├── src/
│   ├── components/         # Reusable UI components (Certifications, etc.)
│   ├── App.jsx             # Main application logic and routing
│   ├── App.css             # Global styles and cyberpunk theme variables
│   ├── index.css           # Base styles
│   └── index.jsx           # Application entry point
├── vercel.json             # Vercel deployment configuration
├── vite.config.js          # Vite configuration
└── package.json            # Project metadata and dependencies
```

## 📜 License

This project is open source and available under the MIT License.

---

*Built with ❤️ and a lot of caffeine by [Akash V](https://github.com/BlxrryFxce17)*
