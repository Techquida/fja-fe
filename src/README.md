# ResumeGenie - Smart CV & Job Application Assistant

A comprehensive web platform for Nigerian job seekers to optimize CVs, generate cover letters, prepare for interviews, and track job applications.

## 🎯 Features

### Core Features

1. **Landing Page**
   - Compelling hero section with clear value proposition
   - "How It Works" section with 4-step process
   - Success stories and testimonials
   - Pricing packages preview
   - Mobile-responsive design

2. **Authentication & Onboarding**
   - Email/password signup and login
   - Welcome bonus: 1 free point for new users
   - Referral code support during signup
   - Persistent session management

3. **Dashboard**
   - Personalized greeting with user name
   - Real-time points balance display
   - Quick action cards for all features
   - Activity statistics and tracking
   - Suggested job postings based on CV
   - Recent activity history
   - Streak tracking for engagement

4. **CV Fix Flow**
   - Step 1: Upload CV (PDF/DOCX) or paste text
   - Step 2: Paste job description
   - Step 3: Choose fix type:
     - **Basic Refix** (1 point): Grammar, formatting, basic ATS optimization
     - **Smart Rebuild** (3 points): Keyword optimization, achievement quantification, match analysis
     - **Full New CV** (5 points): Complete restructure, Nigerian market optimization, premium formatting
   - AI-powered processing simulation
   - Match score calculation
   - Detailed improvement suggestions
   - Download as PDF or DOCX

5. **Cover Letter Generator** (1 point)
   - Input job title, company, and job description
   - AI-generated professional cover letter
   - Copy to clipboard or download
   - Personalized to user profile

6. **Interview Preparation** (1 point)
   - Job-specific interview questions
   - Suggested answers with STAR method
   - Tips for each question
   - General interview tips
   - Downloadable prep guide

7. **Job Application Tracker**
   - Track all job applications in one place
   - Update application status (Applied, Reviewing, Interview, Rejected, Accepted)
   - Application statistics dashboard
   - Notes and comments per application

8. **Points & Payment System**
   - Flexible pay-as-you-go pricing:
     - ₦1,000 → 10 points
     - ₦2,000 → 21 points (+1 bonus)
     - ₦5,000 → 55 points (+5 bonus)
     - ₦10,000 → 120 points (+20 bonus)
   - Paystack integration ready
   - Transaction history
   - Points never expire

9. **Referral System**
   - Unique referral code for each user
   - Earn 2 points per successful referral
   - Referral link sharing via email/WhatsApp
   - Referral tracking dashboard
   - Total points earned from referrals

10. **Settings & Profile**
    - Update personal information
    - Notification preferences
    - Account information display
    - Streak tracking
    - Account deletion option

## 🏗️ Technical Architecture

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Lucide React** for icons
- **Sonner** for toast notifications

### State Management
- Local storage for data persistence
- React hooks for state management
- Mock backend services

### Data Models

```typescript
// User
{
  id: string
  name: string
  email: string
  points: number
  referralCode: string
  referredBy?: string
  firstFreeUsed: boolean
  streak: number
  createdAt: string
}

// CV Document
{
  id: string
  userId: string
  name: string
  originalContent: string
  fixedContent?: string
  jobDescription?: string
  fixType: 'basic' | 'smart' | 'full'
  matchScore?: number
  improvements?: string[]
  status: 'pending' | 'processing' | 'completed'
}

// Cover Letter
{
  id: string
  userId: string
  jobTitle: string
  company: string
  content: string
  createdAt: string
}

// Interview Prep
{
  id: string
  userId: string
  jobTitle: string
  questions: InterviewQuestion[]
  tips: string[]
}

// Job Application
{
  id: string
  userId: string
  cvId: string
  coverLetterId?: string
  jobTitle: string
  company: string
  status: 'applied' | 'reviewing' | 'interview' | 'rejected' | 'accepted'
  appliedAt: string
}

// Points Transaction
{
  id: string
  userId: string
  amount: number
  type: 'purchase' | 'referral' | 'welcome' | 'usage' | 'bonus'
  description: string
  balance: number
}
```

## 📁 Project Structure

```
/
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── LandingPage.tsx        # Marketing landing page
│   ├── AuthPage.tsx           # Signup/Login
│   ├── Dashboard.tsx          # Main user dashboard
│   ├── CVFixFlow.tsx          # CV fixing workflow
│   ├── CVOutput.tsx           # CV results page
│   ├── CoverLetterGenerator.tsx
│   ├── InterviewPrep.tsx
│   ├── JobApplication.tsx     # Application tracker
│   ├── BuyPoints.tsx          # Points purchase
│   ├── ReferralPage.tsx       # Referral system
│   └── Settings.tsx           # User settings
├── lib/
│   ├── storage.ts             # LocalStorage wrapper
│   └── mockBackend.ts         # Mock API services
├── types.ts                   # TypeScript interfaces
├── App.tsx                    # Main app component
└── styles/
    └── globals.css            # Global styles & tokens
```

## 🚀 Getting Started

### Installation

This is a Figma Make project. No installation required - the app runs directly in the browser.

### Usage

1. **Landing Page**: Visit the homepage to learn about ResumeGenie
2. **Sign Up**: Create an account to get 1 free point
3. **Dashboard**: Access all features from the dashboard
4. **Fix Your CV**: Upload a CV and job description to get started
5. **Buy Points**: Purchase more points to continue using the service
6. **Refer Friends**: Share your referral link to earn bonus points

### Demo Accounts

For testing, you can create a new account or use the demo flow:
1. Click "Get Started"
2. Fill in signup form
3. Optional: Use a referral code from another user
4. Start with 1 free point

## 💡 Key Features for Nigerian Market

1. **Naira Pricing**: All prices in Nigerian Naira (₦)
2. **Local Market Optimization**: CV fixes tailored for Nigerian employers
3. **WhatsApp Sharing**: Share referrals via WhatsApp (popular in Nigeria)
4. **Mobile-First Design**: Optimized for mobile users
5. **Pay-As-You-Go**: Flexible pricing without subscriptions

## 🔧 Future Enhancements

### Backend Integration Ready
The app is structured to easily integrate with:
- **Supabase** for authentication and database
- **Paystack/Flutterwave** for payments
- **OpenAI/Claude API** for actual AI-powered CV fixing
- **Email services** for notifications

### Planned Features
- [ ] Real PDF/DOCX parsing
- [ ] Advanced CV templates library
- [ ] Job board integration
- [ ] Email notifications
- [ ] Mobile app
- [ ] Premium subscription tier
- [ ] CV version history
- [ ] Skills assessment
- [ ] Salary insights
- [ ] Company reviews

## 🎨 Design System

### Colors
- **Primary**: Purple gradient (#7C3AED to #3B82F6)
- **Success**: Green (#10B981)
- **Warning**: Orange (#F59E0B)
- **Error**: Red (#EF4444)

### Typography
- Responsive font sizes
- Medium weight for headings
- Normal weight for body text
- Optimized line heights

### Components
- Cards for content grouping
- Badges for status indicators
- Buttons with multiple variants
- Input fields with validation
- Progress indicators
- Toast notifications

## 📊 Analytics & Metrics

Track key metrics:
- User signups
- Points purchased
- CV fixes by type
- Cover letters generated
- Interview preps created
- Referral conversion rate
- User retention/streak
- Job application success rate

## 🔒 Security Notes

**Important**: This is a demo/prototype application using localStorage. For production:
1. Implement proper backend authentication
2. Secure API endpoints
3. Encrypt sensitive data
4. Use HTTPS
5. Implement rate limiting
6. Add CSRF protection
7. Follow GDPR/data protection laws

## 📝 License

This project is created for demonstration purposes.

## 🤝 Support

For questions or support, contact the ResumeGenie team.

---

**Made with ❤️ for Nigerian Job Seekers**
