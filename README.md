# Ganpat Singh - Portfolio Website

A modern, responsive portfolio website built with Next.js frontend and Node.js backend.

## 🏗️ Project Structure

This project is now organized into two separate applications:

```
portfolio-web/
├── frontend/          # Next.js application
│   ├── src/           # Source code
│   ├── public/        # Static assets
│   ├── package.json   # Frontend dependencies
│   └── README.md      # Frontend documentation
├── backend/           # Node.js API server
│   ├── src/           # Source code
│   ├── database/      # Database schema
│   ├── scripts/       # Utility scripts
│   ├── package.json   # Backend dependencies
│   └── README.md      # Backend documentation
└── README.md          # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or later
- npm or yarn package manager
- Supabase account (for database)
- Cloudinary account (for image uploads, optional)
- SMTP email account (for contact form, optional)

### 1. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables in .env
npm run migrate
npm run dev
```

The backend API will be available at `http://localhost:5000`

### 2. Setup Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Configure your environment variables in .env.local
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 📁 What's Inside?

### Frontend (`/frontend`)
- **Framework**: Next.js 15.5.2 with TypeScript
- **Styling**: Tailwind CSS
- **Features**: Responsive design, interactive components, contact form
- **Deployment**: Ready for Vercel, Netlify, or any static hosting

### Backend (`/backend`)
- **Framework**: Express.js with TypeScript
- **Database**: Supabase (PostgreSQL)
- **Features**: RESTful API, file uploads, email notifications, analytics
- **Deployment**: Ready for Railway, Heroku, or any Node.js hosting

## 🌟 Features

### Frontend Features
- ✅ Responsive design for all devices
- ✅ Interactive button functionality
- ✅ Contact form with backend integration
- ✅ Social media links
- ✅ Project showcase
- ✅ Skills and experience sections
- ✅ Mobile-optimized components

### Backend Features
- ✅ RESTful API endpoints
- ✅ Contact form handling with email notifications
- ✅ Analytics tracking
- ✅ Project management (CRUD operations)
- ✅ File upload support with Cloudinary
- ✅ Admin authentication
- ✅ Rate limiting and security measures
- ✅ Database migrations

## 🔧 Development

### Running Both Applications

For development, you'll want to run both the frontend and backend:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### Environment Configuration

Both applications require environment variables:

**Backend** (`.env`):
- Database connection (Supabase)
- Email configuration (SMTP)
- File upload service (Cloudinary)
- Admin credentials

**Frontend** (`.env.local`):
- API URL (backend endpoint)
- Public configuration values

## 🚀 Deployment

### Option 1: Separate Deployment (Recommended)

Deploy frontend and backend to different services:

**Frontend**: Vercel, Netlify, or any static host
**Backend**: Railway, Heroku, or any Node.js host

### Option 2: Same Platform

Some platforms can host both:
- Railway (monorepo support)
- Vercel (with serverless functions)
- Netlify (with serverless functions)

## 📖 Documentation

Each application has its own detailed documentation:

- **Frontend**: See `/frontend/README.md`
- **Backend**: See `/backend/README.md`

## 🔗 API Integration

The frontend communicates with the backend through RESTful API calls:

```typescript
// Example: Fetching projects
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`);
const projects = await response.json();
```

## 🎯 Key API Endpoints

- `GET /api/projects` - Get all projects
- `POST /api/contact` - Submit contact form
- `GET /api/personal-info` - Get personal information
- `POST /api/analytics/page-view` - Track page views
- Admin endpoints for content management

## 🔐 Admin Features

The backend includes admin functionality for:
- Managing projects
- Viewing contact messages
- Analytics dashboard
- Content updates

Access admin features by authenticating with configured credentials.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both frontend and backend
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For questions or issues:
1. Check the individual README files in `/frontend` and `/backend`
2. Review the environment variable examples
3. Ensure all services (Supabase, etc.) are properly configured

---

**Portfolio by Ganpat Singh** - Showcasing modern web development with separated frontend and backend architecture.

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
