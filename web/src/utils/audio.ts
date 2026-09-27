/**
 * High-performance Web Audio API synthesizer for Schulte training.
 * Provides progressive pitch feedback, crisp taps, error buzz, and victory fanfare.
 */

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Play correct tap with pitch scaling according to progress (0.0 to 1.0)
   */
  public playCorrect(progress: number = 0.5) {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Pentatonic / C-Major scale progression for melodious feedback
      // Base frequency 330Hz (E4) to 880Hz (A5)
      const baseFreq = 330 + progress * 550;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Sine wave with slight triangle overtone for warm xylophone / wood chime feel
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      // Subtle pitch bend upwards
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.05, now + 0.08);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  public playError() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(100, now + 0.18);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // ignore
    }
  }

  public playComplete() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime + idx * 0.09;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.46);
      });
    } catch {
      // ignore
    }
  }

  public playTick() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // ignore
    }
  }
}

/**
 * Safe mobile haptic vibration helper.
 * Triggers Capacitor iOS Taptic Engine feedback if in native shell,
 * and falls back to Web Vibration API when available on browsers.
 */
export function triggerHaptic(type: 'tap' | 'error' | 'success' | 'selection') {
  if (typeof window === 'undefined') return;

  // 1. Dispatch custom event to Capacitor native shell
  try {
    const hapticMap = {
      tap: 'light',
      selection: 'selection',
      error: 'error',
      success: 'success',
    } as const;
    window.dispatchEvent(
      new CustomEvent('haptic-feedback', {
        detail: { type: hapticMap[type] || 'light' },
      })
    );
  } catch {
    // ignore
  }

  // 2. Web Vibration API fallback for Android / non-iOS browsers
  if ('navigator' in window && window.navigator.vibrate) {
    try {
      if (type === 'tap' || type === 'selection') {
        window.navigator.vibrate(15);
      } else if (type === 'error') {
        window.navigator.vibrate([40, 30, 40]);
      } else if (type === 'success') {
        window.navigator.vibrate([30, 50, 60, 50, 100]);
      }
    } catch {
      // Ignore browser restrictions
    }
  }
}

export const soundFx = new AudioSynthesizer();
