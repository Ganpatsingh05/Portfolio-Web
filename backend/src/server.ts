import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';

// Import routes
import projectsRouter from './routes/projects';
import contactRouter from './routes/contact';
import analyticsRouter from './routes/analytics';
import personalInfoRouter from './routes/personal-info';
import adminRouter from './routes/admin';
import uploadsRouter from './routes/uploads';

// Load environment variables
dotenv.config();

const app = express();
// Trust proxy for correct IP/proto behind reverse proxies (Render/NGINX/Cloudflare)
app.set('trust proxy', true);
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    if (process.env.NODE_ENV !== 'production') return callback(null, true);
    const allowed = (process.env.CORS_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
    if (!origin) return callback(null, true); // Allow non-browser clients
    if (allowed.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve admin dashboard at a discreet path (/gdash) without exposing a link
app.get('/gdash', (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, '../../admin-dashboard.html'));
});
// Serve its CSS (linked relatively as /admin.css or we can reference /gdash.css; keep simple)
app.get('/gdash.css', (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, '../../admin.css'));
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// API routes
app.use('/api/projects', projectsRouter);
app.use('/api/contact', contactRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/personal-info', personalInfoRouter);
app.use('/api/admin', adminRouter);
app.use('/api/uploads', uploadsRouter);

// Default route
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Portfolio Backend API',
    version: '1.0.0',
    docs: '/api/docs'
  });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  
  if (err.status === 404) {
    return res.status(404).json({ error: 'Resource not found' });
  }
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`🔗 API URL: http://localhost:${PORT}`);
  }
});

export default app;
