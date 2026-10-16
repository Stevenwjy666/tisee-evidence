# Website Reverse-Engineer Project

## 开发目录与浏览器约定

- 日常开发、代码修改和启动目录统一为 `C:\Users\34811\Documents\ChatGPT\ent西藏旅游网站`。
- `D:\Desktop\西藏旅游网站` 不作为日常开发或启动目录。
- 查看页面、预览新增界面以及编辑后的交互和布局检查，统一使用用户电脑上的 Microsoft Edge。
- 不使用 Codex 右侧内置浏览器打开或预览本项目。
- 先进入上述 C 盘目录执行 `npm run dev`，再在 Microsoft Edge 打开终端显示的本地地址（通常为 `http://localhost:3000`）。

## What This Is

This is a local Next.js project for building an Airbnb-style travel discovery website. The target reference is `https://www.airbnb.cn/`, but the output must be an original local development prototype and must not impersonate Airbnb or reuse Airbnb trademarks, logos, protected copy, or proprietary imagery.

The `clone-website` workflow has been added under `.codex/skills/clone-website/` for future inspection and refinement passes.

## Tech Stack

- Framework: Next.js 16 App Router, React 19, TypeScript strict
- Styling: Tailwind CSS v4 plus route-level/global CSS
- Project routes live under `src/app`
- Shared components live under `src/components`
- Utility functions live under `src/lib`
- Research artifacts live under `docs/research`
- Visual references should live under `docs/design-references`

## Commands

- `npm run dev` starts the local development server
- `npm run build` verifies a production build
- `npm run lint` runs ESLint
- `npm run typecheck` runs TypeScript without emitting files
- `npm run check` runs lint, typecheck, and build

## Code Style

- Use TypeScript strict mode.
- Prefer named exports for reusable components.
- Keep components focused and readable.
- Keep page-specific styling scoped by class names where possible.
- Use semantic buttons, nav, forms, and section landmarks.
- Preserve responsive behavior for desktop, tablet, and mobile.

## Product Direction

Build a polished travel marketplace experience inspired by Airbnb's layout patterns:

- Sticky utility header
- Segmented destination/date/guest search
- Category tabs
- Horizontal card scrollers
- Favorite buttons
- Profile and locale menus
- Mobile compact search and bottom navigation

Use original Tibet travel content. Do not present the result as Airbnb official.

## Current Routes

- `/` all categories
- `/homes` home/listing-focused view
- `/routes` legacy route-focused alias
- `/experiences` experience-focused view
- `/services` service-focused view

## Important Notes

- Existing user-authored files must be preserved unless the user explicitly asks to replace them.
- If using the clone workflow later, prefer Edge browser collection when the extension is connected.
- If browser automation is unavailable, use the existing `docs/research/airbnb-cn-homepage-research.md` document as the current source of truth.
