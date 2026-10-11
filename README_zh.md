# Droit 的个人桌面

基于 React 的 macOS 风格个人主页，使用现有的 4K 红杉林壁纸、半透明菜单栏与 Dock、原生比例的窗口，以及 SVG 应用和文件图标。

- 多窗口独立叠放，支持拖动、边缘缩放、最大化、最小化和 Dock 恢复。
- Finder 支持目录导航、搜索、图标／列表视图和个人主页快捷方式。
- Safari 收藏夹、Mail 联系方式、Music 个人收藏和代码风格的技能展示。
- Spotlight 应用搜索、控制中心、日历与桌面右键菜单。
- 持久化明暗主题、壁纸亮度调节、按窗口宽度适配，以及减少动画偏好。
- 保留 Claude Code 风格终端的命令、历史、自动补全和中断功能。

## 本地运行

使用 Node.js 20 或更新版本和 npm：

```sh
npm ci --legacy-peer-deps
npm start
```

原有的 `react-terminal-app` 依赖虽然已不参与运行，安装时仍需要兼容旧版 peer dependency。

```sh
CI=true npm test -- --watchAll=false --runInBand
npm run build
```

## 操作方式

双击桌面文件夹打开，触屏设备单击打开。拖动标题栏移动窗口，双击标题栏缩放，拖动边缘调整大小。红、黄、绿按钮分别关闭、最小化和最大化窗口；点击 Dock 图标可打开或恢复应用。

| 快捷键 | 功能 |
| --- | --- |
| ⌘ / Ctrl + K | Spotlight 搜索 |
| ⌘ / Ctrl + N | 打开 Finder |
| ⌘ / Ctrl + M | 最小化当前窗口 |
| ⇧ + ⌘ / Ctrl + D | 显示／恢复桌面 |
| Escape | 关闭菜单和 Spotlight |

在终端输入 `help` 查看命令。上下方向键切换历史，Tab 补全，Ctrl+C 中断命令。

## 自定义与部署

个人资料和 Finder 快捷方式统一放在 `src/info.js`。应用注册信息位于 `src/components/apps/registry.js`，SVG 图标位于 `src/components/icons/`，组件样式位于 `src/styles/`。

保留 GitHub Pages 的 **/About/** 基础路径。现有 GitHub Actions 会在推送到 `main` 后构建并发布，也可使用 `npm run deploy` 手动部署。
