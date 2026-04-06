# 🚀 LinkNest Backend Setup Guide

## Complete Backend Setup - Choose ONE Option

---

### ⭐ **Option 1: TiDB Cloud (EASIEST - FREE, 5 Minutes)**

**This is the RECOMMENDED option - no installation needed!**

#### Step 1: Create FREE Database (5 minutes)
1. Go to: **https://tidbcloud.com/**
2. Click **"Sign Up"** (use Google or GitHub - it's FREE)
3. Click **"Create Cluster"**
4. Choose:
   - **Serverless** (FREE tier - 5GB storage)
   - **Region**: Choose closest to you (AWS/GCP)
5. Click **"Create"** and wait 2-3 minutes

#### Step 2: Get Connection String
1. Click your cluster name
2. Click **"Connect"** button
3. In the dialog, select **"General connection string"**
4. Choose **"Standard"** (not read-only)
5. **Copy the connection string** (looks like):
   ```
   mysql://xxxxxxxx:xxxxxxxx@xxxxxxxx.xxx.internal:3306/linknest
   ```

#### Step 3: Update .env.local
Open `.env.local` file and replace this line:
```env
DATABASE_URL=mysql://root:password@localhost:3306/linknest
```

With your TiDB connection string:
```env
DATABASE_URL=mysql://your_user:your_password@host.us-east-1.xxx.internal:3306/linknest
```

#### Step 4: Create Database
In TiDB Cloud dashboard:
1. Click **"SQL Editor"** in left menu
2. Run this command:
   ```sql
   CREATE DATABASE IF NOT EXISTS linknest;
   ```

#### Step 5: Run Migrations
Open your terminal and run:
```bash
cd "c:\Users\Suraj\Downloads\linknest (1)"
npx drizzle-kit push
```

#### Step 6: Start Backend
```bash
npm run dev
```

**✅ DONE!** Your backend is now running!

---

### 🚀 **Option 2: Railway (All-in-One Deployment)**

**Deploy everything to the cloud in one click!**

1. **Sign up**: https://railway.app/
2. **New Project** → **Deploy from GitHub repo**
3. **Add Database**:
   - Click **+ New**
   - Search **"MySQL"**
   - Click **"Add MySQL"**
4. **Connect Variables**:
   - Railway auto-creates `DATABASE_URL` variable
5. **Deploy**:
   - Railway will deploy your backend
   - Database will be ready in 2 minutes
6. **Run Migrations**:
   - Open Railway shell
   - Run: `npx drizzle-kit push`

**✅ DONE!** Your SaaS is live on the internet!

---

### 💻 **Option 3: Local MySQL (Requires Installation)**

**If you want to install MySQL locally:**

#### Install MySQL:
1. Download: https://dev.mysql.com/downloads/installer/
2. Run installer
3. Choose **"Server only"**
4. Set root password (remember it!)
5. Complete installation

#### Create Database:
Open Command Prompt:
```bash
mysql -u root -p
# Enter your root password
CREATE DATABASE linknest;
exit;
```

#### Update .env.local:
```env
DATABASE_URL=mysql://root:YOUR_ROOT_PASSWORD@localhost:3306/linknest
```

#### Run Migrations:
```bash
npx drizzle-kit push
```

#### Start Backend:
```bash
npm run dev
```

---

### 🐳 **Option 4: Docker (If Docker Daemon is Running)**

**Start Docker Desktop first, then:**

```bash
# Start MySQL container
docker-compose up -d

# Wait 30 seconds for MySQL to start
timeout 30

# Run migrations
npx drizzle-kit push

# Start backend
npm run dev
```

**Docker creates database automatically with:**
```env
DATABASE_URL=mysql://linknest:linknest123@localhost:3306/linknest
```

---

## 📋 **After Database is Connected:**

### 1. Run Database Migrations
```bash
npx drizzle-kit push
```

This creates all 17 tables:
- ✅ users
- ✅ profiles
- ✅ links
- ✅ subscriptions
- ✅ analytics
- ✅ admin_config
- ✅ feedbacks
- ✅ blog_posts
- ✅ newsletter_subscribers
- ✅ contact_submissions
- ✅ notifications
- ✅ team_members
- ✅ rate_limits
- ✅ invoices
- ✅ coupons

### 2. Create Admin User (Optional)
Run this SQL in your database:
```sql
INSERT INTO users (email, password, name, role, emailVerified) 
VALUES (
  'admin@linknest.com',
  '$2a$10$YourHashedPasswordHere',
  'Admin User',
  'admin',
  true
);
```

Or use the signup page and manually update:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Test Full Flow
1. Go to: http://localhost:3000
2. Sign up with email/password
3. Verify email (check console for link)
4. Login
5. Access dashboard
6. Create links
7. View analytics

---

## 🎯 **Quick Start Commands:**

```bash
# 1. Navigate to project
cd "c:\Users\Suraj\Downloads\linknest (1)"

# 2. Update DATABASE_URL in .env.local (see options above)

# 3. Run migrations
npx drizzle-kit push

# 4. Start backend
npm run dev

# 5. Open browser
# http://localhost:3000
```

---

## ✅ **Checklist After Setup:**

- [ ] Database created (TiDB/Local/Railway)
- [ ] DATABASE_URL set in .env.local
- [ ] Migrations run successfully (`npx drizzle-kit push`)
- [ ] Server started (`npm run dev`)
- [ ] Can access http://localhost:3000
- [ ] Can sign up
- [ ] Can login
- [ ] Can access dashboard
- [ ] Can create links

---

## 🆘 **Troubleshooting:**

### "DATABASE_URL is not defined"
→ Add `DATABASE_URL=mysql://...` to `.env.local`

### "ECONNREFUSED" or "Network Failure"
→ Database is not running or connection string is wrong

### "Table doesn't exist"
→ Run `npx drizzle-kit push`

### "Access denied for user"
→ Check username/password in DATABASE_URL

---

## 📞 **Need Help?**

1. Check database is running
2. Verify DATABASE_URL format:
   ```
   mysql://username:password@hostname:port/database
   ```
3. Test connection:
   ```bash
   # For TiDB or remote:
   mysql -h hostname -u username -p
   
   # For local:
   mysql -u root -p
   ```

---

**Recommended:** Use **TiDB Cloud** - it's FREE, takes 5 minutes, and works perfectly! 🎉
