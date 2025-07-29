# 🚀 How to Set Up Real Publishing Services

The AI Web Builder publish feature supports multiple hosting services. Follow these steps to enable real publishing:

## 📋 Quick Setup Checklist

1. **Copy Environment File**
   ```bash
   cd frontend
   cp .env.example .env
   ```

2. **Choose Your Service(s)**
   - ✅ Netlify (Recommended for beginners)
   - ✅ GitHub Pages (Great for developers)
   - ✅ Vercel (Modern hosting)

3. **Get API Keys** (see detailed instructions below)

4. **Add to .env file**

5. **Restart your development server**

---

## 🔧 Service Setup Instructions

### 1. 🌐 Netlify (Recommended)

**Why Netlify?**
- ✅ Free tier with SSL
- ✅ Easy setup
- ✅ Instant deployments
- ✅ Custom domains

**Setup Steps:**

1. **Create Netlify Account**
   - Go to [netlify.com](https://netlify.com)
   - Sign up for free

2. **Get API Token**
   - Go to [User Settings → Applications](https://app.netlify.com/user/applications/personal)
   - Click "New access token"
   - Give it a name (e.g., "AI Web Builder")
   - Copy the token

3. **Add to .env**
   ```env
   REACT_APP_NETLIFY_API_TOKEN=your_token_here
   REACT_APP_DEMO_MODE=false
   ```

### 2. 🐙 GitHub Pages

**Why GitHub Pages?**
- ✅ Free for public repos
- ✅ Version control included
- ✅ Great for portfolios
- ✅ Custom domains

**Setup Steps:**

1. **Create GitHub Account**
   - Go to [github.com](https://github.com)
   - Sign up if you don't have an account

2. **Create Personal Access Token**
   - Go to [Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
   - Click "Generate new token (classic)"
   - Select scopes: `repo`, `public_repo`
   - Copy the token

3. **Add to .env**
   ```env
   REACT_APP_GITHUB_TOKEN=your_token_here
   REACT_APP_GITHUB_USERNAME=your_github_username
   REACT_APP_DEMO_MODE=false
   ```

### 3. ▲ Vercel

**Why Vercel?**
- ✅ Lightning fast
- ✅ Edge functions
- ✅ Great performance
- ✅ Modern architecture

**Setup Steps:**

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up for free

2. **Get API Token**
   - Go to [Account Settings → Tokens](https://vercel.com/account/tokens)
   - Create a new token
   - Copy the token

3. **Add to .env**
   ```env
   REACT_APP_VERCEL_TOKEN=your_token_here
   REACT_APP_DEMO_MODE=false
   ```

---

## 📁 Complete .env Example

```env
# Publishing Service Configuration

# Netlify (Free tier available)
REACT_APP_NETLIFY_API_TOKEN=netlify_your_token_here

# GitHub (Free for public repos)
REACT_APP_GITHUB_TOKEN=ghp_your_token_here
REACT_APP_GITHUB_USERNAME=your_username

# Vercel (Free tier available)
REACT_APP_VERCEL_TOKEN=your_vercel_token_here

# Set to false when you have real API keys
REACT_APP_DEMO_MODE=false
```

---

## 🔄 After Setup

1. **Restart Development Server**
   ```bash
   npm start
   ```

2. **Check Configuration**
   - In the publish panel, click the "⚙️ Config" button
   - Verify your services show "✅ Configured"

3. **Test Publishing**
   - Generate some code with AI
   - Try publishing to your configured service
   - Share your live URL!

---

## 🆘 Troubleshooting

### Common Issues

**❌ "API token not configured"**
- Make sure you added the token to `.env`
- Restart your development server
- Check for typos in variable names

**❌ "Failed to create GitHub repository"**
- Check your GitHub token has `repo` permissions
- Make sure your username is correct
- Try creating a test repo manually first

**❌ "Netlify API error: 401"**
- Your token might be expired
- Generate a new token from Netlify
- Update your `.env` file

### Getting Help

1. Check the browser console for detailed error messages
2. Verify your API tokens are still valid
3. Make sure environment variables start with `REACT_APP_`
4. Restart your development server after changes

---

## 🎉 Success!

Once configured, you'll have:
- ✅ One-click publishing to professional hosting
- ✅ Shareable URLs for your AI projects
- ✅ History of all published projects
- ✅ Easy project management

Your AI-generated websites will be live and accessible to anyone on the internet! 🌍
