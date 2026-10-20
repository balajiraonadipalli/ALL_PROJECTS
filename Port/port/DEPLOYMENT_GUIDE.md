# How to Deploy to Vercel

Since your project is already pushed to GitHub, deploying to Vercel is very fast. Follow these steps:

## Prerequisites
1.  **GitHub Account**: You must have the project uploaded to GitHub (Done ✅).
    *   Repo: [https://github.com/balajiraonadipalli/Balaji_Portfolio](https://github.com/balajiraonadipalli/Balaji_Portfolio)
2.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com/signup) if you haven't already.

## Steps

### 1. log in to Vercel
Go to [vercel.com](https://vercel.com) and log in (continue with GitHub is easiest).

### 2. Import Project
1.  On your Vercel Dashboard, click the **"Add New..."** button.
2.  Select **"Project"**.
3.  You will see a list of your GitHub repositories. Find `Balaji_Portfolio`.
4.  Click the **"Import"** button next to it.

### 3. Configure Project
Vercel usually auto-detects everything for React apps using Create React App.
*   **Framework Preset**: Should show `Create React App`.
*   **Root Directory**: `./` (Leave as is).
*   **Build Command**: `npm run build` (Default).
*   **Output Directory**: `build` (Default).
*   **Environment Variables**: You likely don't need any for this portfolio unless you added custom ones later (like API keys).

### 4. Deploy
1.  Click the big **"Deploy"** button.
2.  Vercel will start building your project. You'll see logs scrolling.
3.  Wait about 1-2 minutes.
4.  **Success!** You will see a "Congratulations!" screen with a preview of your site.

### 5. Verify
*   Click the domain link provided (e.g., `balaji-portfolio.vercel.app`).
*   Check that all images load and animations work.
*   Test on mobile to ensure your recent responsiveness fixes are live.

---

## Updating Your Site
In the future, whenever you want to update your site:
1.  Make changes on your computer.
2.  Push them to GitHub (`git push`).
3.  **Vercel will automatically detect the push and re-deploy your site** within minutes. You don't need to do anything else!
