# OnboardJS Documentation

This repository contains the official documentation website for OnboardJS, the headless React onboarding library. The documentation is built with [Next.js](https://nextjs.org/) and [Markdoc](https://markdoc.dev/).

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)

## 📖 About OnboardJS

OnboardJS is an open-source, headless onboarding framework for React and Next.js applications. It provides:

- **Headless Architecture**: Complete control over UI and styling
- **Dynamic Flow Control**: Conditional logic and branching
- **State Persistence**: localStorage and custom persistence options
- **TypeScript Support**: Full type safety out of the box
- **Plugin System**: Extensible with analytics and third-party integrations
- **Framework Agnostic Core**: Works with any React-based framework

## 🚀 Quick Start

### Prerequisites

- Node.js 22+
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Somafet/onboardjs-docs.git
cd onboardjs-docs

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the documentation site.

## 📁 Project Structure

```
onboardjs-docs/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── installation/    # Installation guide
│   │   ├── react/          # React-specific documentation
│   │   ├── nextjs/         # Next.js integration guide
│   │   ├── plugins/        # Plugin & Integration documentation
│   │   └── ui/             # UI component examples
│   ├── components/         # Reusable React components
│   │   ├── app-layout.tsx  # Main layout component
│   │   └── icons/          # SVG icon components
│   ├── lib/               # Utility functions and configurations
│   ├── markdoc/           # Markdoc configuration and tags
│   └── styles/            # Global styles and Tailwind CSS
├── public/                # Static assets
└── types.d.ts            # TypeScript type definitions
```

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Content**: [Markdoc](https://markdoc.dev/) for MDX-like documentation
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom design system
- **Typography**: [Lexend](https://fonts.google.com/specimen/Lexend) font family
- **Icons**: Custom SVG components
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Code Highlighting**: [Prism React Renderer](https://github.com/FormidableLabs/prism-react-renderer)
- **UI Components**: [Shadcn/UI Components](https://ui.shadcn.com/)

## 📝 Documentation Structure

The documentation is organized into several main sections:

### Core Documentation

- **Installation**: Getting started with OnboardJS
- **What is OnboardJS**: Core concepts and architecture
- **Defining Steps**: How to create onboarding steps
- **Onboarding Config**: Configuration options
- **Navigation & Flow**: Flow control and navigation
- **Event System**: Event handling and callbacks
- **Persistence**: State persistence options

### Framework Integration

- **React**: Using OnboardJS with React applications
- **Next.js**: Integration with Next.js projects

### Plugins

- **PostHog**: Analytics integration
- **Supabase**: Database persistence
- **Mixpanel**: Event tracking

### UI Components

- Ready-to-use components built with shadcn/ui

## 🎨 Design System

The documentation uses a custom design system built on Tailwind CSS with:

- **Colors**: Slate and Sky color palettes with dark mode support
- **Typography**: Lexend font family for improved readability
- **Components**: Consistent button, callout, and navigation components
- **Dark Mode**: System preference detection with manual toggle

## 🧩 Key Features

### Markdoc Integration

The site uses Markdoc for content authoring with custom tags:

```markdoc
{% callout title="Important Note" %}
This is a callout component for highlighting important information.
{% /callout %}

{% quick-links %}
{% quick-link title="Installation" icon="installation" href="/installation" /%}
{% /quick-links %}
```

### Interactive Examples

Code examples are syntax-highlighted and interactive:

```tsx
function WelcomeStep() {
  const { next } = useOnboarding()
  return (
    <div>
      <button onClick={() => next()}>Next</button>
    </div>
  )
}
```

### Responsive Design

Fully responsive design that works on desktop, tablet, and mobile devices.

## 🚀 Deployment

The documentation is designed to be deployed on platforms like:

- [Vercel](https://vercel.com/) (recommended)
- [Netlify](https://netlify.com/)
- Any platform supporting Next.js

### Build Commands

```bash
# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

## 🤝 Contributing

We welcome contributions to improve the documentation! Here's how you can help:

### Content Contributions

1. Fork the repository
2. Create a new branch: `git checkout -b improve-docs`
3. Make your changes to the Markdoc files in `src/app/`
4. Test locally: `npm run dev`
5. Submit a pull request

### Code Contributions

1. Follow the existing code style and patterns
2. Ensure TypeScript types are properly defined
3. Test your changes thoroughly
4. Update documentation if needed

### Reporting Issues

- Use the [GitHub Issues](https://github.com/Somafet/onboardjs/issues) to report bugs
- Provide clear reproduction steps
- Include browser and Node.js version information

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Main Library**: [OnboardJS GitHub Repository](https://github.com/Somafet/onboardjs)
- **Live Documentation**: [onboardjs.com](https://docs.onboardjs.com)
- **Live Demos**:
  - [Animated Linear.app's Demo](https://vite.onboardjs.com)
  - [Basic Demo](https://demo.onboardjs.com)
  - [Basecoat Demo](https://basecoat.onboardjs.com)
- **Discord Community**: [discord.onboardjs.com](https://discord.onboardjs.com)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [Markdoc](https://markdoc.dev/)
- Design by Tailwind UI / Tailwind Plus
- Thanks to all contributors and the open-source community

---

For questions about the documentation or OnboardJS itself, please visit our [GitHub repository](https://github.com/Somafet/onboardjs) or join our [Discord community](https://discord.onboardjs.com).
