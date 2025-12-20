# ResumeGenie Integration Guide

This guide explains how to integrate real backend services into ResumeGenie.

## Table of Contents

1. [Supabase Setup](#supabase-setup)
2. [Payment Integration](#payment-integration)
3. [AI Services](#ai-services)
4. [Email Notifications](#email-notifications)
5. [File Storage](#file-storage)

---

## Supabase Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 2. Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### 3. Create Supabase Client

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 4. Setup Database

Run the SQL from `DATABASE_SCHEMA.md` in your Supabase SQL editor.

### 5. Replace Mock Backend

Update `lib/mockBackend.ts` to use Supabase:

```typescript
// Example: User signup
export const auth = {
  signup: async (name: string, email: string, password: string, referralCode?: string) => {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    // Create user profile
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user!.id,
        name,
        email,
        referred_by: referralCode,
      })
      .select()
      .single();

    if (userError) throw userError;

    // Add welcome transaction
    await supabase.from('points_transactions').insert({
      user_id: userData.id,
      amount: 1,
      type: 'welcome',
      description: 'Welcome bonus',
      balance: 1,
    });

    return userData;
  },
};
```

---

## Payment Integration

### Paystack Integration

#### 1. Install Paystack

```bash
npm install react-paystack
```

#### 2. Setup Paystack

```typescript
// lib/payments.ts
import { PaystackButton } from 'react-paystack';

export const PaystackPayment = ({ 
  email, 
  amount, 
  onSuccess, 
  onClose 
}: PaystackPaymentProps) => {
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!;

  const config = {
    reference: new Date().getTime().toString(),
    email,
    amount: amount * 100, // Convert to kobo
    publicKey,
  };

  return (
    <PaystackButton
      {...config}
      text="Pay with Paystack"
      onSuccess={onSuccess}
      onClose={onClose}
    />
  );
};
```

#### 3. Handle Payment Success

```typescript
const handlePaymentSuccess = async (reference: string) => {
  // Verify payment on backend
  const response = await fetch('/api/verify-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reference }),
  });

  if (response.ok) {
    const { points } = await response.json();
    
    // Update user points
    await supabase
      .from('users')
      .update({ points: supabase.sql`points + ${points}` })
      .eq('id', userId);

    // Create transaction record
    await supabase.from('points_transactions').insert({
      user_id: userId,
      amount: points,
      type: 'purchase',
      description: `Purchased ${points} points`,
      balance: newBalance,
    });
  }
};
```

#### 4. Backend Webhook

Create an API endpoint to verify Paystack payments:

```typescript
// pages/api/verify-payment.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { reference } = req.body;

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  const data = await response.json();

  if (data.data.status === 'success') {
    const amount = data.data.amount / 100; // Convert from kobo
    const points = calculatePoints(amount);

    res.status(200).json({ success: true, points });
  } else {
    res.status(400).json({ success: false });
  }
}
```

### Flutterwave Alternative

```typescript
import { FlutterWaveButton } from 'flutterwave-react-v3';

const config = {
  public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY!,
  tx_ref: Date.now().toString(),
  amount,
  currency: 'NGN',
  payment_options: 'card,mobilemoney,ussd',
  customer: {
    email,
    phone_number,
    name,
  },
  customizations: {
    title: 'ResumeGenie Points',
    description: 'Purchase points for CV fixes',
    logo: 'https://resumegenie.ng/logo.png',
  },
};
```

---

## AI Services

### OpenAI Integration

#### 1. Install OpenAI SDK

```bash
npm install openai
```

#### 2. CV Fix Service

```typescript
// lib/ai/cvFix.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function fixCV(
  originalCV: string,
  jobDescription: string,
  fixType: 'basic' | 'smart' | 'full'
): Promise<CVFixResult> {
  const systemPrompt = getSystemPrompt(fixType);
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      { 
        role: 'user', 
        content: `Original CV:\n${originalCV}\n\nJob Description:\n${jobDescription}` 
      },
    ],
    temperature: 0.7,
  });

  const result = JSON.parse(response.choices[0].message.content!);

  return {
    fixedCV: result.fixed_cv,
    matchScore: result.match_score,
    improvements: result.improvements,
  };
}

function getSystemPrompt(fixType: string): string {
  const basePrompt = `You are an expert CV writer specializing in the Nigerian job market.`;
  
  switch (fixType) {
    case 'basic':
      return `${basePrompt} Fix grammar, spelling, and formatting. Return JSON with: fixed_cv, match_score, improvements.`;
    case 'smart':
      return `${basePrompt} Optimize for ATS, add keywords, quantify achievements. Return JSON with: fixed_cv, match_score, improvements.`;
    case 'full':
      return `${basePrompt} Completely restructure the CV for maximum impact. Use Nigerian market best practices. Return JSON with: fixed_cv, match_score, improvements.`;
  }
}
```

#### 3. Cover Letter Generation

```typescript
export async function generateCoverLetter(
  jobTitle: string,
  company: string,
  jobDescription: string,
  userName: string
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are an expert cover letter writer for the Nigerian job market.',
      },
      {
        role: 'user',
        content: `Generate a professional cover letter for:
          Job Title: ${jobTitle}
          Company: ${company}
          Applicant Name: ${userName}
          Job Description: ${jobDescription}
          
          Make it compelling and tailored to the Nigerian market.`,
      },
    ],
  });

  return response.choices[0].message.content!;
}
```

#### 4. Interview Prep

```typescript
export async function generateInterviewPrep(
  jobTitle: string,
  jobDescription: string
): Promise<InterviewPrepResult> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are an interview preparation expert. Generate questions, answers, and tips in JSON format.',
      },
      {
        role: 'user',
        content: `Generate interview preparation for:
          Job Title: ${jobTitle}
          Job Description: ${jobDescription}
          
          Return JSON with: questions (array of {question, suggestedAnswer, tips}), generalTips (array)`,
      },
    ],
  });

  return JSON.parse(response.choices[0].message.content!);
}
```

---

## Email Notifications

### Using Resend

#### 1. Install Resend

```bash
npm install resend
```

#### 2. Setup Email Service

```typescript
// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, name: string) {
  await resend.emails.send({
    from: 'ResumeGenie <hello@resumegenie.ng>',
    to: email,
    subject: 'Welcome to ResumeGenie! 🎉',
    html: `
      <h1>Welcome ${name}!</h1>
      <p>Thank you for joining ResumeGenie. You have 1 free point to get started.</p>
      <a href="https://resumegenie.ng/dashboard">Go to Dashboard</a>
    `,
  });
}

export async function sendPointsLowEmail(email: string, name: string, points: number) {
  await resend.emails.send({
    from: 'ResumeGenie <hello@resumegenie.ng>',
    to: email,
    subject: 'Running low on points',
    html: `
      <h1>Hi ${name},</h1>
      <p>You have ${points} points remaining. Buy more to continue optimizing your CVs!</p>
      <a href="https://resumegenie.ng/buy-points">Buy Points</a>
    `,
  });
}

export async function sendReferralSuccessEmail(
  email: string,
  name: string,
  referredEmail: string
) {
  await resend.emails.send({
    from: 'ResumeGenie <hello@resumegenie.ng>',
    to: email,
    subject: 'You earned referral points! 🎁',
    html: `
      <h1>Great news, ${name}!</h1>
      <p>${referredEmail} signed up using your referral link. You earned 2 bonus points!</p>
    `,
  });
}
```

---

## File Storage

### Supabase Storage for CVs

#### 1. Create Storage Bucket

```typescript
// Setup storage bucket (one-time)
await supabase.storage.createBucket('cvs', {
  public: false,
  fileSizeLimit: 5242880, // 5MB
});
```

#### 2. Upload CV

```typescript
export async function uploadCV(file: File, userId: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('cvs')
    .upload(fileName, file);

  if (error) throw error;

  return data.path;
}
```

#### 3. Download CV

```typescript
export async function downloadCV(path: string): Promise<Blob> {
  const { data, error } = await supabase.storage
    .from('cvs')
    .download(path);

  if (error) throw error;

  return data;
}
```

#### 4. Parse PDF/DOCX

```bash
npm install pdf-parse mammoth
```

```typescript
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const data = await pdfParse(buffer);
  return data.text;
}

export async function extractTextFromDOCX(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}
```

---

## Environment Variables

Create a `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Paystack
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key

# Flutterwave (Alternative)
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=your_flutterwave_public_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Email
RESEND_API_KEY=your_resend_api_key

# App
NEXT_PUBLIC_APP_URL=https://resumegenie.ng
```

---

## Deployment Checklist

- [ ] Set up Supabase project and run migrations
- [ ] Configure Supabase RLS policies
- [ ] Set up Paystack/Flutterwave account
- [ ] Configure payment webhooks
- [ ] Set up OpenAI account and get API key
- [ ] Configure email service (Resend)
- [ ] Set all environment variables
- [ ] Test payment flow in sandbox mode
- [ ] Test AI CV fixing
- [ ] Set up monitoring and error tracking
- [ ] Configure analytics (e.g., PostHog, Mixpanel)
- [ ] Set up custom domain
- [ ] Configure SSL certificate
- [ ] Test on mobile devices
- [ ] Perform security audit
- [ ] Set up backup strategy

---

## Production Considerations

### Security
- Enable rate limiting on API endpoints
- Implement CSRF protection
- Use secure HTTP headers
- Sanitize all user inputs
- Encrypt sensitive data at rest
- Use environment variables for secrets

### Performance
- Implement caching for AI responses
- Use CDN for static assets
- Optimize images
- Lazy load components
- Implement pagination for lists
- Use database indexes

### Monitoring
- Set up error tracking (e.g., Sentry)
- Monitor API usage and costs
- Track user analytics
- Set up uptime monitoring
- Monitor payment webhooks

### Compliance
- Add privacy policy
- Add terms of service
- Implement GDPR compliance
- Add cookie consent
- Ensure data portability
- Implement data deletion
