# Portfolio Website

A modern, responsive portfolio website built with Next.js, TypeScript, TailwindCSS, and Framer Motion.

## 🚀 Features

- **Responsive Design**: Mobile-first approach with seamless desktop experience
- **Modern UI/UX**: Clean design with smooth animations and transitions
- **Dark/Light Mode**: Toggle between themes with system preference detection
- **Interactive Sections**: 
  - Hero with animated background
  - About with skills showcase
  - Projects with category filtering
  - Experience timeline
  - Skills with progress bars
  - Contact form with validation
- **Performance Optimized**: Built with Next.js for optimal loading speeds
- **SEO Friendly**: Proper meta tags and structured data

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Icons**: Heroicons (via SVG)
- **Deployment**: Ready for Vercel/Netlify

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── sections/
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── Experience.tsx
│   │   ├── Hero.tsx
│   │   ├── Projects.tsx
│   │   └── Skills.tsx
│   └── ui/
│       ├── Footer.tsx
│       ├── Navigation.tsx
│       └── ThemeToggle.tsx
└── data/
    └── portfolio.ts
```

## 🚀 Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open in browser**
   ```
   http://localhost:3000
   ```

## ✏️ Customization

### Personal Information
Edit `src/data/portfolio.ts` to update:
- Personal details (name, email, location)
- Skills and expertise levels
- Project information
- Work experience and education
- Social media links

### Styling
- **Colors**: Modify the color scheme in `tailwind.config.js`
- **Fonts**: Update font families in the config
- **Animations**: Customize Framer Motion animations in components

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Netlify
1. Build the project: `npm run build`
2. Deploy the `out` folder to Netlify

---

**Built with ❤️ using Next.js and TailwindCSS**
