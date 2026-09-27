#!/usr/bin/env node
/**
 * Build 每日舒尔特 web client and prepare www/ with Capacitor shell adaptations.
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const webDir = path.resolve(root, 'web');
const distDir = path.resolve(root, '.schulte-dist');
const wwwDir = path.resolve(root, 'www');
const capacitorBridgePath = path.resolve(
  root,
  'node_modules/@capacitor/ios/Capacitor/Capacitor/assets/native-bridge.js',
);

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
}

function patchCapacitorIosBridge() {
  if (!fs.existsSync(capacitorBridgePath)) return;
  try {
    let bridge = fs.readFileSync(capacitorBridgePath, 'utf8');
    const original = bridge;

    bridge = bridge.replace(
      'const isCookiesEnabled = prompt(JSON.stringify(payload));',
      "const isCookiesEnabled = 'false';",
    );
    bridge = bridge.replace(
      'const isHttpEnabled = prompt(JSON.stringify(payload));',
      "const isHttpEnabled = 'false';",
    );

    if (bridge !== original) {
      fs.writeFileSync(capacitorBridgePath, bridge);
      console.log('Patched Capacitor iOS bridge startup prompts.');
    }
  } catch (e) {
    // ignore
  }
}

const CRITICAL_SHELL_CSS = `
<style id="capacitor-critical">
  html.capacitor-native, html.capacitor-native body {
    width: 100%; height: 100%; overflow: hidden; margin: 0;
    overscroll-behavior: none; color-scheme: light;
    background: #F8FAFC !important;
  }
  html.capacitor-native #root {
    position: absolute; inset: 0; overflow-x: hidden; overflow-y: auto;
    overscroll-behavior: none; -webkit-overflow-scrolling: touch;
    padding-top: 0;
    padding-left: env(safe-area-inset-left, 0px);
    padding-right: env(safe-area-inset-right, 0px);
    background: transparent;
    visibility: visible;
  }
  html.capacitor-native .safe-area-top {
    padding-top: max(0.75rem, env(safe-area-inset-top, 0px));
  }
</style>
<script>
  document.documentElement.classList.add('capacitor-native');
</script>`;

function patchIndexHtml(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');

  html = html.replace(
    /<meta name="apple-mobile-web-app-status-bar-style" content="[^"]*"\s*\/?>/g,
    '',
  );

  const viewport =
    '<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1.0, user-scalable=no" />';
  if (/<meta name="viewport" content="[^"]*" \/>/.test(html)) {
    html = html.replace(
      /<meta name="viewport" content="[^"]*" \/>/,
      `${viewport}
    <meta name="theme-color" content="#F8FAFC" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    ${CRITICAL_SHELL_CSS}
    <link rel="stylesheet" href="./shell.css" />`,
    );
  } else {
    html = html.replace(
      '</head>',
      `${viewport}
    <meta name="theme-color" content="#F8FAFC" />
    ${CRITICAL_SHELL_CSS}
    <link rel="stylesheet" href="./shell.css" />
  </head>`,
    );
  }

  html = html.replace(/<title>[^<]*<\/title>/, '<title>每日舒尔特</title>');
  html = html.replace(/\s+crossorigin(?:="[^"]*")?/g, '');
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root"><p id="boot-hint" style="margin:0;padding:48px 24px;font:17px/1.4 -apple-system,sans-serif;color:#1E293B">正在打开每日舒尔特…</p></div>
    <script>
      window.addEventListener('error', function (e) {
        var h = document.getElementById('boot-hint');
        if (h) h.textContent = '加载失败：' + (e.message || '未知错误');
      });
    </script>`,
  );

  if (!html.includes('capacitor-shell.js')) {
    html = html.replace(
      '</body>',
      '    <script type="module" src="./capacitor-shell.js"></script>\n  </body>',
    );
  }

  fs.writeFileSync(filePath, html);
}

async function bundleShellAssets() {
  console.log('Bundling mobile shell assets...');
  await esbuild.build({
    entryPoints: [path.join(root, 'mobile/shell.css')],
    outfile: path.join(wwwDir, 'shell.css'),
    bundle: true,
    loader: { '.css': 'css' },
  });

  await esbuild.build({
    entryPoints: [path.join(root, 'mobile/shell.ts')],
    outfile: path.join(wwwDir, 'capacitor-shell.js'),
    bundle: true,
    format: 'esm',
    platform: 'browser',
    target: 'es2020',
    minify: false,
  });
}

console.log('Building 每日舒尔特 web client from source...');
patchCapacitorIosBridge();
execSync(`npm run build -- --outDir "${distDir}" --emptyOutDir`, {
  cwd: webDir,
  stdio: 'inherit',
  env: {
    ...process.env,
    VITE_CAPACITOR: '1',
  },
});

console.log('Copying build to www/...');
fs.rmSync(wwwDir, { recursive: true, force: true });
copyDir(distDir, wwwDir);
await bundleShellAssets();
patchIndexHtml(path.join(wwwDir, 'index.html'));

console.log('www/ ready for Capacitor sync.');
