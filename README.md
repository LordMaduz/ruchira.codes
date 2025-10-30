# Portfolio - Ruchira Rajapaksha

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.1-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.11-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

A modern, performant portfolio website showcasing professional experience, projects, and technical expertise. Built with React 19, TypeScript, and cutting-edge web technologies, featuring server-side rendering optimization, comprehensive animations, and a fully responsive design system.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Building](#building)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Code Quality](#code-quality)
- [Performance Optimizations](#performance-optimizations)
- [Contributing](#contributing)
- [License](#license)

## Overview

This portfolio application serves as a comprehensive professional showcase for Ruchira Rajapaksha, AI Solutions Architect at DBS Bank Singapore. The application demonstrates enterprise-grade front-end engineering practices, including:

- Type-safe development with TypeScript
- Component-driven architecture using React 19
- Modern state management patterns
- Progressive enhancement strategies
- SEO optimization with structured data
- Accessibility compliance (WCAG 2.1)
- Performance-first approach

## Tech Stack

### Core Technologies

- **React 19.1.1** - Latest React with enhanced concurrent features and improved server components
- **TypeScript 5.5.3** - Type-safe JavaScript with advanced type inference
- **Vite 5.4.1** - Next-generation frontend tooling with HMR and optimized builds
- **pnpm 8.10.0** - Fast, disk-efficient package manager

### UI Framework & Styling

- **Tailwind CSS 3.4.11** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible component library built on Radix UI
- **Radix UI** - Unstyled, accessible component primitives
- **Framer Motion 11.18.2** - Production-ready animation library
- **class-variance-authority** - Type-safe component variants
- **tailwind-merge** - Utility for merging Tailwind classes

### State Management & Data Fetching

- **Zustand 4.5.0** - Lightweight state management with minimal boilerplate
- **TanStack Query 5.83.0** - Powerful async state management for data fetching
- **React Hook Form 7.53.0** - Performant forms with easy validation
- **Zod 3.23.8** - TypeScript-first schema validation

### Backend & Database

- **Supabase 2.50.3** - Open-source Firebase alternative with PostgreSQL

### Routing & Navigation

- **React Router DOM 6.26.2** - Declarative routing for React applications

### Data Visualization

- **Recharts 2.12.7** - Composable charting library built on React components

### Developer Experience

- **ESLint 9.9.0** - Pluggable linting utility
- **PostCSS 8.4.47** - CSS transformations with JavaScript
- **@vitejs/plugin-react-swc** - Vite plugin using SWC for faster builds

### Additional Libraries

- **date-fns** - Modern JavaScript date utility library
- **lucide-react** - Beautiful & consistent icon toolkit
- **sonner** - Opinionated toast component
- **cmdk** - Command menu interface
- **next-themes** - Theme management with system preference detection

## Architecture

### Component Architecture

The application follows a modular component architecture:

```
src/
├── components/           # Reusable components
│   ├── ui/              # shadcn/ui primitives
│   ├── AboutSection.tsx
│   ├── SkillsSection.tsx
│   ├── ProjectsSection.tsx
│   ├── HomeSection.tsx
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   └── ThemeToggle.tsx
├── pages/               # Route components
│   ├── Index.tsx
│   └── NotFound.tsx
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── store/               # Zustand state management
├── assets/              # Static assets
└── main.tsx             # Application entry point
```

### Design Patterns

- **Compound Components**: Leveraging shadcn/ui's composable patterns
- **Render Props**: For flexible component composition
- **Custom Hooks**: Encapsulating reusable logic
- **Controlled Components**: Form inputs with React Hook Form
- **Error Boundaries**: Graceful error handling with react-error-boundary
- **Code Splitting**: Route-based lazy loading for optimal performance

## Prerequisites

- **Node.js**: >= 18.0.0 (LTS recommended)
- **pnpm**: >= 8.10.0
- **Git**: Latest version

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

2. Install dependencies using pnpm:
```bash
pnpm install
```

3. Configure environment variables (if applicable):
```bash
cp .env.example .env.local
```

Update `.env.local` with your configuration:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Development

Start the development server with hot module replacement:

```bash
pnpm dev
```

The application will be available at `http://localhost:8080`

### Development Features

- **Hot Module Replacement (HMR)**: Instant updates without losing component state
- **Fast Refresh**: React Fast Refresh for rapid development
- **TypeScript Checking**: Real-time type checking in IDE
- **ESLint Integration**: Linting errors displayed in console and IDE

## Building

### Production Build

Create an optimized production build:

```bash
pnpm build
```

Build artifacts will be generated in the `dist/` directory.

### Build Optimizations

- Tree-shaking for minimal bundle size
- Code splitting for optimal caching
- Asset optimization (images, fonts)
- CSS minification and purging
- JavaScript minification with SWC

### Preview Production Build

Preview the production build locally:

```bash
pnpm preview
```

## Deployment

### GitHub Pages

The application is configured for deployment to GitHub Pages with a base path of `/ruchira/`.

1. Build the application:
```bash
pnpm build
```

2. Deploy to GitHub Pages:
```bash
# Using gh-pages package
pnpm add -D gh-pages
pnpm exec gh-pages -d dist
```

### Other Platforms

#### Vercel

```bash
vercel --prod
```

#### Netlify

```bash
netlify deploy --prod --dir=dist
```

#### Docker

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Project Structure

```
portfolio/
├── .bsp/                    # Build Server Protocol
├── .idea/                   # IDE configuration
├── node_modules/            # Dependencies
├── public/                  # Static assets
│   ├── icon.png
│   └── robots.txt
├── src/
│   ├── assets/              # Images, fonts, etc.
│   ├── components/          # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── AboutSection.tsx
│   │   ├── Footer.tsx
│   │   ├── HomeSection.tsx
│   │   ├── Navigation.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── SkillsSection.tsx
│   │   └── ThemeToggle.tsx
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   ├── pages/               # Route components
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   ├── store/               # State management
│   ├── App.tsx              # Root component
│   ├── index.css            # Global styles
│   ├── main.tsx             # Entry point
│   └── vite-env.d.ts        # Vite type definitions
├── .gitignore
├── components.json          # shadcn/ui configuration
├── eslint.config.js         # ESLint configuration
├── index.html               # HTML template
├── package.json             # Project dependencies
├── pnpm-lock.yaml           # Lockfile
├── postcss.config.js        # PostCSS configuration
├── README.md                # This file
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
├── tsconfig.app.json        # App TypeScript config
├── tsconfig.node.json       # Node TypeScript config
└── vite.config.ts           # Vite configuration
```

## Key Features

### Responsive Design
- Mobile-first approach
- Fluid typography and spacing
- Touch-optimized interactions
- Responsive navigation patterns

### Dark Mode Support
- System preference detection
- Manual theme toggle
- Persistent theme selection
- Smooth theme transitions

### SEO Optimization
- Semantic HTML5 markup
- Open Graph meta tags
- Twitter Card integration
- Structured data (JSON-LD)
- Optimized meta descriptions
- Sitemap generation

### Accessibility
- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader optimization
- Focus management
- ARIA attributes
- Color contrast compliance

### Performance
- Code splitting and lazy loading
- Image optimization
- Font subsetting
- CSS purging
- Tree-shaking
- Efficient bundle sizes

### Animations
- Smooth page transitions
- Micro-interactions
- Scroll-based animations
- Loading states
- Skeleton screens

## Code Quality

### Linting

Run ESLint to check code quality:

```bash
pnpm lint
```

### Type Checking

Run TypeScript compiler to check types:

```bash
pnpm tsc --noEmit
```

### Code Formatting

Configure your IDE to use the project's ESLint and TypeScript configurations.

### Git Hooks (Recommended)

Install husky for pre-commit hooks:

```bash
pnpm add -D husky lint-staged
npx husky install
```

`.husky/pre-commit`:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm lint-staged
```

`package.json`:
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

## Performance Optimizations

### Build Time Optimizations

- **SWC Compiler**: Using `@vitejs/plugin-react-swc` for faster builds
- **pnpm**: Efficient package installation and disk usage
- **Vite**: Lightning-fast HMR and optimized builds

### Runtime Optimizations

- **React 19 Features**: Utilizing concurrent rendering
- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: Lazy loading and responsive images
- **CSS Purging**: Removing unused Tailwind classes
- **Bundle Analysis**: Regular bundle size monitoring

### Lighthouse Scores Target

- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

## Contributing

### Development Workflow

1. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes following the code style
3. Test your changes thoroughly
4. Commit with descriptive messages:
```bash
git commit -m "feat: add new feature"
```

5. Push and create a pull request

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding tests
- `chore:` - Maintenance tasks

## License

This project is private and proprietary. All rights reserved.

---

**Built with passion by Ruchira Rajapaksha**

For questions or collaboration opportunities, please visit the contact section of the portfolio.
