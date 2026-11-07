# Zhan — motion design portfolio

Portfolio site for Zhan: graphic and motion design, ad videos, explainers and AI video. Available in Russian, Kazakh and English.

Built with React, TanStack Router, Tailwind CSS and Vite. The site is fully static: no server or backend.

## Run locally

You need [Node.js](https://nodejs.org) (LTS).

```sh
npm install
npm run dev
```

Open the URL it prints (usually http://localhost:5173). The page reloads as you edit.

## Build

```sh
npm run build
```

The finished site goes to `dist/`: `index.html` plus the images and videos from `public/`. Upload the whole `dist/` folder to any static host, or open `dist/index.html` by double-clicking.

## Deploy (GitHub Pages)

Every push to `main` builds and publishes the site via [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

One-time setup: in the repository go to **Settings → Pages** and set **Source** to **GitHub Actions**.

## Editing content

- **Projects** (cards, case windows, videos, stillframes, texts): `src/lib/site.ts`
- **Interface text** in all three languages: `src/lib/i18n.ts`
- **Images and videos**: `public/` (projects in `public/projects/`). Reference them in `site.ts` as `/projects/file.mp4`.

Keep videos in H.264 MP4 and reasonably small (ideally under 20–30 MB each). GitHub rejects files over 100 MB.
