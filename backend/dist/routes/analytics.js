"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabase_1 = __importDefault(require("../lib/supabase"));
const router = (0, express_1.Router)();
router.post('/page-view', async (req, res) => {
    try {
        const { page, referrer, user_agent } = req.body;
        const ip_address = req.ip || req.connection.remoteAddress;
        const { data: analytics, error } = await supabase_1.default
            .from('analytics')
            .insert([{
                event_type: 'page_view',
                page,
                ip_address,
                user_agent,
                referrer,
                metadata: {}
            }])
            .select()
            .single();
        if (error)
            throw error;
        res.status(201).json({ message: 'Page view tracked' });
    }
    catch (error) {
        console.error('Error tracking page view:', error);
        res.status(500).json({ error: 'Failed to track page view' });
    }
});
router.post('/event', async (req, res) => {
    try {
        const { event_type, page, metadata } = req.body;
        const ip_address = req.ip || req.connection.remoteAddress;
        const user_agent = req.get('User-Agent');
        const { data: analytics, error } = await supabase_1.default
            .from('analytics')
            .insert([{
                event_type,
                page,
                ip_address,
                user_agent,
                metadata: metadata || {}
            }])
            .select()
            .single();
        if (error)
            throw error;
        res.status(201).json({ message: 'Event tracked' });
    }
    catch (error) {
        console.error('Error tracking event:', error);
        res.status(500).json({ error: 'Failed to track event' });
    }
});
router.get('/summary', async (req, res) => {
    try {
        const { days = 30 } = req.query;
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - parseInt(days.toString()));
        const { data: pageViews, error: pageViewsError } = await supabase_1.default
            .from('analytics')
            .select('page')
            .eq('event_type', 'page_view')
            .gte('created_at', fromDate.toISOString());
        if (pageViewsError)
            throw pageViewsError;
        const { data: events, error: eventsError } = await supabase_1.default
            .from('analytics')
            .select('event_type, page')
            .neq('event_type', 'page_view')
            .gte('created_at', fromDate.toISOString());
        if (eventsError)
            throw eventsError;
        const pageViewsByPage = pageViews.reduce((acc, view) => {
            acc[view.page] = (acc[view.page] || 0) + 1;
            return acc;
        }, {});
        const eventsByType = events.reduce((acc, event) => {
            acc[event.event_type] = (acc[event.event_type] || 0) + 1;
            return acc;
        }, {});
        res.json({
            totalPageViews: pageViews.length,
            totalEvents: events.length,
            pageViewsByPage,
            eventsByType,
            period: `${days} days`
        });
    }
    catch (error) {
        console.error('Error fetching analytics summary:', error);
        res.status(500).json({ error: 'Failed to fetch analytics summary' });
    }
});
router.get('/detailed', async (req, res) => {
    try {
        const { page, event_type, limit = 100, offset = 0 } = req.query;
        let query = supabase_1.default
            .from('analytics')
            .select('*')
            .order('created_at', { ascending: false })
            .range(parseInt(offset.toString()), parseInt(offset.toString()) + parseInt(limit.toString()) - 1);
        if (page) {
            query = query.eq('page', page);
        }
        if (event_type) {
            query = query.eq('event_type', event_type);
        }
        const { data: analytics, error } = await query;
        if (error)
            throw error;
        res.json(analytics);
    }
    catch (error) {
        console.error('Error fetching detailed analytics:', error);
        res.status(500).json({ error: 'Failed to fetch detailed analytics' });
    }
});
exports.default = router;
//# sourceMappingURL=analytics.js.map