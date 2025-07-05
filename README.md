# 💸 Personal Finance Visualizer

A modern, full-stack personal finance management application built with Next.js, MongoDB, and Tailwind CSS.

## ✨ Features

### **Stage 1: Basic Transaction Tracking**
- ✅ Add/Edit/Delete transactions (amount, date, description)
- ✅ Transaction list view with inline editing
- ✅ Monthly expenses bar chart
- ✅ Basic form validation

### **Stage 2: Categories**
- ✅ Predefined categories for transactions
- ✅ Category-wise pie chart
- ✅ Dashboard with summary cards
- ✅ Most recent transactions display

### **Stage 3: Budgeting**
- ✅ Set monthly category budgets
- ✅ Budget vs actual comparison
- ✅ Simple spending insights
- ✅ Budget tracking and alerts

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd yardstick-assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finance-app?retryWrites=true&w=majority
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🌐 Deployment

### Option 1: Vercel (Recommended)

1. **Set up MongoDB Atlas**
   - Create a free MongoDB Atlas account
   - Create a new cluster (M0 Free tier)
   - Get your connection string

2. **Deploy to Vercel**
   - Push your code to GitHub
   - Connect your repo to Vercel
   - Add `MONGODB_URI` environment variable
   - Deploy!

   **Detailed guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)

### Option 2: Render

1. **Connect to Render**
   - Connect your GitHub repository
   - Choose "Web Service"
   - Set build command: `npm install && npm run build`
   - Set start command: `npm start`

2. **Add Environment Variables**
   - Add `MONGODB_URI` with your MongoDB connection string

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: MongoDB with Mongoose
- **Charts**: Recharts
- **Deployment**: Vercel/Render
- **Database Hosting**: MongoDB Atlas

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Dashboard
│   ├── transactions/      # Transaction management
│   ├── categories/        # Category analytics
│   ├── budgets/          # Budget management
│   └── insights/         # Spending insights
├── components/            # Reusable components
│   ├── TransactionForm.tsx
│   ├── TransactionList.tsx
│   ├── MonthlyBarChart.tsx
│   └── CategoryPieChart.tsx
├── actions/              # Server actions
│   ├── transactions.ts   # Transaction CRUD
│   └── budgets.ts       # Budget management
├── models/               # MongoDB models
│   ├── transactionModel.ts
│   └── budgetModel.ts
├── lib/                  # Utilities
│   └── db.ts            # Database connection
└── constants/            # App constants
    └── categories.ts     # Category definitions
```

## 🎨 UI Features

- **Modern Design**: Clean, professional interface
- **Responsive**: Works on all devices
- **Dark Mode**: Built-in dark/light theme
- **Interactive**: Smooth animations and transitions
- **Accessible**: Proper ARIA labels and keyboard navigation

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 📊 Features Overview

### **Dashboard**
- Quick action cards for navigation
- Summary cards with key metrics
- Recent transactions list
- Monthly spending chart

### **Transactions**
- Add new transactions with form validation
- Edit transactions inline
- Delete transactions with confirmation
- Category-based organization

### **Categories**
- Visual pie chart of spending by category
- Category breakdown with amounts
- Color-coded category system

### **Budgets**
- Set monthly budgets per category
- Track spending vs budget
- Visual progress indicators
- Budget alerts and warnings

### **Insights**
- Detailed spending analytics
- Monthly trends
- Category comparisons
- Budget vs actual analysis

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues:

1. Check the [DEPLOYMENT.md](./DEPLOYMENT.md) for troubleshooting
2. Ensure your MongoDB connection is working
3. Verify all environment variables are set correctly
4. Check the browser console for errors

---

**Built with ❤️ using Next.js and MongoDB**
