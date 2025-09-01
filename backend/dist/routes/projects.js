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
        const { data: projects, error } = await supabase_1.default
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        res.json(projects);
    }
    catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data: project, error } = await supabase_1.default
            .from('projects')
            .select('*')
            .eq('id', id)
            .single();
        if (error)
            throw error;
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(project);
    }
    catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ error: 'Failed to fetch project' });
    }
});
router.post('/', [
    (0, express_validator_1.body)('title').notEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('description').notEmpty().withMessage('Description is required'),
    (0, express_validator_1.body)('technologies').isArray().withMessage('Technologies must be an array'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { data: project, error } = await supabase_1.default
            .from('projects')
            .insert([req.body])
            .select()
            .single();
        if (error)
            throw error;
        res.status(201).json(project);
    }
    catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
});
router.put('/:id', [
    (0, express_validator_1.body)('title').optional().notEmpty(),
    (0, express_validator_1.body)('description').optional().notEmpty(),
    (0, express_validator_1.body)('technologies').optional().isArray(),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { id } = req.params;
        const { data: project, error } = await supabase_1.default
            .from('projects')
            .update(req.body)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        res.json(project);
    }
    catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Failed to update project' });
    }
});
router.delete('/:id', async (req, res) => {
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
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
});
exports.default = router;
//# sourceMappingURL=projects.js.map