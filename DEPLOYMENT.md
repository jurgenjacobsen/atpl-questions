# GitHub Pages Deployment Guide

This document explains how to deploy the ATPL Questions app to GitHub Pages.

## Automatic Deployment (Recommended)

The repository includes a GitHub Actions workflow that automatically builds and deploys the app to GitHub Pages whenever code is pushed to the `main` branch.

### Setup Instructions

1. **Enable GitHub Pages in Repository Settings:**
   - Go to your repository on GitHub
   - Click on "Settings" → "Pages"
   - Under "Source", select "GitHub Actions"
   - Save the settings

2. **Merge this PR to the main branch:**
   - Once merged, the workflow will automatically trigger
   - The app will be built and deployed to GitHub Pages

3. **Access your deployed site:**
   - Your site will be available at: `https://jurgenjacobsen.github.io/atpl-questions/`
   - The first deployment may take a few minutes

### Workflow Details

The deployment workflow (`.github/workflows/deploy.yml`) performs the following:
- Checks out the code
- Installs Node.js and dependencies
- Builds the production app
- Uploads the `dist` folder as a GitHub Pages artifact
- Deploys to GitHub Pages

### Manual Deployment (Alternative)

If you prefer to deploy manually:

1. Build the app locally:
   ```bash
   npm run build
   ```

2. The built files will be in the `dist` folder

3. You can then deploy the `dist` folder to any static hosting service

## Troubleshooting

### White Screen Issue
If you see a white screen after deployment:
- Make sure GitHub Pages is set to use "GitHub Actions" as the source
- Wait a few minutes for the deployment to complete
- Check the Actions tab for any deployment errors
- Verify the workflow has run successfully

### 404 Errors
The app is configured with base path `/atpl-questions/`:
- Make sure you access it at: `https://jurgenjacobsen.github.io/atpl-questions/`
- Not: `https://jurgenjacobsen.github.io/`

### The `.nojekyll` File
The `.nojekyll` file in the `public` folder prevents GitHub Pages from using Jekyll processing, which can interfere with files starting with underscores.

## Configuration

The app is configured for GitHub Pages deployment in:
- `vite.config.ts` - Sets `base: '/atpl-questions/'`
- `public/.nojekyll` - Disables Jekyll processing
- `.github/workflows/deploy.yml` - Automated deployment workflow
