# REEVA — Launching Soon

An interactive, responsive 3D launch experience for REEVA, built with Vite, React, React Three Fiber, Three.js, Drei and GSAP.

The entire scene is procedural. It does not require external `.glb` models or remote texture files, so it can run immediately after installation and deploy cleanly to GitHub Pages, Vercel or Netlify.

## Included experience

1. A floating wax-sealed royal envelope with gold dust.
2. A dissolving seal, opening flap and revealed REEVA invitation.
3. A GSAP camera portal into a procedural Indian palace courtyard.
4. Marble arches, jali-inspired latticework, silk drapes, diyas, water and twilight lighting.
5. A glass-and-gold subscription form with validation, confirmation state and a 3D sparkle burst.
6. Responsive layouts for desktop, tablet and mobile.
7. Reduced-motion support and a WebGL visual fallback.
8. GitHub Pages scripts, a Pages workflow, Netlify settings and Vercel settings.

## Requirements

- Node.js 20.19 or newer. Node.js 22 LTS is recommended.
- npm 10 or newer.
- Git, for repository deployment.

## Project structure

```text
reeva-launching-soon/
├─ .github/workflows/deploy.yml
├─ public/
│  ├─ reeva-mark.svg
│  └─ site.webmanifest
├─ src/
│  ├─ components/
│  │  ├─ Envelope3D.jsx
│  │  ├─ PalaceCourtyard3D.jsx
│  │  ├─ ReevaLogo.jsx
│  │  ├─ Scene.jsx
│  │  └─ SubscriptionUI.jsx
│  ├─ App.jsx
│  ├─ main.jsx
│  └─ styles.css
├─ .env.example
├─ .gitignore
├─ index.html
├─ netlify.toml
├─ package.json
├─ vercel.json
└─ vite.config.js
```

## Run locally

From the project folder:

```bash
npm install
npm run dev
```

Vite will display a local URL, usually:

```text
http://localhost:5173
```

To test the production build locally:

```bash
npm run build
npm run preview
```

## Connect the subscription form

The page works in demo mode by default. In demo mode, a valid submission displays the success state but does not store the visitor's details.

To send submissions to a real form API:

1. Copy `.env.example` to `.env`.
2. Add your HTTPS endpoint:

```env
VITE_FORM_ENDPOINT=https://your-domain.example/api/reeva-waitlist
```

The endpoint receives a JSON `POST` body:

```json
{
  "email": "guest@example.com",
  "countryCode": "+60",
  "phone": "123456789",
  "source": "REEVA Launching Soon"
}
```

For production, the endpoint should validate and sanitise data, rate-limit requests, provide consent records, and store information according to the privacy laws that apply to your launch markets.

## Deploy with the `gh-pages` package

### 1. Create the GitHub repository

Create an empty repository, for example:

```text
reeva-launching-soon
```

### 2. Push the project

```bash
git init
git add .
git commit -m "Launch REEVA coming soon experience"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/reeva-launching-soon.git
git push -u origin main
```

### 3. Deploy

```bash
npm run deploy
```

The `predeploy` script automatically runs the production build, and `gh-pages` publishes the `dist` folder to the `gh-pages` branch.

In GitHub:

1. Open **Settings**.
2. Open **Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select the `gh-pages` branch and `/ (root)` folder.
5. Save.

The site will normally be available at:

```text
https://YOUR-USERNAME.github.io/reeva-launching-soon/
```

The project uses `base: './'` in `vite.config.js`, so built CSS, JavaScript and public assets resolve from a GitHub project subpath.

## Deploy with GitHub Actions

A workflow is already included at `.github/workflows/deploy.yml`.

In GitHub:

1. Open **Settings** → **Pages**.
2. Set **Source** to **GitHub Actions**.
3. Push to the `main` branch.
4. Open the **Actions** tab to view the deployment.

Use either the `gh-pages` package method or the GitHub Actions method as your main Pages workflow. The Actions method is better for automatic deployment after every push.

## Deploy to Vercel

1. Push the project to GitHub.
2. In Vercel, select **Add New Project**.
3. Import the repository.
4. Vercel should detect Vite automatically.
5. Confirm:

```text
Build command: npm run build
Output directory: dist
```

6. Add `VITE_FORM_ENDPOINT` under project environment variables when a real form backend is ready.
7. Deploy.

A `vercel.json` file is included with the required build and output settings.

## Deploy to Netlify

1. Push the project to GitHub.
2. In Netlify, select **Add new site** → **Import an existing project**.
3. Select the repository.
4. Confirm:

```text
Build command: npm run build
Publish directory: dist
```

5. Add `VITE_FORM_ENDPOINT` under site environment variables when required.
6. Deploy.

A `netlify.toml` file is included with these settings.

## Customisation map

### Brand colours

Edit the CSS variables at the top of `src/styles.css`:

```css
:root {
  --navy: #050b13;
  --emerald-950: #06110f;
  --maroon: #701a34;
  --gold: #c99a3f;
  --ivory: #f4ead3;
}
```

### Logo and tagline

- HTML/SVG logo component: `src/components/ReevaLogo.jsx`
- Browser and home-screen mark: `public/reeva-mark.svg`
- 3D invitation artwork: `createInvitationTexture()` in `src/components/Envelope3D.jsx`
- Tagline text: `Touch of Magic`

### Main copy

- Opening hero and invitation copy: `src/App.jsx`
- Subscription copy and form: `src/components/SubscriptionUI.jsx`

### 3D palace

Edit `src/components/PalaceCourtyard3D.jsx` to adjust:

- Arch locations and scale
- Dome colour and size
- Jali panels
- Drapes
- Diyas
- Water channel
- Lighting

## Performance notes

- All geometry is generated at runtime; no model decoder is required.
- Pixel density is capped to control GPU cost on high-density mobile screens.
- Decorative particles use a single point cloud instead of hundreds of individual DOM elements.
- Expensive continuous movement is reduced when the visitor enables reduced-motion settings.
- For older phones, reduce `GoldDust` counts in `Scene.jsx` and the celebration particle count in `PalaceCourtyard3D.jsx`.

## Production checklist

- Connect and test a real form endpoint.
- Add a privacy policy and consent wording approved for the launch markets.
- Add analytics only after configuring consent controls where required.
- Test on iPhone Safari, Android Chrome, desktop Chrome, Edge and Safari.
- Compress any future image assets and serve them locally from `public/`.
- Add your final domain to Vercel, Netlify or GitHub Pages.
- Run Lighthouse and test on a mid-range mobile device before launch.
