# Portfolio Customization Guide

## 🎯 Quick Start Customization

### 1. Personal Information
Edit `src/data/portfolio.ts` to update your personal details:

```typescript
export const personalInfo = {
  name: "Your Name",
  title: "Your Professional Title",
  email: "your.email@example.com",
  location: "Your City, Country",
  github: "https://github.com/yourusername",
  linkedin: "https://linkedin.com/in/yourusername",
  twitter: "https://twitter.com/yourusername",
  resume: "/resume.pdf"
}
```

### 2. About Section
Update your bio and education:

```typescript
export const about = {
  description: `Your personal introduction...`,
  journey: `Your professional journey...`,
  education: {
    degree: "Your Degree",
    university: "Your University",
    period: "2020-2024"
  }
}
```

### 3. Skills
Customize your technical skills:

```typescript
export const skills = [
  { name: 'React/Next.js', level: 90, category: 'frontend' },
  { name: 'Python', level: 85, category: 'backend' },
  // Add more skills...
]
```

### 4. Projects
Add your projects:

```typescript
export const projects = [
  {
    id: 1,
    title: "Project Name",
    description: "Project description...",
    technologies: ["React", "Node.js"],
    category: "Web Dev",
    github: "https://github.com/...",
    demo: "https://demo-url.com"
  }
  // Add more projects...
]
```

### 5. Experience
Update work and education history:

```typescript
export const experiences = [
  {
    title: "Job Title",
    company: "Company Name",
    period: "Jan 2023 - Present",
    description: ["Achievement 1", "Achievement 2"],
    type: "experience"
  }
  // Add more experiences...
]
```

## 🎨 Design Customization

### Colors
Edit `tailwind.config.js` to change the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#f0f9ff',
        500: '#3b82f6',
        600: '#2563eb',
        // Your custom colors
      }
    }
  }
}
```

### Fonts
Update fonts in `src/app/layout.tsx`:

```typescript
import { Inter, Poppins } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
```

### Hero Section
Customize the hero background in `src/components/sections/Hero.tsx`:

```typescript
// Change gradient colors
className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"
```

## 📱 Component Customization

### Navigation
Edit `src/components/ui/Navigation.tsx` to modify menu items:

```typescript
const navItems = [
  { name: 'Home', href: '#' },
  { name: 'About', href: '#about' },
  // Add or remove items
]
```

### Social Links
Update social media links in `src/components/ui/SocialLinks.tsx`:

```typescript
const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/yourusername',
    icon: // SVG icon
  }
  // Add more social links
]
```

## 🖼️ Images and Assets

### Profile Images
Add your profile pictures to the `public` folder:
- `public/profile.jpg`
- `public/hero-bg.jpg`

### Project Images
Add project screenshots to `public/projects/`:
- `public/projects/project1.jpg`
- `public/projects/project2.jpg`

### Resume
Add your resume PDF to `public/resume.pdf`

## 🌐 SEO Optimization

### Meta Tags
Update metadata in `src/app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: "Your Name - Portfolio",
  description: "Your professional description",
  keywords: ["Your", "Skills", "Keywords"],
  // Update other meta tags
}
```

### Sitemap
Update URLs in `src/app/sitemap.ts`:

```typescript
return [
  {
    url: 'https://yourdomain.com',
    lastModified: new Date(),
    priority: 1,
  }
]
```

## 🚀 Animation Customization

### Framer Motion
Customize animations in components:

```typescript
// Change animation duration
transition={{ duration: 1.2 }}

// Change animation type
initial={{ opacity: 0, scale: 0.8 }}
animate={{ opacity: 1, scale: 1 }}

// Add custom keyframes
animate={{
  y: [0, -10, 0],
  transition: { repeat: Infinity, duration: 2 }
}}
```

### CSS Animations
Add custom CSS animations in `src/app/globals.css`:

```css
@keyframes customAnimation {
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
}

.custom-animation {
  animation: customAnimation 2s infinite;
}
```

## 📧 Contact Form Setup

### EmailJS Integration
1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Create a service and template
3. Add environment variables to `.env.local`:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

4. Update the contact form in `src/components/sections/Contact.tsx`

## 🔧 Advanced Customization

### Dark Mode
Customize dark mode colors in your components:

```typescript
className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
```

### Responsive Design
Adjust breakpoints in Tailwind classes:

```typescript
className="text-lg md:text-xl lg:text-2xl xl:text-3xl"
```

### Custom Components
Create new components in `src/components/`:

```typescript
// src/components/ui/CustomButton.tsx
export default function CustomButton({ children, ...props }) {
  return (
    <button className="your-custom-styles" {...props}>
      {children}
    </button>
  )
}
```

## 🛠️ Development Tips

### Hot Reload
Use the development server for live updates:
```bash
npm run dev
```

### Building for Production
Test your production build:
```bash
npm run build
npm run start
```

### Linting
Keep your code clean:
```bash
npm run lint
```

## 📊 Performance Optimization

### Image Optimization
Use Next.js Image component:

```typescript
import Image from 'next/image'

<Image
  src="/your-image.jpg"
  alt="Description"
  width={500}
  height={300}
  priority
/>
```

### Code Splitting
Use dynamic imports for large components:

```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>
})
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import repository in Vercel
3. Deploy automatically

### Custom Domain
Add your domain in Vercel dashboard or hosting provider

## 📝 Content Management

### Blog Integration (Optional)
Add a blog section using:
- MDX for markdown content
- Contentful for headless CMS
- Sanity for structured content

### Portfolio Updates
Regularly update:
- Project information
- Skills and certifications
- Work experience
- Contact information

---

Happy customizing! 🎉
