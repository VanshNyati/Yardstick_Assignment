#!/bin/bash

echo "🚀 Personal Finance Visualizer - Deployment Script"
echo "=================================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found. Please create it with your MongoDB URI:"
    echo "   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finance-app?retryWrites=true&w=majority"
    echo ""
    echo "📝 Create .env.local file and add your MongoDB connection string"
    exit 1
fi

# Test build
echo "🔨 Testing build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please fix the errors above."
    exit 1
fi

# Check if changes are committed
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Uncommitted changes detected. Committing..."
    git add .
    git commit -m "Ready for deployment"
fi

# Push to remote
echo "📤 Pushing to remote repository..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Code pushed successfully!"
    echo ""
    echo "🎯 Next Steps:"
    echo "1. Go to https://vercel.com"
    echo "2. Sign up with GitHub"
    echo "3. Import your repository"
    echo "4. Add MONGODB_URI environment variable"
    echo "5. Deploy!"
    echo ""
    echo "📋 Your app will be live at: https://your-app-name.vercel.app"
else
    echo "❌ Failed to push to remote. Please check your git configuration."
    exit 1
fi 