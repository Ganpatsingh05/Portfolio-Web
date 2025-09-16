## Admin Dashboard (Next.js) Redesign

The legacy static `admin-dashboard.html` has been fully removed; the single source of truth is the Next.js admin panel located under `frontend/src/app/admin`.

### Features
* Secure login (`/admin/login`) using existing backend `/api/admin/login` endpoint
* Dashboard overview with project / skills / messages / views counts
* CRUD Interfaces:
   * Projects: list, create, update, delete
   * Skills: list, create, update, delete (slider for level)
   * Experiences: list, create, update, delete (multi-line -> bullet list)
* Messages viewer: filter All / Unread / Read, mark as read, subject clearly visible
* Personal info editor with resume upload (Cloudinary or local fallback) and profile metadata
* Site settings page (maintenance mode, hero text, featured sections, analytics toggle)
* Centralized auth guard component to protect all admin routes

### Environment Variable
Set `NEXT_PUBLIC_BACKEND_URL` in `frontend/.env.local` to point to the deployed backend (no trailing slash), e.g.

```
NEXT_PUBLIC_BACKEND_URL=https://portfolio-web-gsr.onrender.com
```

### Adding / Updating Admin Pages
Pages live at:
```
frontend/src/app/admin/
   login/page.tsx
   page.tsx              (Dashboard)
   projects/page.tsx
   skills/page.tsx
   experiences/page.tsx
   messages/page.tsx
   personal/page.tsx
```

Shared API client: `frontend/src/lib/admin/api.ts` centralizes authenticated fetch logic and exposes typed helpers.

### Authentication Flow
1. User logs in at `/admin/login` => stores JWT in `localStorage` under `adminToken`.
2. All admin pages are wrapped by a `RequireAuth` client component in `admin/layout.tsx` that validates token presence & expiration.
3. API errors with 401 automatically clear the token.
4. Optional redirect query param `?next=` is honored post-login.

### Site Settings
Location: `/admin/settings`

Backend endpoints:
* `GET /api/admin/settings` – fetch single settings row (returns defaults if none exists)
* `PUT /api/admin/settings` – upsert settings (fields: `maintenance_mode`, `show_analytics`, `featured_sections[]`, `hero_headline`, `hero_subheadline`)

Database table (`site_settings`):
```
id UUID PK
maintenance_mode BOOLEAN DEFAULT false
show_analytics BOOLEAN DEFAULT true
featured_sections TEXT[]
hero_headline VARCHAR(200)
hero_subheadline VARCHAR(400)
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

The UI allows:
* Toggling Maintenance Mode (can later be consumed by frontend to show a banner)
* Enabling/disabling analytics visualization
* Selecting featured sections (projects, skills, experiences, testimonials, blog)
* Custom hero headline & subheadline (optional override content)

Implementation files:
* Backend route additions in: `backend/src/routes/admin.ts` (settings GET/PUT)
* Frontend API client: `frontend/src/lib/admin/api.ts` (`settings.get()`, `settings.update()`)
* Page component: `frontend/src/app/admin/settings/page.tsx`

Future ideas:
* Add favicon / branding controls
* JSON schema-based dynamic settings rendering
* Multi-environment (draft vs published) settings

### Resume Upload
Uses `/api/admin/upload/resume` with `FormData`. If Cloudinary credentials are invalid, backend falls back to local storage and returns a public URL.

### Migration Notes
* Legacy static admin dashboard files and routes removed; Next.js admin (`/frontend/src/app/admin`) is now the sole interface.
* All admin UI uses Tailwind + React state; no Alpine.js.

### Future Enhancements (Ideas)
* Add pagination / search for messages
* Role-based multi-user admin
* Inline analytics charts (sparkline of views)
* Drag-and-drop project image upload / reordering

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
