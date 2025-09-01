#!/bin/bash
# Supabase Environment Setup Helper
# Run this after getting your Supabase credentials

echo "🔧 Supabase Environment Configuration"
echo "======================================"
echo ""

echo "📝 Step 1: Update Backend Environment"
echo "Edit: backend/.env"
echo ""
echo "Replace these values:"
echo "SUPABASE_URL=https://your-project-ref.supabase.co"
echo "SUPABASE_SERVICE_KEY=your_service_role_key_here"
echo "SUPABASE_ANON_KEY=your_anon_key_here"
echo ""

echo "📝 Step 2: Update Frontend Environment"  
echo "Edit: frontend/.env.local"
echo ""
echo "Replace these values:"
echo "NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co"
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here"
echo ""

echo "🚀 Step 3: Test the Setup"
echo "Backend: cd backend && npm run dev"
echo "Frontend: cd frontend && npm run dev"
echo ""

echo "✅ Step 4: Deploy Database Schema"
echo "1. Go to Supabase SQL Editor"
echo "2. Copy contents from: backend/database/schema.sql"
echo "3. Run the SQL script"
echo ""

echo "🎉 Your portfolio will be fully functional!"
