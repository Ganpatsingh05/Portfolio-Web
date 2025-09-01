"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const supabase_1 = __importDefault(require("../lib/supabase"));
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
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
router.put('/', [
    (0, express_validator_1.body)('name').optional().notEmpty(),
    (0, express_validator_1.body)('title').optional().notEmpty(),
    (0, express_validator_1.body)('email').optional().isEmail(),
    (0, express_validator_1.body)('phone').optional().notEmpty(),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { data: personalInfo, error } = await supabase_1.default
            .from('personal_info')
            .update(req.body)
            .eq('id', req.body.id || 1)
            .select()
            .single();
        if (error)
            throw error;
        res.json(personalInfo);
    }
    catch (error) {
        console.error('Error updating personal info:', error);
        res.status(500).json({ error: 'Failed to update personal information' });
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
router.put('/skills', [
    (0, express_validator_1.body)('skills').isArray().withMessage('Skills must be an array'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { skills } = req.body;
        await supabase_1.default.from('skills').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        const { data: newSkills, error } = await supabase_1.default
            .from('skills')
            .insert(skills.map((skill, index) => ({
            ...skill,
            sort_order: index
        })))
            .select();
        if (error)
            throw error;
        res.json(newSkills);
    }
    catch (error) {
        console.error('Error updating skills:', error);
        res.status(500).json({ error: 'Failed to update skills' });
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
        res.json(experiences);
    }
    catch (error) {
        console.error('Error fetching experiences:', error);
        res.status(500).json({ error: 'Failed to fetch experiences' });
    }
});
router.post('/experiences', [
    (0, express_validator_1.body)('company').notEmpty().withMessage('Company is required'),
    (0, express_validator_1.body)('position').notEmpty().withMessage('Position is required'),
    (0, express_validator_1.body)('start_date').isISO8601().withMessage('Valid start date is required'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { data: experience, error } = await supabase_1.default
            .from('experiences')
            .insert([req.body])
            .select()
            .single();
        if (error)
            throw error;
        res.status(201).json(experience);
    }
    catch (error) {
        console.error('Error adding experience:', error);
        res.status(500).json({ error: 'Failed to add experience' });
    }
});
router.put('/experiences/:id', [
    (0, express_validator_1.body)('company').optional().notEmpty(),
    (0, express_validator_1.body)('position').optional().notEmpty(),
    (0, express_validator_1.body)('start_date').optional().isISO8601(),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { id } = req.params;
        const { data: experience, error } = await supabase_1.default
            .from('experiences')
            .update(req.body)
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
exports.default = router;
//# sourceMappingURL=personal-info.js.map