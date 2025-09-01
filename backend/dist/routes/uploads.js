"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const router = (0, express_1.Router)();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed!'));
        }
    },
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
router.post('/image', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }
        const result = await cloudinary_1.v2.uploader.upload_stream({
            resource_type: 'image',
            folder: 'portfolio',
            transformation: [
                { width: 1200, height: 800, crop: 'limit' },
                { quality: 'auto' },
                { format: 'auto' }
            ]
        }, (error, result) => {
            if (error) {
                console.error('Cloudinary upload error:', error);
                return res.status(500).json({ error: 'Failed to upload image' });
            }
            res.json({
                url: result?.secure_url,
                publicId: result?.public_id,
                width: result?.width,
                height: result?.height
            });
        });
        result.end(req.file.buffer);
    }
    catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});
router.post('/resume', resumeUpload.single('resume'), async (req, res) => {
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
router.delete('/image/:publicId', async (req, res) => {
    try {
        const { publicId } = req.params;
        const result = await cloudinary_1.v2.uploader.destroy(publicId);
        if (result.result === 'ok') {
            res.json({ message: 'Image deleted successfully' });
        }
        else {
            res.status(404).json({ error: 'Image not found' });
        }
    }
    catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ error: 'Failed to delete image' });
    }
});
exports.default = router;
//# sourceMappingURL=uploads.js.map