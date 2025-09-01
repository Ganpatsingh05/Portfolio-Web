import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import supabase from '../lib/supabase';

const router = Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for resume uploads (PDF files)
const resumeUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for resumes
  },
  fileFilter: (req: Request, file: any, cb: any) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for resume!'));
    }
  },
});

// Admin authentication middleware
const authenticateAdmin = (req: Request, res: Response, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ganpat_portfolio_super_secret_key_2024');
    (req as any).adminUser = decoded; // Store admin info separately, not in req.body
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Admin login
router.post('/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'GanpatPortfolio2024!';

    if (username !== adminUsername || password !== adminPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { username, role: 'admin' },
      process.env.JWT_SECRET || 'ganpat_portfolio_super_secret_key_2024',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: { username, role: 'admin' },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get dashboard stats
router.get('/dashboard', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    // Get counts from all tables
    const [projectsResult, skillsResult, messagesResult, analyticsResult] = await Promise.all([
      supabase.from('projects').select('id', { count: 'exact' }),
      supabase.from('skills').select('id', { count: 'exact' }),
      supabase.from('contact_messages').select('id', { count: 'exact' }),
      supabase.from('analytics').select('id', { count: 'exact' })
    ]);

    // Get recent messages
    const { data: recentMessages } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    // Get page views for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: recentViews } = await supabase
      .from('analytics')
      .select('*')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: false });

    res.json({
      stats: {
        projects: projectsResult.count || 0,
        skills: skillsResult.count || 0,
        messages: messagesResult.count || 0,
        pageViews: analyticsResult.count || 0
      },
      recentMessages: recentMessages || [],
      recentViews: recentViews || []
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Update personal info
router.put('/personal-info', authenticateAdmin, [
  body('name').optional().notEmpty(),
  body('title').optional().notEmpty(),
  body('email').optional().isEmail(),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Get the first record ID
    const { data: existingData } = await supabase
      .from('personal_info')
      .select('id')
      .limit(1)
      .single();

    if (!existingData) {
      return res.status(404).json({ error: 'Personal info not found' });
    }

    // Extract only valid personal info fields
    const {
      name,
      title,
      email,
      phone,
      location,
      bio,
      linkedin_url,
      github_url,
      twitter_url,
      website_url,
      resume_url,
      profile_image_url
    } = req.body;

    const updateData = {
      name,
      title,
      email,
      phone,
      location,
      bio,
      linkedin_url,
      github_url,
      twitter_url,
      website_url,
      resume_url,
      profile_image_url,
      updated_at: new Date().toISOString()
    };

    const { data: personalInfo, error } = await supabase
      .from('personal_info')
      .update(updateData)
      .eq('id', existingData.id)
      .select()
      .single();

    if (error) throw error;

    res.json(personalInfo);
  } catch (error) {
    console.error('Update personal info error:', error);
    res.status(500).json({ error: 'Failed to update personal information' });
  }
});

// Manage projects
router.post('/projects', authenticateAdmin, [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract only valid project fields
    const {
      title,
      description,
      image_url,
      category,
      technologies,
      demo_url,
      github_url,
      featured,
      status,
      sort_order,
      start_date,
      end_date
    } = req.body;

    const projectData = {
      title,
      description,
      image_url,
      category,
      technologies: Array.isArray(technologies) ? technologies : (technologies ? technologies.split(',').map((t: string) => t.trim()) : []),
      demo_url,
      github_url,
      featured: featured || false,
      status: status || 'completed',
      sort_order: sort_order || 0,
      start_date,
      end_date
    };

    const { data: project, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

router.put('/projects/:id', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Extract only valid project fields
    const {
      title,
      description,
      image_url,
      category,
      technologies,
      demo_url,
      github_url,
      featured,
      status,
      sort_order,
      start_date,
      end_date
    } = req.body;

    const updateData = {
      title,
      description,
      image_url,
      category,
      technologies: Array.isArray(technologies) ? technologies : (technologies ? technologies.split(',').map((t: string) => t.trim()) : []),
      demo_url,
      github_url,
      featured,
      status,
      sort_order,
      start_date,
      end_date,
      updated_at: new Date().toISOString()
    };

    const { data: project, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

router.delete('/projects/:id', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Manage skills
router.post('/skills', authenticateAdmin, [
  body('name').notEmpty().withMessage('Skill name is required'),
  body('level').isInt({ min: 0, max: 100 }).withMessage('Level must be between 0-100'),
  body('category').notEmpty().withMessage('Category is required'),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract only valid skill fields
    const {
      name,
      level,
      category,
      icon_name,
      sort_order,
      is_featured
    } = req.body;

    const skillData = {
      name,
      level: parseInt(level),
      category,
      icon_name,
      sort_order: sort_order || 0,
      is_featured: is_featured || false
    };

    const { data: skill, error } = await supabase
      .from('skills')
      .insert([skillData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(skill);
  } catch (error) {
    console.error('Create skill error:', error);
    res.status(500).json({ error: 'Failed to create skill' });
  }
});

router.put('/skills/:id', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Extract only valid skill fields
    const {
      name,
      level,
      category,
      icon_name,
      sort_order,
      is_featured
    } = req.body;

    const updateData = {
      name,
      level: parseInt(level),
      category,
      icon_name,
      sort_order,
      is_featured,
      updated_at: new Date().toISOString()
    };

    const { data: skill, error } = await supabase
      .from('skills')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(skill);
  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({ error: 'Failed to update skill' });
  }
});

router.delete('/skills/:id', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

// Get all contact messages
router.get('/messages', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const { data: messages, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(messages);
  } catch (error) {
    console.error('Fetch messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Mark message as read
router.put('/messages/:id/read', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data: message, error } = await supabase
      .from('contact_messages')
      .update({ is_read: true, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(message);
  } catch (error) {
    console.error('Mark message read error:', error);
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
});

// ==================== SKILLS MANAGEMENT ====================

// Get all skills
router.get('/skills', async (req: Request, res: Response) => {
  try {
    const { data: skills, error } = await supabase
      .from('skills')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    res.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

// Create skill
router.post('/skills', [
  body('name').notEmpty().withMessage('Skill name is required'),
  body('level').isInt({ min: 0, max: 100 }).withMessage('Level must be between 0 and 100'),
  body('category').notEmpty().withMessage('Category is required'),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { data: skill, error } = await supabase
      .from('skills')
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(skill);
  } catch (error) {
    console.error('Error creating skill:', error);
    res.status(500).json({ error: 'Failed to create skill' });
  }
});

// Update skill
router.put('/skills/:id', [
  body('name').optional().notEmpty(),
  body('level').optional().isInt({ min: 0, max: 100 }),
  body('category').optional().notEmpty(),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Filter out JWT-related fields if they exist
    const filteredData = Object.fromEntries(
      Object.entries(updateData).filter(([key]) => 
        !['iat', 'exp', 'sub', 'aud', 'iss'].includes(key)
      )
    );

    const { data: skill, error } = await supabase
      .from('skills')
      .update(filteredData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(skill);
  } catch (error) {
    console.error('Error updating skill:', error);
    res.status(500).json({ error: 'Failed to update skill' });
  }
});

// Delete skill
router.delete('/skills/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

// ==================== EXPERIENCES MANAGEMENT ====================

// Get all experiences
router.get('/experiences', async (req: Request, res: Response) => {
  try {
    const { data: experiences, error } = await supabase
      .from('experiences')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) throw error;
    
    // Convert description array to string for frontend
    const processedExperiences = experiences?.map(experience => ({
      ...experience,
      description: Array.isArray(experience.description) 
        ? experience.description.join('\n') 
        : experience.description || ''
    }));
    
    res.json(processedExperiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({ error: 'Failed to fetch experiences' });
  }
});

// Create experience
router.post('/experiences', [
  body('title').notEmpty().withMessage('Title is required'),
  body('company').notEmpty().withMessage('Company is required'),
  body('period').notEmpty().withMessage('Period is required'),
  body('type').isIn(['experience', 'education']).withMessage('Type must be experience or education'),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Process the description field to convert string to array if needed
    const experienceData = { ...req.body };
    if (experienceData.description && typeof experienceData.description === 'string') {
      // Split description by newlines and filter out empty lines
      experienceData.description = experienceData.description
        .split('\n')
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0);
    }

    const { data: experience, error } = await supabase
      .from('experiences')
      .insert([experienceData])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(experience);
  } catch (error) {
    console.error('Error creating experience:', error);
    res.status(500).json({ error: 'Failed to create experience' });
  }
});

// Update experience
router.put('/experiences/:id', [
  body('title').optional().notEmpty(),
  body('company').optional().notEmpty(),
  body('period').optional().notEmpty(),
  body('type').optional().isIn(['experience', 'education']),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Filter out JWT-related fields if they exist
    const filteredData = Object.fromEntries(
      Object.entries(updateData).filter(([key]) => 
        !['iat', 'exp', 'sub', 'aud', 'iss'].includes(key)
      )
    );

    // Process the description field to convert string to array if needed
    if (filteredData.description && typeof filteredData.description === 'string') {
      filteredData.description = filteredData.description
        .split('\n')
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0);
    }

    const { data: experience, error } = await supabase
      .from('experiences')
      .update(filteredData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(experience);
  } catch (error) {
    console.error('Error updating experience:', error);
    res.status(500).json({ error: 'Failed to update experience' });
  }
});

// Delete experience
router.delete('/experiences/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Error deleting experience:', error);
    res.status(500).json({ error: 'Failed to delete experience' });
  }
});

// ==================== PERSONAL INFO MANAGEMENT ====================

// Get personal info
router.get('/personal-info', async (req: Request, res: Response) => {
  try {
    const { data: personalInfo, error } = await supabase
      .from('personal_info')
      .select('*')
      .limit(1)
      .single();

    if (error) throw error;
    res.json(personalInfo);
  } catch (error) {
    console.error('Error fetching personal info:', error);
    res.status(500).json({ error: 'Failed to fetch personal information' });
  }
});

// Update personal info
router.put('/personal-info', [
  body('name').optional().notEmpty(),
  body('title').optional().notEmpty(),
  body('email').optional().isEmail(),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updateData = req.body;

    // Filter out JWT-related fields if they exist
    const filteredData = Object.fromEntries(
      Object.entries(updateData).filter(([key]) => 
        !['iat', 'exp', 'sub', 'aud', 'iss'].includes(key)
      )
    );

    // Get existing personal info to determine if we should update or create
    const { data: existingInfo } = await supabase
      .from('personal_info')
      .select('id')
      .limit(1)
      .single();

    let result;
    if (existingInfo) {
      // Update existing record
      const { data: personalInfo, error } = await supabase
        .from('personal_info')
        .update(filteredData)
        .eq('id', existingInfo.id)
        .select()
        .single();

      if (error) throw error;
      result = personalInfo;
    } else {
      // Create new record
      const { data: personalInfo, error } = await supabase
        .from('personal_info')
        .insert([filteredData])
        .select()
        .single();

      if (error) throw error;
      result = personalInfo;
    }

    res.json(result);
  } catch (error) {
    console.error('Error updating personal info:', error);
    res.status(500).json({ error: 'Failed to update personal information' });
  }
});

// ==================== RESUME UPLOAD ====================

// Upload resume (PDF) - Admin only
router.post('/upload/resume', authenticateAdmin, resumeUpload.single('resume'), async (req: any, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file provided' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: 'portfolio/resumes',
        public_id: `resume_${Date.now()}`,
        format: 'pdf'
      },
      (error: any, result: any) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ error: 'Failed to upload resume' });
        }
        
        res.json({
          url: result?.secure_url,
          publicId: result?.public_id,
          originalName: req.file?.originalname
        });
      }
    );

    result.end(req.file.buffer);

  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({ error: 'Failed to upload resume' });
  }
});

export default router;
