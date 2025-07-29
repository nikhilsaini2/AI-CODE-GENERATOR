# 🌐 How to Get Netlify API Token (Step-by-Step)

## 📋 Complete Netlify Setup Guide

### **Step 1: Create Netlify Account**

1. **Go to Netlify**
   ```
   🔗 https://netlify.com
   ```

2. **Sign Up Options:**
   - Click "Sign up" (top right)
   - Choose one of these options:
     - ✅ **Email** (easiest)
     - ✅ **GitHub** (if you have GitHub)
     - ✅ **GitLab** 
     - ✅ **Bitbucket**

3. **Complete Registration**
   - Fill in your details
   - Verify your email if needed
   - You'll be taken to your dashboard

---

### **Step 2: Get Your API Token**

1. **Go to Personal Access Tokens**
   ```
   🔗 https://app.netlify.com/user/applications/personal
   ```
   
   *OR manually navigate:*
   - Click your profile picture (top right)
   - Click "User settings"
   - Click "Applications" in the sidebar
   - Click "Personal access tokens"

2. **Create New Token**
   - Click **"New access token"** button
   - Give it a description like: `AI Web Builder`
   - Click **"Generate token"**

3. **Copy Your Token**
   - ⚠️ **IMPORTANT**: Copy the token immediately!
   - It looks like: `nfp_abc123xyz789...`
   - You won't be able to see it again

---

### **Step 3: Add Token to Your Project**

1. **Open Your .env File**
   ```bash
   # Navigate to your project folder
   cd /Users/shivammourya/cohot/GenAI/Web_Agent/ai-code-editor/frontend
   
   # Open .env file in any text editor
   # You can use VS Code, nano, vim, or any editor
   ```

2. **Add Your Token**
   ```env
   # Find this line in your .env file:
   REACT_APP_NETLIFY_API_TOKEN=
   
   # Replace it with your actual token:
   REACT_APP_NETLIFY_API_TOKEN=nfp_your_actual_token_here
   
   # Also change demo mode:
   REACT_APP_DEMO_MODE=false
   ```

3. **Save the File**
   - Save your .env file
   - Make sure there are no extra spaces

---

### **Step 4: Restart Your Server**

```bash
# Stop your current server (if running):
Ctrl + C

# Start it again:
npm start
```

---

### **Step 5: Test It Works**

1. **Check Configuration**
   - Go to your AI Web Builder app
   - Scroll to the publish panel (left sidebar)
   - Click "⚙️ Config" button
   - You should see: "Netlify: ✅ Configured"

2. **Test Publishing**
   - Generate some code with AI
   - Click "🚀 Publish" button
   - Select "Netlify" from dropdown
   - Click "Publish to Web"
   - You'll get a REAL URL like: `https://random-name.netlify.app`

---

## 🎉 **What You'll Get With Netlify:**

- ✅ **Free hosting** (100 GB bandwidth/month)
- ✅ **Custom domains** (if you have one)
- ✅ **SSL certificates** (automatic HTTPS)
- ✅ **Global CDN** (fast worldwide)
- ✅ **Form handling** (for contact forms)
- ✅ **No credit card** required for free tier

---

## 🔍 **Visual Example:**

**Your token will look like this:**
```
nfp_abc123xyz789defghijk456789lmnopqrs
```

**Your .env file should look like this:**
```env
# Netlify (Free tier available)
REACT_APP_NETLIFY_API_TOKEN=nfp_abc123xyz789defghijk456789lmnopqrs

# Demo mode
REACT_APP_DEMO_MODE=false
```

---

## ❗ **Important Notes:**

1. **Keep Your Token Secret**
   - Don't share it publicly
   - Don't commit it to GitHub
   - The .env file is already in .gitignore

2. **Token Permissions**
   - The token gives full access to your Netlify account
   - Only use it in secure environments

3. **Free Tier Limits**
   - 100 GB bandwidth/month
   - 300 build minutes/month
   - Unlimited sites

---

## 🆘 **Troubleshooting:**

**❌ "Netlify API token not configured"**
- Check you added the token to .env file
- Make sure there are no extra spaces
- Restart your development server

**❌ "Netlify API error: 401"**
- Your token might be wrong or expired
- Generate a new token from Netlify
- Update your .env file

**❌ Token not working**
- Make sure the variable name is exactly: `REACT_APP_NETLIFY_API_TOKEN`
- Check there are no quotes around the token
- Restart your server after changes

---

## 🚀 **Ready to Publish!**

Once this is set up, you can:
- Publish unlimited projects
- Get instant shareable URLs
- Deploy in seconds, not minutes
- Share your AI creations with the world!

**That's it! Your AI Web Builder now has real publishing power! 🎉**
