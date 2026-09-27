# 每日舒尔特 (Daily Schulte) 官方网站

「每日舒尔特」官方网站，提供产品功能介绍、在线 3x3 舒尔特方格试玩体验、隐私保护政策、用户服务协议、科学防视疲劳健康指引及开发者直通支持中心。

---

## 🚀 部署至 Vercel 指南 (Vercel Deployment)

本项目专为 Vercel 静态托管平台进行了极致调优（配置了 Clean URLs、安全 Headers 与 SPA 路由重写规则），部署零配置、秒级上线。

### 方式一：Vercel 控制台一键导入（推荐）

1. 打开 [Vercel Dashboard](https://vercel.com/dashboard) 并登录您的账号。
2. 点击右上角的 **「Add New...」->「Project」**。
3. 在 Import Git Repository 中选择 **`DailySchulte`** 仓库（或搜索 `yuantang/DailySchulte`）。
4. **关键步骤（Root Directory 配置）**：
   - 在 **Configure Project** 页面，找到 **Root Directory**。
   - 点击 **Edit**，将其选择/填写为：`site`。
5. **构建参数确认**（Vercel 会自动识别 Vite）：
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. 点击 **「Deploy」** 按钮，等待 30 秒即可构建完成并获得专属的上线域名（如 `https://daily-schulte.vercel.app`）！

---

### 方式二：使用 Vercel CLI 本地命令行部署

如果您本地安装了 `vercel` 命令行工具：

```bash
# 1. 进入 site 目录
cd site

# 2. 运行部署命令
vercel

# 3. 部署至生产环境
vercel --prod
```

---

## 🛠 本地开发与调试

```bash
# 进入 site 目录
cd site

# 安装依赖
npm install

# 启动本地热重载开发服务器 (默认端口 3001)
npm run dev

# 构建生产产物 (输出到 site/dist/)
npm run build

# 本地预览构建产物
npm run preview
```

在项目根目录下也可以直接运行：
```bash
# 从根目录启动官网开发服务
npm run dev:site

# 从根目录构建官网产物
npm run build:site
```

---

## 📄 页面与路由规划

| 路径 | 页面定位 | 核心内容 |
| :--- | :--- | :--- |
| `/` | 官网首页 (Landing Page) | 价值主张、在线交互试玩 3x3、3x3~9x9与进阶模式矩阵、科学眼动原理、FAQ、下载引导 |
| `/privacy` | 隐私保护政策 (Privacy Policy) | 100% 本地沙盒数据、零商业广告追踪、系统权限透明声明、数据完全清除权（符合苹果 Guideline 5.1.1） |
| `/terms` | 用户服务协议 (Terms of Service) | 功能使用许可、诚信训练守则、**5~15 分钟科学用眼与健康免责声明**、知识产权 |
| `/support` | 技术支持中心 (Support & Contact) | 开发者直通邮箱 `moreless1025@gmail.com`、起草反馈、通知/音效常见故障排查 SOP |

---

## 📬 开发者直通联系

- **联系邮箱**：`moreless1025@gmail.com`
- **代码仓库**：[https://github.com/yuantang/DailySchulte](https://github.com/yuantang/DailySchulte)
