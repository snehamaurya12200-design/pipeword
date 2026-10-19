/**
 * Web Audio API Music Box & Sound Synthesis Engine
 * Generates authentic music box chime acoustics without external MP3 dependencies.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.ctx && this.ctx.state === 'running') {
      this.ctx.suspend();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Plays a celestial music box bell tine
   * Pure chime synthesis: fundamental sine + 2nd overtone + high shimmer + soft felt decay
   */
  public playMusicBoxNote(frequency: number, duration: number = 1.6, volume: number = 0.25) {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, now);
      masterGain.connect(ctx.destination);

      // 1. Fundamental tone (Warm bell)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(frequency, now);

      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.exponentialRampToValueAtTime(0.7, now + 0.015);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc1.connect(gain1);
      gain1.connect(masterGain);
      osc1.start(now);
      osc1.stop(now + duration);

      // 2. High harmonic chime overtone (Metallic music box tine shimmer)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(frequency * 2.76, now); // Inharmonic metallic ratio

      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.exponentialRampToValueAtTime(0.2, now + 0.008);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.4);

      osc2.connect(gain2);
      gain2.connect(masterGain);
      osc2.start(now);
      osc2.stop(now + duration * 0.4);

      // 3. Ultra-soft octave sparkle
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(frequency * 2, now);

      gain3.gain.setValueAtTime(0.001, now);
      gain3.gain.exponentialRampToValueAtTime(0.25, now + 0.02);
      gain3.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.7);

      osc3.connect(gain3);
      gain3.connect(masterGain);
      osc3.start(now);
      osc3.stop(now + duration * 0.7);
    } catch {
      // Audio fallback safety
    }
  }

  /**
   * Retro 2000s desktop click / dialog boop
   */
  public playClick() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(740, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.04);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // ignore
    }
  }

  /**
   * Startup boot sound: 4-note ascending celestial chords
   */
  public playBootChime() {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playMusicBoxNote(freq, 2.0, 0.22);
      }, idx * 170);
    });
  }

  /**
   * Dream Synthesis Shimmer effect
   */
  public playDreamShimmer() {
    const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playMusicBoxNote(freq, 1.2, 0.15);
      }, idx * 90);
    });
  }
}

export const sound = new SoundEngine();

// Pentatonic & Diatonic celestial scale frequencies for the music box
export const PENTATONIC_CHIMES = [
  { pitch: 'C5', freq: 523.25, label: 'Moon' },
  { pitch: 'D5', freq: 587.33, label: 'Star' },
  { pitch: 'E5', freq: 659.25, label: 'Cloud' },
  { pitch: 'G5', freq: 783.99, label: 'Slumber' },
  { pitch: 'A5', freq: 880.00, label: 'Mist' },
  { pitch: 'C6', freq: 1046.50, label: 'Dawn' },
  { pitch: 'D6', freq: 1174.66, label: 'Wish' },
  { pitch: 'E6', freq: 1318.51, label: 'Cradle' },
];
