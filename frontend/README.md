# Portfolio Frontend

This is the frontend application for Ganpat Singh's portfolio website built with Next.js 15.

## Features

- Modern responsive design
- Interactive UI components
- Mobile-optimized experience
- Contact form integration
- Social media links
- Project showcase
- Skills and experience sections

## Tech Stack

- **Framework**: Next.js 15.5.2
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Development**: Turbopack (dev server)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env.local
```

3. Configure environment variables in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── layout/         # Layout components
│   ├── mobile/         # Mobile-specific components
│   └── sections/       # Page sections
├── lib/               # Utilities and configurations
└── utils/             # Helper functions
```

## Key Components

- **Hero Section**: Main landing area with introduction
- **About Section**: Personal information and bio
- **Skills Section**: Technical skills showcase
- **Projects Section**: Portfolio projects
- **Contact Section**: Contact form and information
- **Mobile Components**: Mobile-optimized versions

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify

1. Build the application: `npm run build`
2. Upload the `out` folder to Netlify
3. Configure environment variables in Netlify dashboard

### Manual Deployment

1. Build the application: `npm run build`
2. Upload the generated files to your hosting provider
3. Configure your web server to serve the static files

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
