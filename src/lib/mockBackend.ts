// Mock backend functionality for FlowJobAi
import { storage } from "./storage";
import type {
  User,
  CVDocument,
  CoverLetter,
  InterviewPrep,
  PointsTransaction,
  Referral,
  Notification,
  JobApplication,
  InterviewQuestion,
} from "../types";

// Generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Generate referral code
const generateReferralCode = (name: string) => {
  return (
    name.substring(0, 3) + Math.random().toString(36).substr(2, 5)
  ).toUpperCase();
};

// Auth functions
export const auth = {
  signup: (
    name: string,
    email: string,
    password: string,
    referralCode?: string
  ) => {
    const users = storage.get("users") || [];

    // Check if user exists
    if (users.find((u: User) => u.email === email)) {
      throw new Error("Email already registered");
    }

    const newUser: User = {
      id: generateId(),
      name,
      email,
      points: 1, // Free point for first-time users
      createdAt: new Date().toISOString(),
      referralCode: generateReferralCode(name),
      referredBy: referralCode,
      firstFreeUsed: false,
      streak: 0,
      lastActiveDate: new Date().toISOString(),
    };

    users.push(newUser);
    storage.set("users", users);
    storage.setCurrentUser(newUser);

    // Add welcome points transaction
    pointsService.addTransaction(
      newUser.id,
      1,
      "welcome",
      "Welcome bonus - 1 free point!"
    );

    // Process referral if code provided
    if (referralCode) {
      processReferral(referralCode, email);
    }

    // Add welcome notification
    notificationService.create(newUser.id, {
      type: "success",
      title: "Welcome to FlowJobAi! 🎉",
      message:
        "You have 1 free point to try our CV fix service. Upload your CV to get started!",
    });

    return newUser;
  },

  login: (email: string, password: string) => {
    const users = storage.get("users") || [];
    const user = users.find((u: User) => u.email === email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Update streak
    const today = new Date().toDateString();
    const lastActive = new Date(user.lastActiveDate).toDateString();

    if (today !== lastActive) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (lastActive === yesterday) {
        user.streak += 1;
      } else {
        user.streak = 1;
      }
      user.lastActiveDate = new Date().toISOString();

      // Update user in storage
      const userIndex = users.findIndex((u: User) => u.id === user.id);
      users[userIndex] = user;
      storage.set("users", users);
    }

    storage.setCurrentUser(user);
    return user;
  },

  logout: () => {
    storage.clearCurrentUser();
  },

  getCurrentUser: () => {
    return storage.getCurrentUser();
  },

  updateUser: (userId: string, updates: Partial<User>) => {
    const users = storage.get("users") || [];
    const index = users.findIndex((u: User) => u.id === userId);

    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      storage.set("users", users);
      storage.setCurrentUser(users[index]);
      return users[index];
    }
    return null;
  },
};

// Process referral
const processReferral = (code: string, referredEmail: string) => {
  const users = storage.get("users") || [];
  const referrer = users.find((u: User) => u.referralCode === code);

  if (referrer) {
    const referral: Referral = {
      id: generateId(),
      referrerId: referrer.id,
      referredEmail,
      status: "completed",
      pointsEarned: 2,
      createdAt: new Date().toISOString(),
    };

    storage.addItem("referrals", referral);

    // Award points to referrer
    pointsService.addPoints(
      referrer.id,
      2,
      "referral",
      `Referral bonus - ${referredEmail} joined!`
    );
  }
};

// Points service
export const pointsService = {
  addPoints: (
    userId: string,
    amount: number,
    type: string,
    description: string
  ) => {
    const user = auth.getCurrentUser();
    if (!user || user.id !== userId) return;

    const newBalance = user.points + amount;
    auth.updateUser(userId, { points: newBalance });

    pointsService.addTransaction(userId, amount, type as any, description);

    return newBalance;
  },

  deductPoints: (
    userId: string,
    amount: number,
    type: string,
    description: string
  ) => {
    const user = auth.getCurrentUser();
    if (!user || user.id !== userId) return;

    if (user.points < amount) {
      throw new Error("Insufficient points");
    }

    const newBalance = user.points - amount;
    auth.updateUser(userId, { points: newBalance });

    pointsService.addTransaction(userId, -amount, type as any, description);

    return newBalance;
  },

  addTransaction: (
    userId: string,
    amount: number,
    type: string,
    description: string
  ) => {
    const user = storage.get("users")?.find((u: User) => u.id === userId);

    const transaction: PointsTransaction = {
      id: generateId(),
      userId,
      amount,
      type: type as any,
      description,
      createdAt: new Date().toISOString(),
      balance: user?.points || 0,
    };

    storage.addItem("transactions", transaction);
  },

  getTransactions: (userId: string) => {
    const transactions = storage.get("transactions") || [];
    return transactions
      .filter((t: PointsTransaction) => t.userId === userId)
      .sort(
        (a: PointsTransaction, b: PointsTransaction) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  },

  purchasePoints: (userId: string, packagePrice: number, points: number) => {
    // In real app, this would integrate with Paystack/Flutterwave
    pointsService.addPoints(
      userId,
      points,
      "purchase",
      `Purchased ${points} points for ₦${packagePrice.toLocaleString()}`
    );

    notificationService.create(userId, {
      type: "success",
      title: "Points Added! 💰",
      message: `${points} points have been added to your wallet.`,
    });
  },
};

// CV Service
export const cvService = {
  create: async (userId: string, cvData: Partial<CVDocument>) => {
    const cv: CVDocument = {
      id: generateId(),
      userId,
      name: cvData.name || "Untitled CV",
      originalContent: cvData.originalContent || "",
      jobDescription: cvData.jobDescription,
      fixType: cvData.fixType,
      createdAt: new Date().toISOString(),
      status: "pending",
      fileType: cvData.fileType || "text",
    };

    storage.addItem("cvs", cv);
    return cv;
  },

  processFix: async (cvId: string, fixType: "basic" | "smart" | "full") => {
    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const cv = storage.get("cvs")?.find((c: CVDocument) => c.id === cvId);
    if (!cv) throw new Error("CV not found");

    // Generate mock improvements based on fix type
    const improvements = generateImprovements(fixType);
    const matchScore = Math.floor(Math.random() * 15) + 85; // 85-100

    const fixedContent = generateFixedCV(cv.originalContent, fixType);

    storage.updateItem("cvs", cvId, {
      fixedContent,
      matchScore,
      improvements,
      status: "completed",
    });

    return storage.get("cvs")?.find((c: CVDocument) => c.id === cvId);
  },

  getAll: (userId: string) => {
    return storage
      .getUserItems("cvs")
      .sort(
        (a: CVDocument, b: CVDocument) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  },

  getById: (id: string) => {
    return storage.get("cvs")?.find((c: CVDocument) => c.id === id);
  },
};

// Cover Letter Service
export const coverLetterService = {
  create: async (
    userId: string,
    jobTitle: string,
    company: string,
    jobDescription: string
  ) => {
    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const content = generateCoverLetter(jobTitle, company, jobDescription);

    const coverLetter: CoverLetter = {
      id: generateId(),
      userId,
      jobTitle,
      company,
      jobDescription,
      content,
      createdAt: new Date().toISOString(),
    };

    storage.addItem("coverLetters", coverLetter);
    return coverLetter;
  },

  getAll: (userId: string) => {
    return storage
      .getUserItems("coverLetters")
      .sort(
        (a: CoverLetter, b: CoverLetter) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  },

  getById: (id: string) => {
    return storage.get("coverLetters")?.find((c: CoverLetter) => c.id === id);
  },
};

// Interview Prep Service
export const interviewPrepService = {
  create: async (userId: string, jobTitle: string, jobDescription: string) => {
    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const questions = generateInterviewQuestions(jobTitle, jobDescription);
    const tips = generateInterviewTips(jobTitle);

    const prep: InterviewPrep = {
      id: generateId(),
      userId,
      jobTitle,
      jobDescription,
      questions,
      tips,
      createdAt: new Date().toISOString(),
    };

    storage.addItem("interviewPreps", prep);
    return prep;
  },

  getAll: (userId: string) => {
    return storage
      .getUserItems("interviewPreps")
      .sort(
        (a: InterviewPrep, b: InterviewPrep) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  },

  getById: (id: string) => {
    return storage
      .get("interviewPreps")
      ?.find((p: InterviewPrep) => p.id === id);
  },
};

// Job Application Service
export const jobApplicationService = {
  create: (userId: string, data: Partial<JobApplication>) => {
    const application: JobApplication = {
      id: generateId(),
      userId,
      cvId: data.cvId!,
      coverLetterId: data.coverLetterId,
      jobTitle: data.jobTitle!,
      company: data.company!,
      jobDescription: data.jobDescription!,
      appliedAt: new Date().toISOString(),
      status: "applied",
      notes: data.notes,
    };

    storage.addItem("jobApplications", application);

    notificationService.create(userId, {
      type: "success",
      title: "Application Submitted! 🎯",
      message: `Your application for ${data.jobTitle} at ${data.company} has been tracked.`,
    });

    return application;
  },

  updateStatus: (
    id: string,
    status: JobApplication["status"],
    notes?: string
  ) => {
    return storage.updateItem("jobApplications", id, { status, notes });
  },

  getAll: (userId: string) => {
    return storage
      .getUserItems("jobApplications")
      .sort(
        (a: JobApplication, b: JobApplication) =>
          new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
      );
  },

  getById: (id: string) => {
    return storage
      .get("jobApplications")
      ?.find((a: JobApplication) => a.id === id);
  },
};

// Notification Service
export const notificationService = {
  create: (userId: string, data: Partial<Notification>) => {
    const notification: Notification = {
      id: generateId(),
      userId,
      type: data.type || "info",
      title: data.title || "",
      message: data.message || "",
      read: false,
      createdAt: new Date().toISOString(),
      actionUrl: data.actionUrl,
    };

    storage.addItem("notifications", notification);
    return notification;
  },

  getAll: (userId: string) => {
    return storage
      .getUserItems("notifications")
      .sort(
        (a: Notification, b: Notification) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  },

  markAsRead: (id: string) => {
    return storage.updateItem("notifications", id, { read: true });
  },

  markAllAsRead: (userId: string) => {
    const notifications = storage.getUserItems("notifications");
    notifications.forEach((n: Notification) => {
      if (!n.read) {
        storage.updateItem("notifications", n.id, { read: true });
      }
    });
  },

  getUnreadCount: (userId: string) => {
    const notifications = storage.getUserItems("notifications");
    return notifications.filter((n: Notification) => !n.read).length;
  },
};

// Referral Service
export const referralService = {
  getReferrals: (userId: string) => {
    const referrals = storage.get("referrals") || [];
    return referrals
      .filter((r: Referral) => r.referrerId === userId)
      .sort(
        (a: Referral, b: Referral) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  },

  getTotalEarned: (userId: string) => {
    const referrals = referralService.getReferrals(userId);
    return referrals.reduce(
      (sum: number, r: Referral) => sum + r.pointsEarned,
      0
    );
  },
};

// Mock AI generation functions
function generateImprovements(fixType: string): string[] {
  const basic = [
    "Fixed grammar and spelling errors",
    "Improved formatting and layout",
    "Standardized font and spacing",
    "Added proper section headings",
  ];

  const smart = [
    ...basic,
    "Optimized keywords for ATS (Applicant Tracking Systems)",
    "Quantified achievements with metrics",
    "Reordered sections for better impact",
    "Enhanced professional summary",
    "Aligned experience with job requirements",
  ];

  const full = [
    ...smart,
    "Completely restructured CV layout",
    "Added industry-specific keywords",
    "Created compelling achievement statements",
    "Optimized for Nigerian job market",
    "Added skills section tailored to job description",
    "Improved visual hierarchy and readability",
  ];

  return fixType === "basic" ? basic : fixType === "smart" ? smart : full;
}

function generateFixedCV(original: string, fixType: string): string {
  // In real app, this would call AI API
  return `PROFESSIONAL CURRICULUM VITAE\n\n${original}\n\n[This CV has been optimized using ${fixType} fix type with ATS-friendly formatting and keyword optimization for Nigerian job market]`;
}

function generateCoverLetter(
  jobTitle: string,
  company: string,
  jobDescription: string
): string {
  const user = auth.getCurrentUser();
  return `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${company}. With my background and skills aligned with the requirements outlined in your job description, I am confident in my ability to contribute effectively to your team.

${jobDescription.substring(0, 200)}...

Throughout my career, I have demonstrated excellence in delivering results and working collaboratively with diverse teams. I am particularly excited about the opportunity to bring my expertise to ${company} and contribute to your continued success.

I am eager to discuss how my qualifications align with your needs. Thank you for considering my application.

Sincerely,
${user?.name || "Your Name"}`;
}

function generateInterviewQuestions(
  jobTitle: string,
  jobDescription: string
): InterviewQuestion[] {
  return [
    {
      question: `Tell me about yourself and why you're interested in this ${jobTitle} role.`,
      suggestedAnswer: `I'm a passionate professional with experience in ${jobTitle.toLowerCase()}. I'm excited about this opportunity because it aligns with my career goals and allows me to contribute my skills in a meaningful way.`,
      tips: [
        "Keep your answer to 2-3 minutes",
        "Focus on relevant experiences",
        "Connect your background to the role",
      ],
    },
    {
      question: "What are your greatest strengths?",
      suggestedAnswer:
        "My greatest strengths include problem-solving, adaptability, and strong communication skills. I consistently deliver results under pressure and work well in team environments.",
      tips: [
        "Choose 2-3 relevant strengths",
        "Provide specific examples",
        "Relate strengths to job requirements",
      ],
    },
    {
      question:
        "Describe a challenging situation you faced and how you handled it.",
      suggestedAnswer:
        "In my previous role, I faced a tight deadline on a critical project. I organized the team, prioritized tasks, and we successfully delivered on time with high quality results.",
      tips: [
        "Use the STAR method (Situation, Task, Action, Result)",
        "Choose a relevant example",
        "Highlight your problem-solving skills",
      ],
    },
    {
      question: `What do you know about our company?`,
      suggestedAnswer: `I've researched your company and I'm impressed by your commitment to innovation and excellence. Your recent achievements in the industry demonstrate strong leadership and vision.`,
      tips: [
        "Research the company beforehand",
        "Mention specific achievements or values",
        "Show genuine enthusiasm",
      ],
    },
    {
      question: "Why should we hire you for this position?",
      suggestedAnswer: `I bring a unique combination of skills, experience, and enthusiasm that makes me an ideal fit. My track record of success and ability to learn quickly will allow me to make immediate contributions to your team.`,
      tips: [
        "Highlight your unique value proposition",
        "Reference key job requirements",
        "Show confidence without arrogance",
      ],
    },
  ];
}

function generateInterviewTips(jobTitle: string): string[] {
  return [
    "💼 Research the company thoroughly before the interview",
    "👔 Dress professionally and arrive 10-15 minutes early",
    "📱 Bring multiple copies of your CV and a notepad",
    "🎯 Prepare specific examples of your achievements",
    "🤝 Practice your handshake and maintain good eye contact",
    "💬 Prepare thoughtful questions to ask the interviewer",
    "😊 Show enthusiasm and positive body language",
    "📧 Send a thank-you email within 24 hours after the interview",
  ];
}

// Initialize sample data for demo purposes
export const initializeSampleData = () => {
  if (!storage.get("sampleDataInitialized")) {
    // Sample job postings
    const sampleJobs = [
      {
        id: generateId(),
        title: "Senior Software Engineer",
        company: "TechCorp Nigeria",
        location: "Lagos, Nigeria",
        type: "Full-time",
        salary: "₦800,000 - ₦1,200,000/month",
        description:
          "We are looking for a senior software engineer with 5+ years of experience in React, Node.js, and cloud technologies.",
        requirements: [
          "5+ years experience",
          "React & Node.js",
          "Team leadership",
          "Excellent communication",
        ],
        posted: "2 days ago",
      },
      {
        id: generateId(),
        title: "Product Manager",
        company: "FinTech Solutions",
        location: "Abuja, Nigeria",
        type: "Full-time",
        salary: "₦600,000 - ₦900,000/month",
        description:
          "Join our team as a Product Manager to drive innovation in financial technology solutions.",
        requirements: [
          "3+ years PM experience",
          "Agile methodology",
          "Stakeholder management",
          "Data-driven",
        ],
        posted: "1 week ago",
      },
      {
        id: generateId(),
        title: "Marketing Specialist",
        company: "Brand Masters",
        location: "Port Harcourt, Nigeria",
        type: "Full-time",
        salary: "₦350,000 - ₦500,000/month",
        description:
          "Creative marketing specialist needed to develop and execute marketing campaigns.",
        requirements: [
          "2+ years experience",
          "Digital marketing",
          "Content creation",
          "Analytics",
        ],
        posted: "3 days ago",
      },
    ];

    storage.set("sampleJobs", sampleJobs);
    storage.set("sampleDataInitialized", true);
  }
};
