# WE-AI Council Mode - Deployment Guide

## Deploy to Vercel (Recommended - Free & Fast)

### Prerequisites
- GitHub account
- Vercel account (free - sign up at vercel.com)
- Anthropic API key

### Step 1: Push to GitHub

1. **Create a new repository on GitHub:**
   - Go to github.com/new
   - Name it: `we-ai-council`
   - Make it public or private (your choice)
   - Don't initialize with README (we have one)

2. **Push your code:**
   ```bash
   cd we-ai-prototype
   git init
   git add .
   git commit -m "Initial commit - WE-AI Council Mode"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/we-ai-council.git
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. **Go to Vercel:**
   - Visit vercel.com
   - Click "Sign Up" (or "Log In")
   - Choose "Continue with GitHub"

2. **Import your repository:**
   - Click "Add New..." → "Project"
   - Find your `we-ai-council` repository
   - Click "Import"

3. **Configure the project:**
   - **Framework Preset:** Other
   - **Root Directory:** ./
   - Leave other settings as default
   - Click "Deploy"

4. **Add Environment Variable:**
   - While deploying, click "Environment Variables"
   - Add: `ANTHROPIC_API_KEY` = `your-api-key-here`
   - Click "Add"
   - If you missed this step, go to Project Settings → Environment Variables after deployment

5. **Wait for deployment:**
   - Takes ~2 minutes
   - You'll get a URL like: `we-ai-council.vercel.app`

### Step 3: Test Your Deployment

1. Visit your Vercel URL
2. Try the example questions
3. Verify all three perspectives appear

### Step 4: Share

Your WE-AI Council is now live! Share the URL:
- On LinkedIn/Twitter
- With potential partners
- In your essay
- With Innovation Clusters participants

## Troubleshooting

### "Failed to get council perspectives"
- Check Vercel logs: Project → Deployments → Click latest → Functions tab
- Verify ANTHROPIC_API_KEY is set correctly
- Make sure you have API credits in your Anthropic account

### CORS errors
- The API is configured for CORS
- If issues persist, check browser console for specific error

### Slow responses
- First request after inactivity may take ~10 seconds (cold start)
- Subsequent requests should be faster
- Each council query takes ~10-15 seconds (three parallel API calls)

## Update Your Deployment

After making changes:

```bash
git add .
git commit -m "Description of changes"
git push
```

Vercel will automatically redeploy in ~2 minutes.

## Custom Domain (Optional)

1. Go to Vercel project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Example: `council.redpaperplane.com`

## Cost

**Vercel:** Free (generous free tier)
**Anthropic API:** ~$0.03-0.05 per council query

For 1000 queries/month: ~$30-50 in API costs

## Monitoring

Check usage in:
- Vercel: Project → Analytics (free tier included)
- Anthropic: console.anthropic.com → Usage

## Security Notes

- Your API key is secure (environment variable, not in code)
- Rate limiting is handled by Anthropic
- Consider adding authentication if you get heavy traffic
- Monitor API usage to avoid unexpected costs

## Next Steps

Once deployed:
1. Test with real questions
2. Share with colleagues/clients
3. Gather feedback
4. Iterate on perspectives and UX
5. Consider adding more lenses based on usage

## Support

If you run into issues:
- Check Vercel logs
- Check Anthropic API status
- Review browser console for frontend errors
- Verify environment variables are set

---

**You're now running WE-AI in production!**

The proof of concept is live. Now you can:
- Demo it to organizations
- Include it in talks/presentations
- Use it as foundation for consulting engagements
- Extend it with more features

This is infrastructure for collective intelligence, publicly accessible.
