# 岩画分类图标与动画

素材来源：组员仓库 https://github.com/chiyang20021016-glitch/Tisee-
参考提交：42fc4eb882d5ebc3b9aa401ac4019e2d46188bb8
接入日期：2026-10-10

- all / 全部：转轮，点击、悬停或键盘聚焦后旋转 720 度。
- homes / 房源：藏式纹样，挤压回弹。
- routes / 路线：鹿，使用组员 GIF 的原地跑动帧。
- experiences / 体验：弓箭手，使用组员 GIF 的拉弓帧。
- services / 周边：树枝，左右摇摆。

资源位于 public/icons/petroglyph，组件位于 src/components/petroglyph-tab.tsx，样式位于同目录 petroglyph-tab.css。
PNG 已裁剪透明留白并转为 WebP；GIF 去除原始深色背景后转成横向帧图。鹿与弓箭手的静态图使用动画第一帧，避免播放时尺寸跳变。动画只播放一次，支持 prefers-reduced-motion。导航立即跳转，不等待动画结束。移动端搜索下方补充同样的五个分类入口。

仓库未包含鹿的五张分层原图和 rock-texture.jpg，当前导航已接入背景样式，使用纯白 rock-texture.jpg 占位；组员提供石纹图后替换同名资源。无需新增 npm 依赖。

按 docs/PROJECT_HANDOFF.md 的 Edge 验证步骤连接独立调试窗口后，执行 node scripts/check-petroglyphs.mjs。脚本仅接受 localhost:3000 的现有 Edge 页面，检查动画、导航、搜索、390px 移动布局和减少动态效果设置，输出 artifacts/petroglyph-check。

验证结果：npm run check 通过；真实 Edge 的 24 项检查通过，包括五个动画的触发和复位、帧图播放、分类跳转、目的地搜索、390px 布局及减少动态效果设置。已检查桌面与移动端截图。
