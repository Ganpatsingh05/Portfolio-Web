"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const nodemailer_1 = __importDefault(require("nodemailer"));
const supabase_1 = __importDefault(require("../lib/supabase"));
const router = (0, express_1.Router)();
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
router.post('/', [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('subject').notEmpty().withMessage('Subject is required'),
    (0, express_validator_1.body)('message').notEmpty().withMessage('Message is required'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, subject, message, phone } = req.body;
        const { data: contactMessage, error: dbError } = await supabase_1.default
            .from('contact_messages')
            .insert([{
                name,
                email,
                subject,
                message,
                phone,
                status: 'unread'
            }])
            .select()
            .single();
        if (dbError) {
            console.error('Database error:', dbError);
            return res.status(500).json({ error: 'Failed to save message' });
        }
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: process.env.EMAIL_TO,
                subject: `New Contact Form Message from ${name}: ${subject}`,
                html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <hr>
          <p><em>Sent from your portfolio website</em></p>
        `,
            });
        }
        catch (emailError) {
            console.error('Email error:', emailError);
        }
        res.status(201).json({
            message: 'Message sent successfully',
            id: contactMessage.id
        });
    }
    catch (error) {
        console.error('Error processing contact form:', error);
        res.status(500).json({ error: 'Failed to process contact form' });
    }
});
router.get('/', async (req, res) => {
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
        console.error('Error fetching contact messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});
router.patch('/:id/status', [
    (0, express_validator_1.body)('status').isIn(['unread', 'read', 'replied']).withMessage('Invalid status'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { id } = req.params;
        const { status } = req.body;
        const { data: message, error } = await supabase_1.default
            .from('contact_messages')
            .update({ status })
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        res.json(message);
    }
    catch (error) {
        console.error('Error updating message status:', error);
        res.status(500).json({ error: 'Failed to update message status' });
    }
});
exports.default = router;
//# sourceMappingURL=contact.js.map