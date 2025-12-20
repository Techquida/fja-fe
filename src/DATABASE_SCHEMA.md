# ResumeGenie Database Schema

This document outlines the database schema for ResumeGenie. While the current implementation uses localStorage, this schema is designed for easy migration to a proper database (e.g., PostgreSQL with Supabase).

## Tables

### users
Main user accounts table.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  password_hash VARCHAR(255) NOT NULL,
  points INTEGER DEFAULT 1,
  referral_code VARCHAR(20) UNIQUE NOT NULL,
  referred_by VARCHAR(20),
  first_free_used BOOLEAN DEFAULT FALSE,
  streak INTEGER DEFAULT 0,
  last_active_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_referral_code ON users(referral_code);
```

### cvs
CV documents and their processing history.

```sql
CREATE TABLE cvs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  original_content TEXT NOT NULL,
  fixed_content TEXT,
  job_description TEXT,
  fix_type VARCHAR(20) CHECK (fix_type IN ('basic', 'smart', 'full')),
  match_score INTEGER CHECK (match_score >= 0 AND match_score <= 100),
  improvements JSONB,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed')),
  file_type VARCHAR(10) CHECK (file_type IN ('pdf', 'docx', 'text')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cvs_user_id ON cvs(user_id);
CREATE INDEX idx_cvs_created_at ON cvs(created_at DESC);
```

### cover_letters
Generated cover letters.

```sql
CREATE TABLE cover_letters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  job_title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  job_description TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cover_letters_user_id ON cover_letters(user_id);
CREATE INDEX idx_cover_letters_created_at ON cover_letters(created_at DESC);
```

### interview_preps
Interview preparation sessions.

```sql
CREATE TABLE interview_preps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  job_title VARCHAR(255) NOT NULL,
  job_description TEXT NOT NULL,
  questions JSONB NOT NULL,
  tips JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_interview_preps_user_id ON interview_preps(user_id);
```

### job_applications
Job application tracking.

```sql
CREATE TABLE job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  cv_id UUID REFERENCES cvs(id) ON DELETE SET NULL,
  cover_letter_id UUID REFERENCES cover_letters(id) ON DELETE SET NULL,
  job_title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  job_description TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'applied' CHECK (status IN ('applied', 'reviewing', 'interview', 'rejected', 'accepted')),
  notes TEXT,
  applied_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_job_applications_user_id ON job_applications(user_id);
CREATE INDEX idx_job_applications_status ON job_applications(status);
CREATE INDEX idx_job_applications_applied_at ON job_applications(applied_at DESC);
```

### points_transactions
Points purchase and usage history.

```sql
CREATE TABLE points_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('purchase', 'referral', 'welcome', 'usage', 'bonus')),
  description VARCHAR(255) NOT NULL,
  balance INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_points_transactions_user_id ON points_transactions(user_id);
CREATE INDEX idx_points_transactions_created_at ON points_transactions(created_at DESC);
```

### referrals
Referral tracking.

```sql
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referred_email VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  points_earned INTEGER DEFAULT 2,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX idx_referrals_status ON referrals(status);
```

### notifications
User notifications.

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('info', 'success', 'warning', 'promo')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  action_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

### payments
Payment transaction records.

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  points INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'NGN',
  payment_method VARCHAR(50) DEFAULT 'paystack',
  payment_reference VARCHAR(255) UNIQUE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_reference ON payments(payment_reference);
```

## Relationships

```
users
  ├── cvs (one-to-many)
  ├── cover_letters (one-to-many)
  ├── interview_preps (one-to-many)
  ├── job_applications (one-to-many)
  ├── points_transactions (one-to-many)
  ├── referrals (one-to-many as referrer)
  ├── notifications (one-to-many)
  └── payments (one-to-many)

job_applications
  ├── cv (many-to-one)
  └── cover_letter (many-to-one)
```

## Row Level Security (RLS) Policies

For Supabase implementation, enable RLS on all tables:

```sql
-- Example RLS policies for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Example RLS policies for cvs table
ALTER TABLE cvs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own CVs"
  ON cvs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own CVs"
  ON cvs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own CVs"
  ON cvs FOR UPDATE
  USING (auth.uid() = user_id);

-- Apply similar policies to all other tables
```

## Triggers

### Update timestamps

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_cvs_updated_at
  BEFORE UPDATE ON cvs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON job_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

### Auto-generate referral code

```sql
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.referral_code = UPPER(SUBSTRING(NEW.name FROM 1 FOR 3) || 
                            SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 5));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_user_referral_code
  BEFORE INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION generate_referral_code();
```

## Migration Notes

1. **User Authentication**: Use Supabase Auth for user management
2. **File Storage**: Use Supabase Storage for CV files (PDF/DOCX)
3. **Real-time**: Enable real-time subscriptions for notifications
4. **Edge Functions**: Create edge functions for:
   - Payment processing (Paystack webhook)
   - AI CV processing
   - Email notifications

## Indexes for Performance

Additional indexes for common queries:

```sql
-- User queries
CREATE INDEX idx_users_created_at ON users(created_at DESC);
CREATE INDEX idx_users_points ON users(points);

-- CV search and filtering
CREATE INDEX idx_cvs_status ON cvs(status);
CREATE INDEX idx_cvs_fix_type ON cvs(fix_type);

-- Transaction queries
CREATE INDEX idx_points_transactions_type ON points_transactions(type);
```

## Data Retention

Consider implementing data retention policies:

```sql
-- Example: Delete old notifications after 90 days
DELETE FROM notifications 
WHERE created_at < NOW() - INTERVAL '90 days' 
AND read = TRUE;

-- Archive old CVs after 1 year
CREATE TABLE cvs_archive (LIKE cvs INCLUDING ALL);

INSERT INTO cvs_archive 
SELECT * FROM cvs 
WHERE created_at < NOW() - INTERVAL '1 year';

DELETE FROM cvs 
WHERE created_at < NOW() - INTERVAL '1 year';
```

## Sample Queries

### Get user stats

```sql
SELECT 
  u.name,
  u.points,
  COUNT(DISTINCT c.id) as total_cvs,
  COUNT(DISTINCT cl.id) as total_cover_letters,
  COUNT(DISTINCT ja.id) as total_applications,
  SUM(CASE WHEN pt.amount > 0 THEN pt.amount ELSE 0 END) as total_points_purchased
FROM users u
LEFT JOIN cvs c ON u.id = c.user_id
LEFT JOIN cover_letters cl ON u.id = cl.user_id
LEFT JOIN job_applications ja ON u.id = ja.user_id
LEFT JOIN points_transactions pt ON u.id = pt.user_id AND pt.type = 'purchase'
WHERE u.id = $1
GROUP BY u.id, u.name, u.points;
```

### Get referral leaderboard

```sql
SELECT 
  u.name,
  u.referral_code,
  COUNT(r.id) as total_referrals,
  SUM(r.points_earned) as total_points_earned
FROM users u
LEFT JOIN referrals r ON u.id = r.referrer_id AND r.status = 'completed'
GROUP BY u.id, u.name, u.referral_code
ORDER BY total_referrals DESC
LIMIT 10;
```

### Get application success rate

```sql
SELECT 
  COUNT(CASE WHEN status IN ('interview', 'accepted') THEN 1 END)::FLOAT / 
  COUNT(*)::FLOAT * 100 as success_rate
FROM job_applications
WHERE user_id = $1;
```
