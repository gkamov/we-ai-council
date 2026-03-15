# Quick Deployment Checklist

Follow these steps in order:

## ✅ Before You Start
- [ ] You have a GitHub account
- [ ] You have an Anthropic API key
- [ ] Code is in a local folder

## ✅ Step 1: GitHub (5 minutes)

```bash
# In your project folder:
git init
git add .
git commit -m "Initial WE-AI Council"
git branch -M main

# Create repo on github.com/new, then:
git remote add origin https://github.com/YOUR-USERNAME/we-ai-council.git
git push -u origin main
```

## ✅ Step 2: Vercel (5 minutes)

1. Go to vercel.com → Sign up with GitHub
2. Click "Add New..." → "Project"
3. Import your `we-ai-council` repo
4. Framework: "Other"
5. Add environment variable:
   - Name: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-api03-...` (your key)
6. Click "Deploy"

## ✅ Step 3: Test (2 minutes)

1. Visit your deployed URL (shows in Vercel)
2. Try example question
3. Verify three perspectives appear

## ✅ Done!

Your WE-AI Council is live at: `https://your-project.vercel.app`

---

## Common Issues

**"Failed to get perspectives"**
→ Check API key in Vercel: Project Settings → Environment Variables

**"CORS error"**
→ Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)

**Slow first load**
→ Normal (serverless cold start). Subsequent loads faster.

---

## What Next?

- Share your URL on LinkedIn
- Demo to potential clients
- Gather feedback
- Add more perspectives
- Customize for your use case

**Total time:** ~12 minutes from code to live deployment.
