# JG IMPACT WEBSITE - COMPLETE SETUP & DEPLOYMENT GUIDE

---

## TABLE OF CONTENTS

1. Prerequisites & System Requirements
2. Local Development Setup (Step-by-Step)
3. Running the Application
4. Customization Guide
5. Deployment Instructions
6. Troubleshooting
7. Post-Launch Maintenance

---

## 1. PREREQUISITES & SYSTEM REQUIREMENTS

### Required Software

- **Node.js** 16.0+ or 18.0+ (Recommended: 18+)
- **npm** 7.0+ (comes with Node.js) OR **yarn** 1.22+
- **Git** (optional, for version control)
- **Visual Studio Code** or any text editor (optional)

### How to Check Your System

Open your terminal/command prompt and run:

```bash
node --version
# Should return: v18.x.x or higher

npm --version
# Should return: 8.x.x or higher
```

If you don't have Node.js installed:

1. Go to https://nodejs.org/
2. Download LTS version (18 or 20)
3. Run installer and follow on-screen instructions
4. Verify installation by running `node --version` again

### System Requirements

- **Disk Space:** 500MB minimum (for dependencies and builds)
- **RAM:** 2GB minimum
- **Internet:** Required for initial npm install
- **Operating System:** Windows, macOS, or Linux

---

## 2. LOCAL DEVELOPMENT SETUP (STEP-BY-STEP)

### Step 1: Extract Project Files

1. Locate the `jg-impact-web.zip` file
2. Extract it to your desired location:
   - **Windows:** Right-click → Extract All
   - **macOS:** Double-click the zip file
   - **Linux:** `unzip jg-impact-web.zip`

Example paths:
- Windows: `C:\Users\YourName\Documents\jg-impact-web`
- macOS: `/Users/YourName/Documents/jg-impact-web`
- Linux: `/home/username/jg-impact-web`

### Step 2: Open Terminal/Command Prompt

**Windows:**
1. Open File Explorer
2. Navigate to the project folder
3. Click the address bar and type `cmd`
4. Press Enter

**macOS/Linux:**
1. Open Terminal
2. Navigate: `cd /path/to/jg-impact-web`

### Step 3: Install Dependencies

In the project terminal, run:

```bash
npm install
```

**What this does:**
- Downloads all required packages
- Creates `node_modules` folder
- Generates `package-lock.json`
- Takes 2-5 minutes depending on internet speed

**If using Yarn:**
```bash
yarn install
```

### Step 4: Verify Installation

Check that a `node_modules` folder was created. If you see it, you're good to go.

---

## 3. RUNNING THE APPLICATION

### Local Development Server

In your project terminal, run:

```bash
npm run dev
```

**Expected output:**
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### Access the Website

1. Open your web browser (Chrome, Firefox, Safari, Edge)
2. Go to: **http://localhost:3000**
3. You should see the JG Impact website with all sections

### Making Changes

1. Edit any `.tsx` or `.css` file in `src/` folder
2. Save the file (Ctrl+S or Cmd+S)
3. Browser automatically refreshes (Hot Reload)
4. No need to restart the development server

### Stop Development Server

In terminal, press:
- **Windows/Linux:** `Ctrl + C`
- **macOS:** `Cmd + C`

Then type `y` and press Enter

---

## 4. CUSTOMIZATION GUIDE

### A. Update Contact Information

**File:** `src/components/Navigation.tsx`

Find and replace:
```typescript
// Original
href="tel:0703653555"

// New (your number)
href="tel:YOUR_PHONE_NUMBER"
```

**File:** `src/components/FloatingWhatsApp.tsx`

Find and replace:
```typescript
// Original
whatsappUrl = `https://wa.me/254703653555?text=...`

// New
whatsappUrl = `https://wa.me/YOUR_COUNTRY_CODE_PHONE?text=...`
```

**Example:** If your number is +254 723 456 789, use:
```
https://wa.me/254723456789
```

**File:** `src/components/Contact.tsx`

Update phone and email:
```typescript
href="tel:0703653555"  // Change phone
href="mailto:journeyimpact@gmail.com"  // Change email
```

**File:** `src/components/Footer.tsx`

Update emergency number and address

### B. Update Colors (Brand)

**File:** `tailwind.config.ts`

```typescript
colors: {
  'brand-navy': '#102E69',      // Main dark color
  'brand-green': '#3BA76C',     // Button/highlight color
  'brand-gold': '#C6943C',      // Accent color
  'brand-canvas': '#F8FAF8',    // Background
  // ... rest of colors
}
```

To use a color picker:
1. Go to https://color.adobe.com/
2. Choose your colors
3. Copy hex codes (e.g., #FF5733)
4. Paste into `tailwind.config.ts`

### C. Add or Change Facility Services

**File:** `src/components/Services.tsx`

Find the `SERVICES` array:

```typescript
const SERVICES = [
  {
    id: 1,
    title: 'Mental Health Assessment & Counselling',
    icon: Brain,
  },
  // Add more services like this:
  {
    id: 13,
    title: 'Your New Service Name',
    icon: Heart,  // Use any Lucide icon
  },
]
```

Available icons: https://lucide.dev/

### D. Update Facility Address

Find and update in these files:
- `src/components/Contact.tsx`
- `src/components/Footer.tsx`
- `src/components/Hero.tsx`

Replace:
```
Kenyatta Road, Juja
Behind Muigai Inn
```

With your facility address.

### E. Add Facility Images

1. Create a `public/images` folder (if doesn't exist)
2. Add your image files (.jpg, .png)
3. Update `src/components/FacilityGallery.tsx`:

```typescript
const GALLERY_ITEMS = [
  {
    id: 1,
    title: 'Private Living Rooms',
    image: 'images/your-image-1.jpg',  // Add path
  },
]
```

4. Replace placeholder divs with actual Image component:

```typescript
import Image from 'next/image'

<Image
  src="/images/your-image-1.jpg"
  alt="Living rooms"
  width={400}
  height={300}
  className="w-full h-full object-cover"
/>
```

### F. Change Website Title & SEO

**File:** `src/app/layout.tsx`

```typescript
export const metadata: Metadata = {
  title: 'JG Impact - Your New Title',
  description: 'Your updated description here',
  keywords: ['mental health', 'new', 'keywords'],
}
```

---

## 5. DEPLOYMENT INSTRUCTIONS

### Option A: Deploy to Vercel (Recommended, Free)

**Easiest option. Takes 5 minutes.**

1. Go to https://vercel.com/
2. Sign up (or log in) with GitHub, GitLab, or email
3. Click "New Project"
4. Select "Import Git Repository"
5. Paste your GitHub repo URL (if you pushed code there)
   - Or click "Deploy without Git" to upload files manually
6. Click "Import"
7. Configure project:
   - Framework: **Next.js**
   - Root Directory: **./jg-impact-web** (if deploying from parent folder)
   - Click "Deploy"
8. Wait 2-3 minutes for deployment
9. You'll get a live URL: `https://your-project-name.vercel.app`

**Share this URL with JG Impact team.**

### Option B: Deploy to Netlify (Free, Alternative)

1. Go to https://netlify.com/
2. Sign up (or log in)
3. Click "Add New Site" → "Import an existing project"
4. Select your Git provider or upload files
5. Configure:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Click "Deploy site"
7. Get your live URL within 2-5 minutes

### Option C: Deploy to Railway (Free Tier)

1. Go to https://railway.app/
2. Create account
3. Click "Create New Project"
4. Select "GitHub" or upload repo
5. Connect and deploy
6. Get live URL automatically

### Option D: Deploy to Your Own Server (VPS)

If you have a Linux server (AWS, DigitalOcean, Linode):

1. SSH into your server
2. Install Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. Clone/upload project:
   ```bash
   git clone <your-repo-url>
   cd jg-impact-web
   npm install
   npm run build
   ```

4. Start the application:
   ```bash
   npm start
   ```

5. Use PM2 to keep it running:
   ```bash
   npm install -g pm2
   pm2 start "npm start" --name "jg-impact"
   pm2 startup
   pm2 save
   ```

6. Set up reverse proxy (Nginx):
   ```bash
   sudo apt install nginx
   # Configure nginx to proxy to localhost:3000
   ```

---

## 6. TROUBLESHOOTING

### Problem: "npm command not found"

**Solution:**
- Reinstall Node.js from https://nodejs.org/
- Restart terminal/command prompt

### Problem: "Port 3000 already in use"

**Solution:**
```bash
# macOS/Linux - Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Windows - Use different port
npm run dev -- -p 3001
```

Then access http://localhost:3001

### Problem: Dependencies installation fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Problem: CSS/styles not loading

**Solution:**
1. Check that Tailwind classes are correctly spelled
2. Ensure `globals.css` is imported in `src/app/layout.tsx`
3. Rebuild project:
   ```bash
   npm run build
   ```

### Problem: Images not showing in gallery

**Solution:**
1. Verify image paths start with `/` (absolute path)
2. Ensure images are in `public/` folder
3. Check image file names (case-sensitive on Linux)
4. Use formats: .jpg, .png, .webp, .gif

### Problem: Booking form not working

**Solution:**
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Verify form validation logic in `src/components/BookingModal.tsx`
4. Check that all required fields are filled

### Problem: WhatsApp button not opening

**Solution:**
1. Verify phone number format: `https://wa.me/254703653555` (no + sign)
2. Test on phone (desktop browsers may have restrictions)
3. Check that WhatsApp is installed on device

---

## 7. POST-LAUNCH MAINTENANCE

### Weekly Tasks

- [ ] Test all contact links work
- [ ] Verify phone numbers are correct
- [ ] Check that booking form submissions work
- [ ] Test on mobile devices

### Monthly Tasks

- [ ] Update service descriptions if needed
- [ ] Monitor website performance
- [ ] Check for broken images
- [ ] Review booking inquiries

### Update Dependencies (Every 3-6 months)

```bash
npm update
npm outdated  # Check for newer versions
```

### Backup Your Code

```bash
# Create backup
tar -czf jg-impact-backup.tar.gz jg-impact-web/

# Or use Git
git add .
git commit -m "Backup before update"
git push
```

### Monitor Performance

- Use https://gtmetrix.com/ for speed testing
- Check Google Analytics for traffic
- Monitor Core Web Vitals

### Security

1. Keep Node.js updated
2. Run `npm audit` monthly:
   ```bash
   npm audit
   npm audit fix  # Auto-fix vulnerabilities
   ```

3. Never commit `.env` files with secrets
4. Use environment variables for sensitive data

---

## QUICK START COMMAND REFERENCE

```bash
# Extract and setup
cd jg-impact-web
npm install

# Development
npm run dev          # Start dev server (localhost:3000)

# Production
npm run build        # Create optimized build
npm start           # Start production server

# Maintenance
npm run lint        # Check code quality
npm outdated        # Check for updates
npm audit           # Security audit
```

---

## CONTACT & SUPPORT

**For Questions:**

1. Check README.md in project root
2. Review code comments in component files
3. Visit Next.js docs: https://nextjs.org/docs
4. Visit Tailwind docs: https://tailwindcss.com/docs

**For Feature Additions:**

1. Contact JG Impact team
2. Provide clear requirements
3. Developer can implement and redeploy

---

## FILE TREE REFERENCE

```
jg-impact-web/
├── src/
│   ├── app/
│   │   ├── globals.css           (Global styles)
│   │   ├── layout.tsx             (Root layout)
│   │   └── page.tsx               (Homepage)
│   └── components/
│       ├── Navigation.tsx          (Top header)
│       ├── Hero.tsx                (Hero section)
│       ├── Services.tsx            (Services grid)
│       ├── FacilityGallery.tsx     (Photo gallery)
│       ├── BookingModal.tsx        (Appointment booking)
│       ├── Contact.tsx             (Contact section)
│       ├── Footer.tsx              (Footer)
│       └── FloatingWhatsApp.tsx    (WhatsApp button)
├── public/                         (Static assets - add images here)
├── node_modules/                   (Dependencies - created by npm install)
├── .gitignore                      (Git ignore rules)
├── next.config.js                  (Next.js config)
├── tailwind.config.ts              (Tailwind design tokens)
├── tsconfig.json                   (TypeScript config)
├── package.json                    (Dependencies & scripts)
└── README.md                       (Project overview)
```

---

## ENVIRONMENT VARIABLES (Optional)

Create `.env.local` file in project root:

```
NEXT_PUBLIC_FACILITY_PHONE=0703653555
NEXT_PUBLIC_FACILITY_EMAIL=journeyimpact@gmail.com
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

These can be used throughout the app via:
```typescript
process.env.NEXT_PUBLIC_FACILITY_PHONE
```

---

## SUCCESS CHECKLIST

After setup, verify:

- [ ] Development server starts without errors
- [ ] Website loads at http://localhost:3000
- [ ] All navigation links work
- [ ] Booking modal opens and closes
- [ ] Contact links are clickable
- [ ] WhatsApp button links to correct number
- [ ] Mobile menu works on small screens
- [ ] Colors match brand guidelines
- [ ] No console errors (F12 → Console tab)

---

## FINAL NOTES

- **Backup Original:** Keep the downloaded zip as backup
- **Save Customizations:** Keep notes of any changes made
- **Version Control:** Use Git to track changes
- **Testing:** Always test changes before deploying
- **Mobile First:** Test on real mobile devices

---

**Deployment Recommendation:** Use Vercel (easiest, fastest).

**Estimated Time for Full Setup:** 15-30 minutes

Good luck! 🚀
