import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import supabase from '../lib/supabase';

const router = Router();

// Get personal information
router.get('/', async (req: Request, res: Response) => {
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

// Update personal information (admin only)
router.put('/', [
  body('name').optional().notEmpty(),
  body('title').optional().notEmpty(),
  body('email').optional().isEmail(),
  body('phone').optional().notEmpty(),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { data: personalInfo, error } = await supabase
      .from('personal_info')
      .update(req.body)
      .eq('id', req.body.id || 1)
      .select()
      .single();

    if (error) throw error;

    res.json(personalInfo);
  } catch (error) {
    console.error('Error updating personal info:', error);
    res.status(500).json({ error: 'Failed to update personal information' });
  }
});

// Get skills
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

// Update skills (admin only)
router.put('/skills', [
  body('skills').isArray().withMessage('Skills must be an array'),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { skills } = req.body;

    // Delete existing skills
    await supabase.from('skills').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Insert new skills
    const { data: newSkills, error } = await supabase
      .from('skills')
      .insert(skills.map((skill: any, index: number) => ({
        ...skill,
        sort_order: index
      })))
      .select();

    if (error) throw error;

    res.json(newSkills);
  } catch (error) {
    console.error('Error updating skills:', error);
    res.status(500).json({ error: 'Failed to update skills' });
  }
});

// Get experiences
router.get('/experiences', async (req: Request, res: Response) => {
  try {
    const { data: experiences, error } = await supabase
      .from('experiences')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) throw error;

    res.json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({ error: 'Failed to fetch experiences' });
  }
});

// Add experience (admin only)
router.post('/experiences', [
  body('company').notEmpty().withMessage('Company is required'),
  body('position').notEmpty().withMessage('Position is required'),
  body('start_date').isISO8601().withMessage('Valid start date is required'),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { data: experience, error } = await supabase
      .from('experiences')
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(experience);
  } catch (error) {
    console.error('Error adding experience:', error);
    res.status(500).json({ error: 'Failed to add experience' });
  }
});

// Update experience (admin only)
router.put('/experiences/:id', [
  body('company').optional().notEmpty(),
  body('position').optional().notEmpty(),
  body('start_date').optional().isISO8601(),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    const { data: experience, error } = await supabase
      .from('experiences')
      .update(req.body)
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

export default router;
