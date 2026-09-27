#!/usr/bin/env node
/**
 * [打包运行规则] 唯一目的：确保每次运行的都是最新修改的代码。
 * 参考《腕温周期》工程标准
 *
 * 核心不变式（make 语义）：
 *   任何源文件 mtime  ≤  产物 mtime  ≤  设备上运行的 App
 *
 * 源范围：
 *   web 层： web/src 下所有 ts/tsx/css/json、web/public 媒体、web/index.html、mobile/shell
 *   原生层： ios 下所有 .swift 文件
 *
 * 校验点（任一失败立即退出，绝不跑旧包）：
 *   A. www/ 产物 ≥ web 源最新改动        （vite build 是否吃到新代码）
 *   B. ios/App/App/public ≥ www          （cap sync 是否完成）
 *   C. App.app/public ≥ B                （xcodebuild 是否吃到新资源）
 *   D. App.app/App 二进制 ≥ Swift 源最新改动（改了 .swift 是否重编译）
 *   E. 安装前先 terminate 旧进程          （防 WKWebView 旧缓存）
 *
 * 用法：
 *   npm run run:fresh                     # 真机 Debug（增量编译）
 *   npm run run:fresh -- --clean         # 强制全量 clean build
 *   npm run run:fresh -- --release
 *   npm run run:fresh -- --simulator     # 运行到已启动的 iOS 模拟器
 *   npm run run:fresh -- --device <UDID>
 */
import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const workspace = path.join(root, 'ios/App/App.xcworkspace');
const scheme = 'App';
const appId = 'com.dailyschulte.app';
const wwwIndex = path.join(root, 'www/index.html');
const publicIndex = path.join(root, 'ios/App/App/public/index.html');
const derivedDataPath = path.join(root, 'ios/DerivedData/RunFresh');

const argv = process.argv.slice(2);
const wantClean = argv.includes('--clean');
const wantRelease = argv.includes('--release');
const wantSimulator = argv.includes('--simulator');
const deviceIdx = argv.indexOf('--device');
const deviceId = deviceIdx >= 0 ? argv[deviceIdx + 1] : null;
const config = wantRelease ? 'Release' : 'Debug';

const T = (p) => (fs.existsSync(p) ? fs.statSync(p).mtimeMs : 0);
const AGE = (ms) => {
  const s = Math.round((Date.now() - ms) / 1000);
  if (s < 60) return `${s} 秒前`;
  if (s < 3600) return `${Math.round(s / 60)} 分钟前`;
  return `${Math.round(s / 3600)} 小时前`;
};

function banner(msg) {
  console.log(`\n${'─'.repeat(60)}\n${msg}\n${'─'.repeat(60)}`);
}
function fail(msg) {
  console.error(`\n❌ [旧代码拦截] ${msg}\n   修复：重新执行 npm run run:fresh${msg.includes('增量') ? ' -- --clean' : ''}`);
  process.exit(1);
}
function run(cmd, opts = {}) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { stdio: 'inherit', cwd: root, ...opts });
}

/** xcodebuild 真机硬件 UDID */
function resolveConnectedIPhoneId(explicitId) {
  if (explicitId) return explicitId;
  const dest = spawnSync(
    'xcodebuild',
    ['-showdestinations', '-workspace', workspace, '-scheme', scheme],
    { encoding: 'utf8', cwd: path.join(root, 'ios') },
  );
  if (dest.status === 0) {
    const line = dest.stdout.split('\n').find(
      (l) => l.includes('platform:iOS')
        && l.includes('arch:arm64')
        && !l.includes('Simulator')
        && !l.includes('placeholder')
        && l.includes('iPhone'),
    );
    const m = line?.match(/id:([0-9A-F-]+)/i);
    if (m) return m[1];
  }
  const list = spawnSync('xcrun', ['devicectl', 'list', 'devices'], { encoding: 'utf8' });
  if (list.status !== 0) fail('无法列出真机，请插设备或加 --device <UDID>，或使用 --simulator');
  const line = list.stdout.split('\n').find((l) => l.includes('iPhone') && (l.includes('connected') || l.includes('available')));
  const m = line?.match(/([0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12})/i)
    || line?.match(/([0-9A-F]{8}-[0-9A-F]{16})/i);
  if (m) return m[1];
  fail('未检测到已连接 iPhone，请插真机或使用 --simulator 运行模拟器');
}

function resolveDevicectlIPhoneId() {
  const list = spawnSync('xcrun', ['devicectl', 'list', 'devices'], { encoding: 'utf8' });
  if (list.status !== 0) return null;
  const line = list.stdout.split('\n').find((l) => l.includes('iPhone') && (l.includes('connected') || l.includes('available')));
  const m = line?.match(/([0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12})/i);
  return m?.[1] ?? null;
}

function newestFile(dir, exts, acc = { mtime: 0, file: '' }) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      acc = newestFile(p, exts, acc);
    } else if (exts.some((e) => entry.name.endsWith(e))) {
      const m = fs.statSync(p).mtimeMs;
      if (m > acc.mtime) acc = { mtime: m, file: p };
    }
  }
  return acc;
}

const webSrc = newestFile(path.join(root, 'web/src'), ['.ts', '.tsx', '.css', '.json']);
const webPublic = newestFile(path.join(root, 'web/public'), ['.webp', '.m4a', '.ttf', '.png', '.svg', '.ico']);
const mobileSrc = newestFile(path.join(root, 'mobile'), ['.ts', '.css']);
const webMax = Math.max(webSrc.mtime, webPublic.mtime, mobileSrc.mtime, T(path.join(root, 'web/index.html')));
const swiftSrc = newestFile(path.join(root, 'ios/App/App'), ['.swift']);
const swiftMax = swiftSrc.mtime;

banner(`[打包运行规则] ${config} | ${wantSimulator ? '模拟器' : '真机'}${wantClean ? ' | clean' : ' | 增量'}
  web 源最新改动:   ${AGE(webMax)}  ${path.relative(root, webSrc.file || webPublic.file || 'web')}
  Swift 源最新改动: ${AGE(swiftMax)}  ${path.relative(root, swiftSrc.file || 'ios')}`);

// ─── Step 1: web → www → ios/App/App/public ────────────────
banner('Step 1  构建并同步 Capacitor 资源（vite build → cap sync）');
run('npm run cap:sync');
if (!fs.existsSync(wwwIndex)) fail('www/index.html 不存在：vite build 失败');
if (!fs.existsSync(publicIndex)) fail('ios/App/App/public/index.html 不存在：cap sync 失败');

if (T(wwwIndex) < webMax) fail(`www/ 构建产物(${AGE(T(wwwIndex))})早于 web 源改动(${AGE(webMax)})，vite build 吃到的是旧代码`);
if (T(publicIndex) < T(wwwIndex)) fail('cap sync 未完成：public 比 www 旧');
console.log(`✅ web 层最新：www ${AGE(T(wwwIndex))} 生成，晚于所有 web 源改动`);

// ─── Step 2: Xcode 构建 ────────────────────────────────────
banner(`Step 2  Xcode ${wantClean ? 'clean' : '增量'}构建（scheme=${scheme}, config=${config}）`);
if (!wantClean && fs.existsSync(derivedDataPath)) {
  console.log('使用增量编译；若 Step 3 校验失败会自动建议 --clean');
}

let destination;
let iphoneHardwareId;
if (wantSimulator) {
  destination = 'generic/platform=iOS Simulator';
} else {
  iphoneHardwareId = resolveConnectedIPhoneId(deviceId);
  destination = `id=${iphoneHardwareId}`;
  console.log(`检测到 iPhone 硬件 UDID: ${iphoneHardwareId}`);
}

const signArgs = wantSimulator
  ? 'CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO CODE_SIGNING_ALLOWED=NO'
  : '-allowProvisioningUpdates';

run([
  'xcodebuild',
  `-workspace "${workspace}"`,
  `-scheme ${scheme}`,
  `-configuration ${config}`,
  `-destination '${destination}'`,
  `-derivedDataPath "${derivedDataPath}"`,
  signArgs,
  wantClean ? 'clean build' : 'build',
].join(' '), { cwd: path.join(root, 'ios') });

// ─── Step 3: 校验 App.app 内的产物 ─────────────────────────
banner('Step 3  旧代码拦截校验（App.app 产物 vs 源）');
const appApp = path.join(derivedDataPath, 'Build/Products', `${config}-${wantSimulator ? 'iphonesimulator' : 'iphoneos'}`, 'App.app');
const appIndex = path.join(appApp, 'public/index.html');
const appBinary = path.join(appApp, 'App');

if (!fs.existsSync(appIndex)) fail(`App.app 里没有 ${appIndex}，xcodebuild 失败？`);
if (T(appIndex) < T(publicIndex) - 1000) {
  fail(`App.app 内 web 资源(${AGE(T(appIndex))})早于本次 cap sync(${AGE(T(publicIndex))})——增量构建未拷贝新资源，请用 --clean 重跑`);
}
console.log(`✅ web 资源最新：App.app/public ${AGE(T(appIndex))}，晚于本次 sync`);

if (fs.existsSync(appBinary) && T(appBinary) < swiftMax) {
  fail(`App 二进制(${AGE(T(appBinary))})早于 Swift 源改动(${AGE(swiftMax)}，${path.relative(root, swiftSrc.file)})——改的 .swift 没编译进去，请用 --clean 重跑`);
}
console.log(`✅ 原生层最新：App 二进制 ${AGE(T(appBinary))}，晚于所有 Swift 源改动`);

// ─── Step 4: 安装并启动（先杀旧进程防缓存）────────────────
banner('Step 4  安装到设备并强制冷启动');
if (wantSimulator) {
  run(`xcrun simctl terminate booted ${appId} 2>/dev/null || true`);
  run(`xcrun simctl install booted "${appApp}"`);
  run(`xcrun simctl launch booted ${appId}`);
} else {
  const devicectlId = resolveDevicectlIPhoneId();
  if (devicectlId) {
    spawnSync('xcrun', ['devicectl', 'device', 'process', 'terminate', '--device', devicectlId, appId], { encoding: 'utf8' });
  }
  console.log(`正在将最新产物安装至真机…`);
  const r = spawnSync('xcrun', ['devicectl', 'device', 'install', 'app', '--device', devicectlId, appApp], { stdio: 'inherit' });
  if (r.status !== 0) {
    fail('未能把应用装上手机。请确认手机已解锁、信任电脑，或使用 --simulator 运行模拟器');
  }
  if (devicectlId) {
    spawnSync('xcrun', ['devicectl', 'device', 'process', 'launch', '--device', devicectlId, appId], { encoding: 'utf8' });
  }
}

banner(`✅ 运行的确认是最新代码，已安装并冷启动
  web 源:     ${AGE(webMax)} 改动 → 已进 App.app
  Swift 源:   ${AGE(swiftMax)} 改动 → 已编译进二进制
  设备:       ${wantSimulator ? '已启动的 iOS 模拟器' : iphoneHardwareId}
  应用包名:   ${appId}`);
