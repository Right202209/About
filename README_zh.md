# macOS 网页桌面

一个纯粹的 macOS 风格网页桌面，基于 React：红杉林壁纸、半透明菜单栏与 Dock、原生比例的窗口，以及手绘 SVG 应用和文件图标。不包含任何个人信息。

- 多窗口独立叠放，支持拖动、边缘缩放、最大化、最小化和 Dock 恢复。
- Finder 支持目录导航、搜索、图标／列表视图。
- Safari 起始页，空的 Mail 与 Music，带示例文件的代码编辑器，以及简单的 zsh 风格终端。
- Spotlight 应用搜索、控制中心、日历与桌面右键菜单。
- 持久化明暗主题、壁纸亮度调节、按窗口宽度适配，以及减少动画偏好。

## 本地运行

使用 Node.js 20 或更新版本和 npm：

```sh
npm ci --legacy-peer-deps
npm start
```

```sh
CI=true npm test -- --watchAll=false --runInBand
npm run build
```

## 桌面操作

双击桌面文件夹打开（触屏单击）。拖动标题栏移动窗口，双击标题栏缩放，拖动边缘调整大小。红黄绿按钮分别关闭、最小化、缩放。点击 Dock 图标打开或恢复应用。

| 快捷键 | 作用 |
| --- | --- |
| ⌘ / Ctrl + K | Spotlight 搜索 |
| ⌘ / Ctrl + N | 打开 Finder |
| ⌘ / Ctrl + M | 最小化当前窗口 |
| ⇧ + ⌘ / Ctrl + D | 显示／恢复桌面 |
| Escape | 关闭菜单和 Spotlight |

终端里输入 `help`，可以试试 `ls`、`date`、`open finder`；↑ / ↓ 浏览历史。

## 自定义

桌面内容（Finder 文件、Safari 收藏、示例代码、关于本机信息）在 `src/content.js`。应用元数据在 `src/components/apps/registry.js`，SVG 图标在 `src/components/icons/`，窗口行为在 `src/hooks/useWindowManager.js` 和 `useWindowFrame.js`，样式在 `src/styles/`。

## GitHub Pages

生产路径为 **/About/**。推送到 `main` 时 GitHub Actions 自动构建发布，也可以手动 `npm run deploy`。
