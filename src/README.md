# Memarzade.Dev - Full-Stack Developer Portfolio

> A professional personal website showcasing Ali Memarzade's work as a Full-Stack Developer with AWWWARDS-level design and advanced features.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2+-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)

## ✨ Features

### 🎨 Design
- **AWWWARDS-Level UI** - Professional, modern design
- **Dark/Light Themes** - User preference support with system detection
- **Responsive** - Mobile → Tablet → Desktop → Ultra-wide
- **RTL/LTR Support** - Automatic language detection for Persian/Arabic
- **Smooth Animations** - Motion (Framer Motion) powered transitions
- **Custom Cursor** - Animated cursor effect (desktop only)

### 📝 Content
- **Blog System** - Full-featured blog with Markdown support
- **Project Showcase** - Detailed case studies with metrics
- **Syntax Highlighting** - Code blocks with GitHub Dark theme
- **Math Equations** - KaTeX support for mathematical notation
- **Rich Markdown** - GFM + Obsidian callouts, tables, task lists
- **Copy Code** - One-click code copying

### 🎯 User Experience
- **Fast Search** - Full-text search with keyboard shortcut (⌘K)
- **Table of Contents** - Auto-generated with scroll spy
- **Progress Bar** - Reading progress indicator
- **Reading Mode** - Distraction-free reading experience
- **Share Buttons** - Social sharing on all platforms
- **View Counter** - Track content popularity
- **Back to Top** - Smooth scroll to top button

### ♿ Accessibility
- **WCAG 2.1 AA** - Full accessibility compliance
- **Keyboard Navigation** - All features keyboard accessible
- **Screen Reader** - Optimized for assistive technologies
- **ARIA Labels** - Proper semantic HTML
- **Focus Indicators** - Clear visual focus states

### 🔍 SEO
- **Meta Tags** - Dynamic SEO optimization
- **Open Graph** - Rich social media previews
- **Twitter Cards** - Enhanced Twitter sharing
- **Structured Data** - JSON-LD schema markup
- **Canonical URLs** - Proper URL management
- **Sitemap Ready** - SEO-friendly structure

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/memarzade-dev.git

# Navigate to the project
cd memarzade-dev

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see your site!

## 📦 Project Structure

```
src/
├── components/        # Reusable React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── MarkdownRenderer.tsx
│   ├── SearchModal.tsx
│   ├── ShareButtons.tsx
│   ├── AnimatedCursor.tsx
│   ├── BackToTop.tsx
│   └── ...
├── pages/            # Page components
│   ├── HomePage.tsx
│   ├── BlogList.tsx
│   ├── BlogPost.tsx
│   ├── ProjectsList.tsx
│   ├── ProjectDetail.tsx
│   └── NotFound.tsx
├── utils/            # Utility functions
│   └── rtlDetect.ts
├── data/             # Content (Markdown files)
│   ├── posts/
│   │   ├── getting-started-with-react-18.md
│   │   ├── mastering-typescript.md
│   │   └── building-scalable-apis.md
│   └── projects/
│       ├── ecommerce-platform.md
│       └── ai-analytics-dashboard.md
├── styles/           # Global styles
│   └── globals.css
├── App.tsx           # Main app component
└── main.tsx          # Entry point
```

## 🎨 Adding Content

### Create a New Blog Post

1. Create a new `.md` file in `/data/posts/`
2. Write your content in Markdown
3. The file will automatically appear in the blog list

**Example:**

```markdown
# My Awesome Post

This is my blog post content with **bold** and *italic* text.

## Code Example

\`\`\`typescript
function hello(name: string): string {
  return `Hello, ${name}!`;
}
\`\`\`

## Math

$$E = mc^2$$

[!tip]
This is a helpful tip!
```

### Create a New Project

1. Create a new `.md` file in `/data/projects/`
2. Add your project documentation
3. Update the `projects` object in `ProjectDetail.tsx` with metadata

## 🛠️ Tech Stack

### Core
- **React** 18.2.0 - UI library
- **TypeScript** 5.2+ - Type safety
- **React Router** 6.20+ - Routing
- **Tailwind CSS** 4.0 - Styling
- **Vite** - Build tool

### Libraries
- **Motion** (Framer Motion) - Animations
- **Lucide React** - Icons
- **React Markdown** - Markdown parsing
- **KaTeX** - Math equations
- **Highlight.js** - Syntax highlighting
- **Recharts** - Data visualization

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 640px)

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px)

/* Desktop */
@media (min-width: 1025px) and (max-width: 1920px)

/* Ultra-wide */
@media (min-width: 1921px)
```

## 🎯 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Build command
npm run build

# Publish directory
dist
```

### GitHub Pages

```bash
# Build
npm run build

# Deploy to gh-pages branch
npm run deploy
```

## ⚙️ Configuration

### Theme Colors

Edit `/styles/globals.css`:

```css
:root {
  --color-primary: 99 102 241;      /* Indigo */
  --color-secondary: 168 85 247;    /* Purple */
  --color-accent: 59 130 246;       /* Blue */
}
```

### Fonts

Edit the Google Fonts import in `/styles/globals.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
```

### Site Metadata

Edit `/components/SEO.tsx`:

```typescript
const defaultMeta = {
  title: 'Memarzade.Dev - Full-Stack Developer',
  description: 'Your custom description',
  url: 'https://vaults.memarzade.dev',
  image: '/og-image.jpg',
};
```

## 🎨 Customization

### Change Primary Color

```css
/* globals.css */
:root {
  --color-primary: 59 130 246; /* Your RGB color */
}
```

### Add New Page

1. Create component in `/pages/`
2. Add route in `App.tsx`:

```typescript
<Route path="/your-page" element={<YourPage />} />
```

3. Add navigation link in `Header.tsx`

### Custom Component

```typescript
// /components/MyComponent.tsx
import { motion } from 'motion/react';

export function MyComponent() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 bg-[rgb(var(--color-bg-subtle))] rounded-lg"
    >
      Your content here
    </motion.div>
  );
}
```

## 📊 Performance

### Lighthouse Scores
- Performance: 95+
- Accessibility: 100
- Best Practices: 95+
- SEO: 100

### Optimizations
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Image optimization
- ✅ Minimal bundle size
- ✅ CDN for external resources

## ♿ Accessibility

This site follows WCAG 2.1 AA standards:

- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ ARIA labels
- ✅ Color contrast ratios
- ✅ Focus indicators
- ✅ Semantic HTML

## 🔒 Security

- ✅ No inline scripts
- ✅ CSP headers recommended
- ✅ XSS protection
- ✅ Secure dependencies
- ✅ Regular updates

## 🧪 Testing

```bash
# Run tests (if configured)
npm test

# E2E tests (if configured)
npm run test:e2e

# Accessibility tests
npm run test:a11y
```

## 📄 License

MIT License - feel free to use this project for your own portfolio!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

Ali Memarzade
- Website: [vaults.memarzade.dev](https://vaults.memarzade.dev)
- Email: ali@memarzade.dev
- GitHub: [@memarzade-dev](https://github.com/memarzade-dev)
- LinkedIn: [Ali Memarzade](https://linkedin.com/in/memarzade)
- Twitter: [@memarzade_dev](https://twitter.com/memarzade_dev)

## 🙏 Acknowledgments

- [React](https://react.dev) - UI library
- [Tailwind CSS](https://tailwindcss.com) - CSS framework
- [Motion](https://motion.dev) - Animation library
- [Lucide](https://lucide.dev) - Icon library
- [Unsplash](https://unsplash.com) - Stock photos

---

**Made with ❤️ by Ali Memarzade**  
**Last Updated**: December 4, 2025  
**Version**: 1.0.0

---

## 🎯 Keyboard Shortcuts

- `⌘/Ctrl + K` - Open search
- `Esc` - Close modals
- `Tab` - Navigate between elements
- `Space` - Scroll page
- `Home` - Scroll to top
- `End` - Scroll to bottom

## 🎨 Design System

### Colors
- Primary: Indigo (#6366F1)
- Secondary: Purple (#A855F7)
- Accent: Blue (#3B82F6)
- Success: Green (#22C55E)
- Warning: Orange (#FB923C)
- Error: Red (#EF4444)

### Typography
- Heading: Space Grotesk
- Body: Space Grotesk
- Code: Roboto Mono
- Persian/Arabic: Vazirmatn

### Spacing Scale
```
4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px
```

### Border Radius
- sm: 0.5rem (8px)
- md: 0.75rem (12px)
- lg: 1rem (16px)
- xl: 1.5rem (24px)

## 🚀 Future Roadmap

- [ ] CMS integration (Contentful/Sanity)
- [ ] Comment system
- [ ] Newsletter subscription
- [ ] Contact form
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] PWA features
- [ ] Blog categories
- [ ] Related posts
- [ ] Author profiles
- [ ] Series/collections

---

**⭐ If you found this project helpful, please give it a star!**
