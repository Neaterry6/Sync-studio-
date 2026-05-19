# Studio One

Studio One is a responsive browser-based creative studio for recording audio, importing media, editing clips on a timeline, previewing visual work, and mixing tracks from one app. The interface is designed to work across desktop browsers, tablets, and mobile screens with adaptive panels for the library, timeline, mixer, transport controls, and navigation.

## What the app does

- **Multitrack audio workflow:** arm tracks, record from the microphone, add recordings to the timeline, and control playback from the floating transport bar.
- **Media import:** import audio, video, and image assets into the project from the toolbar or asset library.
- **Timeline editing:** drag clips, adjust clip length, edit clip volume, and manage track state.
- **Mixer controls:** use per-track solo, mute, fader, metering, and simulated AI effect modules for vocal cleanup and pitch tools.
- **Creative preview modes:** switch between audio visualization, video preview, photo canvas, and design canvas views.
- **Responsive app shell:** desktop uses a side navigation and persistent panels, while mobile uses bottom navigation, full-width drawers, compact controls, and safe viewport sizing.
- **Installable web app:** the app includes a web manifest, service worker, and in-app install prompt so supported browsers can install Studio One to the home screen or desktop.

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- Motion
- Tone.js / Web Audio APIs
- Firebase-ready project context

## Run locally

**Prerequisite:** Node.js 20 or newer is recommended.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local environment file and add your Gemini key:

   ```bash
   cp .env.example .env.local
   ```

   Then set `GEMINI_API_KEY` in `.env.local`.

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the local URL printed by the dev server in your browser.

## Build for production

```bash
npm run build
npm start
```

The production build generates the Vite client bundle and the Node server bundle in `dist/`.

## Install Studio One as an app

Studio One can be installed as a Progressive Web App in browsers that support install prompts.

1. Run or deploy the production app over `https` or on `localhost`.
2. Open Studio One in Chrome, Edge, or another install-capable browser.
3. Wait for the **Install** button to appear in the toolbar or sign-in screen.
4. Select **Install App** to add Studio One to your desktop, dock, launcher, or mobile home screen.

If the install prompt does not appear, use your browser menu and choose **Install app**, **Add to Home Screen**, or the equivalent option. Browsers usually require a valid manifest, service worker, and secure origin before showing the prompt.

## Useful scripts

- `npm run dev` — start the local server.
- `npm run lint` — type-check the app with TypeScript.
- `npm run build` — create a production client and server build.
- `npm run start` — run the built server.
- `npm run preview` — preview the Vite production client.

## AI Studio link

View the original AI Studio app: https://ai.studio/apps/3f4e906f-df52-4a9f-94c5-e3069e1b5b81
