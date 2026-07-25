# REEVA Launching Soon — Motion Edition

A layered, spring-themed 2D motion experience built with React, Vite, GSAP and the official final REEVA logo.

## Local preview

Requires Node.js 22.

```bash
npm install
npm run dev
```

Open the local address shown by Vite.

## Production build

```bash
npm run build
npm run preview
```

## GitHub Pages

1. Upload the contents of this folder to the root of the repository.
2. Ensure `.github/workflows/deploy.yml` exists.
3. In **Settings → Pages**, select **GitHub Actions**.
4. Commit to `main`; the workflow builds and deploys automatically.

## Form integration

The form currently demonstrates the animated success flow in the browser. Connect the submit handler in `SubscriptionExperience.jsx` to a real serverless endpoint or form service before launch. Never place secret API keys in Vite client environment variables.
