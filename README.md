# 每日舒尔特 — Capacitor iOS

精简 Focus / 腕温周期模式 Monorepo：`web/` 前端 + Capacitor iOS 原生壳。

## 快速开始

```bash
# 1. 安装根目录与 web 依赖
bun install
cd web && bun install && cd ..

# 2. 构建并同步到原生 iOS
npm run cap:sync

# 3. 运行到 iOS 模拟器
npm run cap:run:ios
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev:server` | 启动 Web 本地开发服务器 (http://localhost:3000) |
| `npm run build:web` | 构建 Web 生产产物并完成移动端壳适配 (`www/`) |
| `npm run cap:sync` | 编译 Web 并自动同步至原生 iOS 工程 (`ios/`) |
| `npm run cap:ios` | 打开 Xcode 原生项目工程 |
| `npm run cap:run:ios` | 构建并在本地 iOS 模拟器中启动应用 |

## 应用基础信息

- **应用名称**：每日舒尔特
- **Bundle ID**：`com.dailyschulte.app`
- **支持平台**：iOS 15.0+ (iPhone & iPad)
- **界面方向**：竖屏优先，支持横屏

## 原生功能特性

- 🎯 **Taptic Engine 原生触感**：点击方格触发清脆微触感，错误警示震动，过关胜利震动。
- ⏰ **离线每日打卡定时通知**：基于 `@capacitor/local-notifications`，零网络依赖，每天固定时间推送唤醒。
- 📤 **系统级原生分享面板**：基于 `@capacitor/share`，生成战报海报后一键 AirDrop、微信、存图。
- 📱 **灵动岛与全屏安全区适配**：顶部 Header 避让灵动岛/刘海，底部 TabBar 贴合 Home 指示条。
- ⚡️ **高频敲击手势保护**：全局禁用文本选择高亮与放大镜菜单，消除拖拽橡皮筋反弹，保证盲打手速。