# Prism React Prototype Template

A React prototype template built with the DoorDash Prism design system.

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **@doordash/prism-react** - DoorDash design system components
- **React Router** - Client-side routing
- **styled-components** - CSS-in-JS styling
- **Framer Motion** - Animations

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

### Linting

Run ESLint to check for code issues:

```bash
npm run lint
```

## Project Structure

```
├── src/
│   ├── main.tsx        # App entry point
│   ├── App.tsx         # Root component with routing
│   └── pages/          # Page components
│       └── Home.tsx    # Home page
├── index.html          # HTML template
├── vite.config.ts      # Vite configuration
└── tsconfig.json       # TypeScript configuration
```
