# 🚀 Deployment Guide - Personal Finance Visualizer

## **Option 1: Vercel + MongoDB Atlas (Recommended)**

### **Step 1: Database Setup (MongoDB Atlas)**

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new cluster (M0 Free tier is perfect)

2. **Configure Database**
   - Create a database user with password
   - Get your connection string
   - Add your IP address to whitelist (or use 0.0.0.0/0 for all IPs)

3. **Get Connection String**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/finance-app?retryWrites=true&w=majority
   ```

### **Step 2: Environment Variables**

Create a `.env.local` file in your project root:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finance-app?retryWrites=true&w=majority
```

### **Step 3: Deploy to Vercel**

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your repository

3. **Configure Environment Variables**
   - In Vercel dashboard, go to your project
   - Navigate to Settings → Environment Variables
   - Add `MONGODB_URI` with your MongoDB connection string

4. **Deploy**
   - Vercel will automatically detect Next.js
   - Click "Deploy"
   - Your app will be live in minutes!

### **Step 4: Verify Deployment**

1. **Check your live URL** (provided by Vercel)
2. **Test all features**:
   - Add transactions
   - Edit/delete transactions
   - View categories and insights
   - Check budgets

---

## **Option 2: Render (Alternative)**

### **Step 1: Prepare for Render**

1. **Create `render.yaml`** (optional but recommended):

```yaml
services:
  - type: web
    name: finance-visualizer
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: MONGODB_URI
        value: your-mongodb-connection-string
```

### **Step 2: Deploy to Render**

1. **Connect Repository**
   - Go to [Render](https://render.com)
   - Connect your GitHub repo
   - Choose "Web Service"

2. **Configure Settings**
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node

3. **Add Environment Variables**
   - Add `MONGODB_URI` with your MongoDB connection string

4. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy your app

---

## **🔧 Database Configuration**

### **MongoDB Atlas Setup**

1. **Create Cluster**
   - Choose M0 Free tier
   - Select your preferred region
   - Wait for cluster to be ready

2. **Database Access**
   - Create a database user
   - Set username and password
   - Save credentials securely

3. **Network Access**
   - Add IP address: `0.0.0.0/0` (allows all IPs)
   - Or add specific IPs for security

4. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

### **Environment Variables**

**For Vercel:**
- Go to Project Settings → Environment Variables
- Add `MONGODB_URI` with your connection string
- Redeploy after adding environment variables

**For Render:**
- Go to Environment tab in your service
- Add `MONGODB_URI` with your connection string
- Redeploy automatically

---

## **✅ Post-Deployment Checklist**

- [ ] Database connection working
- [ ] Can add transactions
- [ ] Can edit transactions
- [ ] Can delete transactions
- [ ] Categories page working
- [ ] Budgets page working
- [ ] Insights page working
- [ ] Navigation working
- [ ] Mobile responsive
- [ ] All charts loading

---

## **🔍 Troubleshooting**

### **Common Issues:**

1. **Database Connection Error**
   - Check MongoDB Atlas IP whitelist
   - Verify connection string
   - Ensure environment variables are set

2. **Build Errors**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json

3. **Environment Variables Not Working**
   - Redeploy after adding environment variables
   - Check variable names (case-sensitive)

### **Useful Commands:**

```bash
# Test build locally
npm run build

# Test production start
npm start

# Check environment variables
echo $MONGODB_URI
```

---

## **🎯 Final Steps**

1. **Test thoroughly** on your live URL
2. **Share your deployed URL** for submission
3. **Document any issues** you encounter
4. **Celebrate your deployment!** 🎉

**Your app will be live and accessible to anyone with the URL!** 