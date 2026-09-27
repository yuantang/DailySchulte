/**
 * 《每日舒尔特》· iOS 26+ Liquid Glass 原生 UITabBar 封装
 * 基于 @ajuarezso/capacitor-liquid-glass 实现，对齐《腕温周期》与《睡眠小城》标准
 * 
 * 核心规则：
 * 1. 在 iOS 26+ 系统上激活苹果原生系统的 Liquid Glass UITabBar（拥有系统级折射反射材质与悬浮层）。
 * 2. 在低于 iOS 26 的系统（如 iOS 16/17/18）或 Web 浏览器中自动判定为 no-op，平滑降级使用 Web Tab 导航。
 */
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { LiquidGlass } from '@ajuarezso/capacitor-liquid-glass';

export interface NativeTabConfig {
  id: string;
  label: string;
  sfSymbol: string;
}

interface RemovableListener {
  remove: () => void;
}

/** 每日舒尔特品牌强调色 (暖阳琥珀金) */
const TINT_COLOR = '#F59E0B';

/** 苹果原生系统 Liquid Glass 的系统主版本号门槛 */
const LIQUID_GLASS_IOS_MAJOR = 26;

let supportResolved = false;
let supportEnabled = false;

let readyPromise: Promise<void> | undefined;
export function waitForNativeStartupReady(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (readyPromise) return readyPromise;
  readyPromise = new Promise((resolve) => {
    if (document.readyState === 'complete') {
      setTimeout(resolve, 150);
    } else {
      window.addEventListener('load', () => setTimeout(resolve, 150), { once: true });
      setTimeout(resolve, 600);
    }
  });
  return readyPromise;
}

function parseIOSMajor(osVersion: string): number {
  const major = Number.parseInt(osVersion.split('.')[0] ?? '', 10);
  return Number.isFinite(major) ? major : 0;
}

export async function initNativeTabBarSupport(): Promise<boolean> {
  if (supportResolved) return supportEnabled;
  supportResolved = true;
  supportEnabled = false;

  try {
    if (Capacitor.getPlatform() !== 'ios') return false;
    const info = await Device.getInfo();
    supportEnabled = parseIOSMajor(info.osVersion) >= LIQUID_GLASS_IOS_MAJOR;
  } catch (error) {
    console.warn('[nativeTabBar] initNativeTabBarSupport failed', error);
    supportEnabled = false;
  }

  return supportEnabled;
}

export function isNativeTabBarSupported(): boolean {
  return supportEnabled;
}

export async function showNativeTabBar(
  items: NativeTabConfig[],
  selectedId: string,
): Promise<void> {
  await initNativeTabBarSupport();
  if (!supportEnabled) return;
  const selectedIndex = Math.max(
    0,
    items.findIndex((item) => item.id === selectedId),
  );
  try {
    await LiquidGlass.showTabBar({
      items,
      selectedIndex,
      tintColor: TINT_COLOR,
      tabBarStyle: 'liquidGlass',
    });
  } catch (error) {
    console.warn('[nativeTabBar] showTabBar failed', error);
  }
}

export async function hideNativeTabBar(): Promise<void> {
  await initNativeTabBarSupport();
  if (!supportEnabled) return;
  try {
    await LiquidGlass.hideTabBar();
  } catch (error) {
    console.warn('[nativeTabBar] hideTabBar failed', error);
  }
}

export async function setNativeSelectedTab(id: string): Promise<void> {
  await initNativeTabBarSupport();
  if (!supportEnabled) return;
  try {
    await LiquidGlass.setSelectedTab({ id });
  } catch (error) {
    console.warn('[nativeTabBar] setSelectedTab failed', error);
  }
}

export async function onNativeTabSelected(
  callback: (id: string) => void,
): Promise<RemovableListener | undefined> {
  await initNativeTabBarSupport();
  if (!supportEnabled) return undefined;
  try {
    return await LiquidGlass.addListener('tabSelected', ({ id }) => callback(id));
  } catch (error) {
    console.warn('[nativeTabBar] addListener failed', error);
    return undefined;
  }
}

export interface NativeTabBarLayout {
  height: number;
  bottomSafeArea: number;
}

export async function getNativeTabBarLayout(): Promise<NativeTabBarLayout | undefined> {
  await initNativeTabBarSupport();
  if (!supportEnabled) return undefined;
  try {
    return await LiquidGlass.getTabBarLayout();
  } catch (error) {
    console.warn('[nativeTabBar] getTabBarLayout failed', error);
    return undefined;
  }
}

export async function onNativeTabBarLayoutChanged(
  callback: (layout: NativeTabBarLayout) => void,
): Promise<RemovableListener | undefined> {
  await initNativeTabBarSupport();
  if (!supportEnabled) return undefined;
  try {
    return await LiquidGlass.addListener('tabBarLayoutChanged', (layout) =>
      callback(layout),
    );
  } catch (error) {
    console.warn('[nativeTabBar] tabBarLayoutChanged listener failed', error);
    return undefined;
  }
}

export const NATIVE_TAB_ITEMS: NativeTabConfig[] = [
  { id: 'training', label: '训练', sfSymbol: 'target' },
  { id: 'daily', label: '打卡', sfSymbol: 'flame.fill' },
  { id: 'plans', label: '计划', sfSymbol: 'safari.fill' },
  { id: 'analytics', label: '统计', sfSymbol: 'chart.bar.xaxis' },
];

export async function updateNativeTabBadge(id: string, badge: string): Promise<void> {
  await initNativeTabBarSupport();
  if (!supportEnabled) return;
  try {
    await LiquidGlass.updateTabBadge({ id, badge });
  } catch (error) {
    console.warn('[nativeTabBar] updateTabBadge failed', error);
  }
}

