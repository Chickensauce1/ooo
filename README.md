# 词尾接接乐

一款面向英语学习者的词尾接龙游戏。玩家需要根据上一个单词的末尾字母，输入以下一个字母开头的新单词；游戏提供中文释义和逐字母提示，并按学习阶段组织词库。

![词尾接接乐图标](assets/icon.png)

## 在线体验

仓库启用 GitHub Pages 后，可直接在浏览器中游玩。部署地址会显示在仓库右侧的 **Deployments** 区域。

游戏也支持 Windows 便携版和 Android APK。打包产物建议通过仓库的 **Releases** 页面发布，不直接提交到源码历史中。

## 功能特点

- 覆盖小学、初中、高中、大学等 15 个学习级别
- 内置 7,148 个去重单词及中文释义
- 按当前学习级别优先提供提示，也可跨级匹配有效单词
- 支持中文释义提示与逐字母提示
- 游戏进度保存在当前设备的本地存储中
- 同一套核心代码支持 Web、Windows（Electron）和 Android（Capacitor）

## 游戏规则

1. 选择适合自己的年级或学习阶段并开始游戏。
2. 根据当前词尾字母输入一个匹配的新单词。
3. 输入必须是词库中的有效英文单词，且本局不能重复使用。
4. 遇到困难时，可查看中文释义或逐步揭示字母。
5. 可保存当前词链，稍后从游戏档案继续。

## 本地运行

需要 [Node.js](https://nodejs.org/) 20 或更高版本。

```bash
npm install
npm test
npm start
```

`npm start` 会启动 Electron 桌面版。Web 版没有服务端依赖，也可以直接用浏览器打开 `index.html`。

## 构建发布版

### Windows 便携版

在 Windows PowerShell 中运行：

```powershell
npm run dist:win
```

产物将生成在 `dist/` 目录。当前应用未进行代码签名，Windows 首次启动时可能显示安全提示。

### Android APK

安装 Android Studio / Android SDK，并确保 `ANDROID_HOME` 指向 SDK 目录，然后运行：

```powershell
npm run dist:android
```

脚本会执行测试、同步 Capacitor 工程并构建调试 APK。生成的 APK 会复制到 `发布版/`。

### Web / GitHub Pages

推送到默认分支后，[Pages 工作流](.github/workflows/pages.yml) 会自动部署 Web 版。首次使用时，需要在仓库的 **Settings > Pages > Build and deployment** 中将 Source 设置为 **GitHub Actions**。

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `npm test` | 验证接龙规则、词库和官方词库构建器 |
| `npm start` | 启动 Electron 桌面版 |
| `npm run build:mobile:web` | 生成 Capacitor 使用的 Web 资源 |
| `npm run sync:android` | 生成 Web 资源并同步 Android 工程 |
| `npm run dist:win` | 构建 Windows x64 便携版 |
| `npm run dist:android` | 构建 Android 调试 APK |

## 项目结构

```text
.
|-- index.html / styles.css / app.js  # 页面、样式与交互
|-- game-rules.js                     # 可独立测试的核心规则
|-- words*.js                         # 分级词库与释义
|-- electron-main.js                  # Electron 入口
|-- android/                           # Capacitor Android 工程
|-- scripts/                           # 移动端资源与打包脚本
|-- verify-*.js                        # 自动验证脚本
`-- .github/workflows/                 # CI 与 Pages 部署
```

## 参与贡献

问题反馈和改进建议可提交到 GitHub Issues。提交代码前请先阅读 [CONTRIBUTING.md](CONTRIBUTING.md)，并确保 `npm test` 全部通过。

## 版权

本项目目前未采用开源许可证，版权归项目作者所有。未经明确许可，不得复制、修改、分发或用于商业用途。详见 [LICENSE](LICENSE)。

