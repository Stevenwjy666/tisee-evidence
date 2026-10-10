# Website Reverse-Engineer Project

## 团队开发约定

在自己克隆的项目目录开发和启动。使用 Node.js >=24；npm ci 安装锁定依赖，npm run dev 启动。页面验证使用 Microsoft Edge。原作者的 C/D 盘路径不约束组员。

## What This Is

This is a local Next.js project for building an Airbnb-style travel discovery website. The target reference is `https://www.airbnb.cn/`, but the output must be an original local development prototype and must not impersonate Airbnb or reuse Airbnb trademarks, logos, protected copy, or proprietary imagery.

This checkout contains the frontend and current handoff documents. Local-only research and personal tooling are excluded.

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
- Backend collaborators should start with docs/BACKEND_QUICKSTART.md.
