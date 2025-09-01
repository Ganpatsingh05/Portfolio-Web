"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const supabase_1 = __importDefault(require("../lib/supabase"));
const router = (0, express_1.Router)();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const resumeUpload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        }
        else {
            cb(new Error('Only PDF files are allowed for resume!'));
        }
    },
});
const authenticateAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'ganpat_portfolio_super_secret_key_2024');
        req.adminUser = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};
router.post('/login', [
    (0, express_validator_1.body)('username').notEmpty().withMessage('Username is required'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { username, password } = req.body;
        const adminUsername = process.env.ADMIN_USERNAME || 'admin';
        const adminPassword = process.env.ADMIN_PASSWORD || 'GanpatPortfolio2024!';
        if (username !== adminUsername || password !== adminPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ username, role: 'admin' }, process.env.JWT_SECRET || 'ganpat_portfolio_super_secret_key_2024', { expiresIn: '24h' });
        res.json({
            token,
            user: { username, role: 'admin' },
            message: 'Login successful'
        });
    }
    catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});
router.get('/dashboard', authenticateAdmin, async (req, res) => {
    try {
        const [projectsResult, skillsResult, messagesResult, analyticsResult] = await Promise.all([
            supabase_1.default.from('projects').select('id', { count: 'exact' }),
            supabase_1.default.from('skills').select('id', { count: 'exact' }),
            supabase_1.default.from('contact_messages').select('id', { count: 'exact' }),
            supabase_1.default.from('analytics').select('id', { count: 'exact' })
        ]);
        const { data: recentMessages } = await supabase_1.default
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const { data: recentViews } = await supabase_1.default
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
    }
    catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});
router.put('/personal-info', authenticateAdmin, [
    (0, express_validator_1.body)('name').optional().notEmpty(),
    (0, express_validator_1.body)('title').optional().notEmpty(),
    (0, express_validator_1.body)('email').optional().isEmail(),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { data: existingData } = await supabase_1.default
            .from('personal_info')
            .select('id')
            .limit(1)
            .single();
        if (!existingData) {
            return res.status(404).json({ error: 'Personal info not found' });
        }
        const { name, title, email, phone, location, bio, linkedin_url, github_url, twitter_url, website_url, resume_url, profile_image_url } = req.body;
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
        const { data: personalInfo, error } = await supabase_1.default
            .from('personal_info')
            .update(updateData)
            .eq('id', existingData.id)
            .select()
            .single();
        if (error)
            throw error;
        res.json(personalInfo);
    }
    catch (error) {
        console.error('Update personal info error:', error);
        res.status(500).json({ error: 'Failed to update personal information' });
    }
});
router.post('/projects', authenticateAdmin, [
    (0, express_validator_1.body)('title').notEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('description').notEmpty().withMessage('Description is required'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { title, description, image_url, category, technologies, demo_url, github_url, featured, status, sort_order, start_date, end_date } = req.body;
        const projectData = {
            title,
            description,
            image_url,
            category,
            technologies: Array.isArray(technologies) ? technologies : (technologies ? technologies.split(',').map((t) => t.trim()) : []),
            demo_url,
            github_url,
            featured: featured || false,
            status: status || 'completed',
            sort_order: sort_order || 0,
            start_date,
            end_date
        };
        const { data: project, error } = await supabase_1.default
            .from('projects')
            .insert([projectData])
            .select()
            .single();
        if (error)
            throw error;
        res.status(201).json(project);
    }
    catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
});
router.put('/projects/:id', authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, image_url, category, technologies, demo_url, github_url, featured, status, sort_order, start_date, end_date } = req.body;
        const updateData = {
            title,
            description,
            image_url,
            category,
            technologies: Array.isArray(technologies) ? technologies : (technologies ? technologies.split(',').map((t) => t.trim()) : []),
            demo_url,
            github_url,
            featured,
            status,
            sort_order,
            start_date,
            end_date,
            updated_at: new Date().toISOString()
        };
        const { data: project, error } = await supabase_1.default
            .from('projects')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        res.json(project);
    }
    catch (error) {
        console.error('Update project error:', error);
        res.status(500).json({ error: 'Failed to update project' });
    }
});
router.delete('/projects/:id', authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase_1.default
            .from('projects')
            .delete()
            .eq('id', id);
        if (error)
            throw error;
        res.json({ message: 'Project deleted successfully' });
    }
    catch (error) {
        console.error('Delete project error:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
});
router.post('/skills', authenticateAdmin, [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Skill name is required'),
    (0, express_validator_1.body)('level').isInt({ min: 0, max: 100 }).withMessage('Level must be between 0-100'),
    (0, express_validator_1.body)('category').notEmpty().withMessage('Category is required'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, level, category, icon_name, sort_order, is_featured } = req.body;
        const skillData = {
            name,
            level: parseInt(level),
            category,
            icon_name,
            sort_order: sort_order || 0,
            is_featured: is_featured || false
        };
        const { data: skill, error } = await supabase_1.default
            .from('skills')
            .insert([skillData])
            .select()
            .single();
        if (error)
            throw error;
        res.status(201).json(skill);
    }
    catch (error) {
        console.error('Create skill error:', error);
        res.status(500).json({ error: 'Failed to create skill' });
    }
});
router.put('/skills/:id', authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, level, category, icon_name, sort_order, is_featured } = req.body;
        const updateData = {
            name,
            level: parseInt(level),
            category,
            icon_name,
            sort_order,
            is_featured,
            updated_at: new Date().toISOString()
        };
        const { data: skill, error } = await supabase_1.default
            .from('skills')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        res.json(skill);
    }
    catch (error) {
        console.error('Update skill error:', error);
        res.status(500).json({ error: 'Failed to update skill' });
    }
});
router.delete('/skills/:id', authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase_1.default
            .from('skills')
            .delete()
            .eq('id', id);
        if (error)
            throw error;
        res.json({ message: 'Skill deleted successfully' });
    }
    catch (error) {
        console.error('Delete skill error:', error);
        res.status(500).json({ error: 'Failed to delete skill' });
    }
});
router.get('/messages', authenticateAdmin, async (req, res) => {
    try {
        const { data: messages, error } = await supabase_1.default
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        res.json(messages);
    }
    catch (error) {
        console.error('Fetch messages error:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});
router.put('/messages/:id/read', authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { data: message, error } = await supabase_1.default
            .from('contact_messages')
            .update({ is_read: true, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        res.json(message);
    }
    catch (error) {
        console.error('Mark message read error:', error);
        res.status(500).json({ error: 'Failed to mark message as read' });
    }
});
router.get('/skills', async (req, res) => {
    try {
        const { data: skills, error } = await supabase_1.default
            .from('skills')
            .select('*')
            .order('sort_order', { ascending: true });
        if (error)
            throw error;
        res.json(skills);
    }
    catch (error) {
        console.error('Error fetching skills:', error);
        res.status(500).json({ error: 'Failed to fetch skills' });
    }
});
router.post('/skills', [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Skill name is required'),
    (0, express_validator_1.body)('level').isInt({ min: 0, max: 100 }).withMessage('Level must be between 0 and 100'),
    (0, express_validator_1.body)('category').notEmpty().withMessage('Category is required'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { data: skill, error } = await supabase_1.default
            .from('skills')
            .insert([req.body])
            .select()
            .single();
        if (error)
            throw error;
        res.status(201).json(skill);
    }
    catch (error) {
        console.error('Error creating skill:', error);
        res.status(500).json({ error: 'Failed to create skill' });
    }
});
router.put('/skills/:id', [
    (0, express_validator_1.body)('name').optional().notEmpty(),
    (0, express_validator_1.body)('level').optional().isInt({ min: 0, max: 100 }),
    (0, express_validator_1.body)('category').optional().notEmpty(),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { id } = req.params;
        const updateData = req.body;
        const filteredData = Object.fromEntries(Object.entries(updateData).filter(([key]) => !['iat', 'exp', 'sub', 'aud', 'iss'].includes(key)));
        const { data: skill, error } = await supabase_1.default
            .from('skills')
            .update(filteredData)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        res.json(skill);
    }
    catch (error) {
        console.error('Error updating skill:', error);
        res.status(500).json({ error: 'Failed to update skill' });
    }
});
router.delete('/skills/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase_1.default
            .from('skills')
            .delete()
            .eq('id', id);
        if (error)
            throw error;
        res.json({ message: 'Skill deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting skill:', error);
        res.status(500).json({ error: 'Failed to delete skill' });
    }
});
router.get('/experiences', async (req, res) => {
    try {
        const { data: experiences, error } = await supabase_1.default
            .from('experiences')
            .select('*')
            .order('start_date', { ascending: false });
        if (error)
            throw error;
        const processedExperiences = experiences?.map(experience => ({
            ...experience,
            description: Array.isArray(experience.description)
                ? experience.description.join('\n')
                : experience.description || ''
        }));
        res.json(processedExperiences);
    }
    catch (error) {
        console.error('Error fetching experiences:', error);
        res.status(500).json({ error: 'Failed to fetch experiences' });
    }
});
router.post('/experiences', [
    (0, express_validator_1.body)('title').notEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('company').notEmpty().withMessage('Company is required'),
    (0, express_validator_1.body)('period').notEmpty().withMessage('Period is required'),
    (0, express_validator_1.body)('type').isIn(['experience', 'education']).withMessage('Type must be experience or education'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const experienceData = { ...req.body };
        if (experienceData.description && typeof experienceData.description === 'string') {
            experienceData.description = experienceData.description
                .split('\n')
                .map((line) => line.trim())
                .filter((line) => line.length > 0);
        }
        const { data: experience, error } = await supabase_1.default
            .from('experiences')
            .insert([experienceData])
            .select()
            .single();
        if (error)
            throw error;
        res.status(201).json(experience);
    }
    catch (error) {
        console.error('Error creating experience:', error);
        res.status(500).json({ error: 'Failed to create experience' });
    }
});
router.put('/experiences/:id', [
    (0, express_validator_1.body)('title').optional().notEmpty(),
    (0, express_validator_1.body)('company').optional().notEmpty(),
    (0, express_validator_1.body)('period').optional().notEmpty(),
    (0, express_validator_1.body)('type').optional().isIn(['experience', 'education']),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { id } = req.params;
        const updateData = req.body;
        const filteredData = Object.fromEntries(Object.entries(updateData).filter(([key]) => !['iat', 'exp', 'sub', 'aud', 'iss'].includes(key)));
        if (filteredData.description && typeof filteredData.description === 'string') {
            filteredData.description = filteredData.description
                .split('\n')
                .map((line) => line.trim())
                .filter((line) => line.length > 0);
        }
        const { data: experience, error } = await supabase_1.default
            .from('experiences')
            .update(filteredData)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        res.json(experience);
    }
    catch (error) {
        console.error('Error updating experience:', error);
        res.status(500).json({ error: 'Failed to update experience' });
    }
});
router.delete('/experiences/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase_1.default
            .from('experiences')
            .delete()
            .eq('id', id);
        if (error)
            throw error;
        res.json({ message: 'Experience deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting experience:', error);
        res.status(500).json({ error: 'Failed to delete experience' });
    }
});
router.get('/personal-info', async (req, res) => {
    try {
        const { data: personalInfo, error } = await supabase_1.default
            .from('personal_info')
            .select('*')
            .limit(1)
            .single();
        if (error)
            throw error;
        res.json(personalInfo);
    }
    catch (error) {
        console.error('Error fetching personal info:', error);
        res.status(500).json({ error: 'Failed to fetch personal information' });
    }
});
router.put('/personal-info', [
    (0, express_validator_1.body)('name').optional().notEmpty(),
    (0, express_validator_1.body)('title').optional().notEmpty(),
    (0, express_validator_1.body)('email').optional().isEmail(),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const updateData = req.body;
        const filteredData = Object.fromEntries(Object.entries(updateData).filter(([key]) => !['iat', 'exp', 'sub', 'aud', 'iss'].includes(key)));
        const { data: existingInfo } = await supabase_1.default
            .from('personal_info')
            .select('id')
            .limit(1)
            .single();
        let result;
        if (existingInfo) {
            const { data: personalInfo, error } = await supabase_1.default
                .from('personal_info')
                .update(filteredData)
                .eq('id', existingInfo.id)
                .select()
                .single();
            if (error)
                throw error;
            result = personalInfo;
        }
        else {
            const { data: personalInfo, error } = await supabase_1.default
                .from('personal_info')
                .insert([filteredData])
                .select()
                .single();
            if (error)
                throw error;
            result = personalInfo;
        }
        res.json(result);
    }
    catch (error) {
        console.error('Error updating personal info:', error);
        res.status(500).json({ error: 'Failed to update personal information' });
    }
});
router.post('/upload/resume', authenticateAdmin, resumeUpload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No PDF file provided' });
        }
        const result = await cloudinary_1.v2.uploader.upload_stream({
            resource_type: 'auto',
            folder: 'portfolio/resumes',
            public_id: `resume_${Date.now()}`,
            format: 'pdf'
        }, (error, result) => {
            if (error) {
                console.error('Cloudinary upload error:', error);
                return res.status(500).json({ error: 'Failed to upload resume' });
            }
            res.json({
                url: result?.secure_url,
                publicId: result?.public_id,
                originalName: req.file?.originalname
            });
        });
        result.end(req.file.buffer);
    }
    catch (error) {
        console.error('Error uploading resume:', error);
        res.status(500).json({ error: 'Failed to upload resume' });
    }
});
exports.default = router;
//# sourceMappingURL=admin.js.map