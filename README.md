# AI Code Review Application

![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![Monaco Editor](https://img.shields.io/badge/Monaco-Editor-blue?style=flat-square)

A modern, AI-powered code review application built with Next.js 15, TypeScript, and Tailwind CSS. Features real-time code analysis, interactive suggestions, and a beautiful UI with dark mode support.

## ✨ Features

### 🎨 Modern UI/UX
- **Beautiful Gradient Design**: Purple-pink gradient themes throughout the application
- **Dark Mode Support**: Seamless theme switching with next-themes
- **Responsive Layout**: 3-tier responsive design (mobile, tablet, desktop)
- **Smooth Animations**: Custom animations and transitions for better user experience

### 📝 Code Editor
- **Monaco Editor Integration**: Full-featured code editor with syntax highlighting
- **Language Auto-detection**: Automatically detects programming language
- **Real-time Suggestions**: Inline decorations for code suggestions
- **Keyboard Shortcuts**: Navigate suggestions with j/k keys
- **Code Input Editor**: Monaco editor for initial code input

### 🔍 Code Review Features
- **Multiple Review Styles**:
  - Detailed Review: Comprehensive analysis
  - Bug Hunt: Focus on potential bugs
  - Refactoring: Code structure improvements
  - Test Coverage: Testing suggestions
- **Real-time Streaming**: Simulated streaming of AI suggestions
- **Suggestion Management**:
  - Accept/Reject individual suggestions
  - Expandable/Collapsible cards
  - Severity levels (Critical, Major, Minor, Info)
  - Filter by severity, status, and tags

### 🎯 Technical Features
- **State Management**: Zustand for global state
- **Performance Optimized**: Virtual scrolling for large suggestion lists
- **Diff Visualization**: Side-by-side diff view with diff2html
- **Type Safety**: Full TypeScript support with strict typing
- **Component Library**: shadcn/ui components with Radix UI

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd code-review-app
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
code-review-app/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with theme provider
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles and animations
│   └── reviews/
│       └── [id]/
│           └── page.tsx   # Dynamic review page
├── components/
│   ├── editor/
│   │   ├── CodeEditor.tsx        # Main code editor
│   │   ├── CodeInputEditor.tsx   # Input editor for homepage
│   │   └── DiffPanel.tsx         # Diff visualization
│   ├── review/
│   │   ├── ReviewStartForm.tsx   # Main form component
│   │   ├── SuggestionCard.tsx    # Individual suggestion card
│   │   ├── SuggestionList.tsx    # Virtual scroll list
│   │   ├── SuggestionListSimple.tsx # Simple scroll list
│   │   └── FilterChips.tsx       # Filter UI components
│   ├── ui/                       # shadcn/ui components
│   │   └── theme-toggle.tsx      # Dark mode toggle
│   └── providers/
│       └── theme-provider.tsx    # Next-themes provider
├── lib/
│   ├── store/
│   │   ├── reviewStore.ts        # Review state management
│   │   └── editorStore.ts        # Editor state management
│   └── utils/
│       ├── mockData.ts           # Mock data generators
│       └── utils.ts              # Utility functions
├── types/
│   ├── review.types.ts           # Review type definitions
│   └── editor.types.ts           # Editor type definitions
└── docs/
    └── prd.md                     # Product requirements

```

## 🎨 Customization

### Color Scheme
The application uses a vibrant color scheme with OKLCH color space for better color accuracy. Colors can be customized in:
- `/app/globals.css` - CSS variables for theming
- `/tailwind.config.ts` - Tailwind configuration

### Key Color Variables:
```css
--primary: oklch(0.55 0.25 265);     /* Purple */
--secondary: oklch(0.7 0.15 290);    /* Purple-Pink */
--accent: oklch(0.65 0.2 320);       /* Pink */
```

### Animations
Custom animations are defined in both:
- `/app/globals.css` - CSS animations (fadeInUp, blob, gradient, float, glow)
- `/tailwind.config.ts` - Tailwind animations (shimmer, shine, pulse)

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with Turbopack
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Code Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Icons**: [Lucide Icons](https://lucide.dev/)
- **Diff Viewer**: [diff2html](https://diff2html.xyz/)
- **Syntax Highlighting**: [Shiki](https://shiki.matsu.io/)

## 📝 Available Scripts

```bash
# Development
pnpm dev          # Start development server with Turbopack

# Build
pnpm build        # Build for production
pnpm start        # Start production server

# Linting
pnpm lint         # Run ESLint
pnpm typecheck    # Run TypeScript type checking
```

## 🎯 Features Roadmap

- [ ] Real AI integration for code review
- [ ] User authentication and project management
- [ ] Export review results (PDF, Markdown)
- [ ] Integration with Git providers (GitHub, GitLab)
- [ ] Collaborative review features
- [ ] Custom review rules and configurations
- [ ] Performance metrics and analytics

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👥 Author

Created by **ziyoonee**

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS