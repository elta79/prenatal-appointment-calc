# Netlify Deployment Guide

This guide provides step-by-step instructions for deploying the Prenatal Appointment Calculator to Netlify.

## Quick Start (Recommended)

The fastest way to deploy is using the Netlify CLI:

### 1. Install Netlify CLI

```bash
npm install -g netlify-cli
```

### 2. Build the Project

```bash
npm run build
```

### 3. Deploy to Netlify

```bash
netlify deploy
```

Follow the prompts:
- Log in to your Netlify account when prompted
- Choose "Create & configure a new site"
- Select your team
- Enter a site name (optional - a random name will be generated if you skip this)
- When asked for the deploy path, enter: `dist`

### 4. Deploy to Production

Once you've verified the preview deployment works correctly:

```bash
netlify deploy --prod
```

Your site is now live! The CLI will provide you with the production URL.

---

## Alternative Deployment Methods

### Method 2: GitHub/GitLab/Bitbucket Integration

This method enables automatic deployments when you push to your repository.

1. **Initialize Git and Push to Repository**

```bash
git init
git add .
git commit -m "Initial commit: Prenatal Appointment Calculator"
git branch -M main
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```

2. **Connect to Netlify**

   - Go to [app.netlify.com](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose your Git provider (GitHub, GitLab, or Bitbucket)
   - Select your repository
   - Configure build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
   - Click "Deploy site"

3. **Automatic Deployments**

   Any future commits to your main branch will automatically trigger a new deployment.

### Method 3: Manual Drag & Drop

Perfect for quick deployments without Git or CLI:

1. **Build the Project**

```bash
npm run build
```

2. **Deploy via Netlify Drop**

   - Go to [app.netlify.com/drop](https://app.netlify.com/drop)
   - Drag and drop the `dist` folder onto the page
   - Your site will be deployed instantly!

---

## Configuration Files

The project includes a `netlify.toml` file with the following configuration:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

This ensures:
- Netlify knows how to build your project
- The correct directory is published
- Client-side routing works correctly (SPA redirect)

---

## Custom Domain (Optional)

After deploying, you can add a custom domain:

1. Go to your site's dashboard on Netlify
2. Click "Domain settings"
3. Click "Add custom domain"
4. Follow the instructions to configure your DNS

---

## Environment Variables

This application doesn't require any environment variables for basic functionality.

If you need to add environment variables in the future:

1. Go to your site's dashboard on Netlify
2. Click "Site settings" → "Environment variables"
3. Click "Add a variable"
4. Enter the key and value

---

## Troubleshooting

### Build Fails

If the build fails on Netlify:

1. Check that Node.js version is compatible (18.x or higher)
2. Verify all dependencies are in `package.json`
3. Check the build logs for specific error messages

### Site Doesn't Load Correctly

1. Verify the publish directory is set to `dist`
2. Check that the redirect rule in `netlify.toml` is in place
3. Clear your browser cache

### Need Help?

- [Netlify Documentation](https://docs.netlify.com/)
- [Netlify Community Forums](https://answers.netlify.com/)
- [Netlify Support](https://www.netlify.com/support/)

---

## Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] Date input works
- [ ] All appointment calculations display correctly
- [ ] Print functionality works
- [ ] Gestational age toggle works
- [ ] Mobile responsive design works
- [ ] All colors display correctly
- [ ] Custom domain configured (if applicable)

---

## Updating Your Deployment

### With Netlify CLI

```bash
npm run build
netlify deploy --prod
```

### With Git Integration

Simply push your changes:

```bash
git add .
git commit -m "Your update message"
git push
```

Netlify will automatically rebuild and deploy.

### Manual Update

1. Build the project: `npm run build`
2. Go to your site's "Deploys" tab on Netlify
3. Drag and drop the new `dist` folder

---

Congratulations! Your Prenatal Appointment Calculator is now live on Netlify! 🎉
