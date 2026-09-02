# Hunghsuan — Personal Website

[English](#english) · [繁體中文](#繁體中文) · [Visit hunghsuan.com](https://hunghsuan.com)

## English

Hunghsuan’s bilingual personal website for gaming content, videos, livestreams, articles, and social links.

### Features

- Traditional Chinese and English pages
- Automatic language selection with a saved manual preference
- System-aware light and dark themes with a manual theme switcher
- Bilingual articles powered by Astro Content Collections
- Responsive layouts and scroll animations that respect `prefers-reduced-motion`
- Canonical URLs, `hreflang`, JSON-LD, Open Graph metadata, and a sitemap
- YouTube, Bilibili, X, TikTok, Douyin, and livestream links

### Main routes

- `/en/`: English homepage
- `/zh/`: Traditional Chinese homepage
- `/en/articles/`: English articles
- `/zh/articles/`: Traditional Chinese articles
- `/`: Selects a language from the browser or a saved preference

## 繁體中文

Hunghsuan（帶哥）的雙語個人網站，用來分享遊戲內容、影片、直播、文章與個人社群連結。

### 主要功能

- 繁體中文與英文頁面
- 依瀏覽器語言自動導向，並保留使用者的語言選擇
- 跟隨系統的深淺色模式，以及手動主題切換
- 使用 Astro Content Collections 管理雙語文章
- 響應式版面與尊重 `prefers-reduced-motion` 的滾動動畫
- Canonical URL、`hreflang`、JSON-LD、Open Graph 與 sitemap
- YouTube、Bilibili、X、TikTok、抖音及直播連結

### 主要頁面

- `/zh/`：繁體中文首頁
- `/en/`：英文首頁
- `/zh/articles/`：繁體中文文章
- `/en/articles/`：英文文章
- `/`：根據瀏覽器或已儲存的偏好選擇語言

## Technology

- [Astro](https://astro.build)
- Markdown and Astro Content Collections
- TypeScript and CSS
- [Cloudflare Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- `@astrojs/sitemap`

## Local development

Requirements:

- Node.js 22.12 or newer
- npm

```sh
git clone https://github.com/lihunghsuan/hunghsuan.com.git
cd hunghsuan.com
npm install
npm run dev
```

The local site is available at [http://localhost:4321](http://localhost:4321).

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local Astro development server |
| `npm run build` | Build the static site into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run preview:cloudflare` | Build and preview through the Cloudflare Worker |
| `npm run deploy` | Build and deploy to Cloudflare Workers |

## Project structure

```text
├── public/                 # Icons, social image, robots.txt, and public assets
├── src/
│   ├── components/         # Homepage and article components
│   ├── content/articles/   # Chinese and English Markdown articles
│   ├── layouts/            # Shared article layout
│   ├── pages/              # Language and article routes
│   ├── styles/             # Global styles and responsive rules
│   └── worker.js           # Cloudflare Worker request handling
├── astro.config.mjs        # Astro, i18n, and sitemap configuration
└── wrangler.jsonc          # Cloudflare Worker and custom-domain configuration
```

## Deployment

The production site is deployed as static assets through the `hunghsuan-com` Cloudflare Worker. The Worker serves `hunghsuan.com` and redirects `www.hunghsuan.com` to the apex domain.

Deployment requires access to the configured Cloudflare account:

```sh
npm run deploy
```

## Links

- Website: [hunghsuan.com](https://hunghsuan.com)
- YouTube: [@lihunghsuan](https://www.youtube.com/@lihunghsuan)
- Bilibili: [帶哥](https://space.bilibili.com/1973193961)
- X: [@lihunghsuan](https://x.com/lihunghsuan)
- TikTok: [@hunghsuan](https://www.tiktok.com/@hunghsuan)
- Douyin: [帶哥](https://v.douyin.com/MMPdqiRDS18/)
