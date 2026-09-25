let context: AudioContext | null = null;
let master: GainNode | null = null;
let ambientStarted = false;
let muted = false;

function getAudioContext() {
  if (typeof window === 'undefined') return null;

  if (!context) {
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;
    context = new AudioContextClass();
    master = context.createGain();
    master.gain.value = muted ? 0 : 0.16;
    master.connect(context.destination);
  }

  return context;
}

export function isMuted() {
  return muted;
}

export async function setMuted(value: boolean) {
  muted = value;
  const audioContext = getAudioContext();
  if (!audioContext || !master) return;
  master.gain.cancelScheduledValues(audioContext.currentTime);
  master.gain.linearRampToValueAtTime(value ? 0 : 0.16, audioContext.currentTime + 0.35);
}

export async function startAmbient() {
  const audioContext = getAudioContext();
  if (!audioContext || !master) return;
  if (audioContext.state === 'suspended') await audioContext.resume();
  if (ambientStarted) return;
  ambientStarted = true;

  const now = audioContext.currentTime;
  const drone = audioContext.createOscillator();
  const droneGain = audioContext.createGain();
  const lfo = audioContext.createOscillator();
  const lfoGain = audioContext.createGain();
  const pad = audioContext.createOscillator();
  const padGain = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  const delay = audioContext.createDelay(1.5);
  const feedback = audioContext.createGain();

  drone.type = 'sine';
  drone.frequency.value = 55;
  pad.type = 'sine';
  pad.frequency.value = 110;
  filter.type = 'lowpass';
  filter.frequency.value = 420;
  filter.Q.value = 1.4;
  droneGain.gain.value = 0.32;
  padGain.gain.value = 0.12;
  lfo.frequency.value = 0.07;
  lfoGain.gain.value = 0.18;
  delay.delayTime.value = 0.28;
  feedback.gain.value = 0.22;

  lfo.connect(lfoGain).connect(droneGain.gain);
  drone.connect(droneGain).connect(filter);
  pad.connect(padGain).connect(filter);
  filter.connect(master);
  filter.connect(delay).connect(feedback).connect(delay);
  delay.connect(master);

  drone.start(now);
  pad.start(now);
  lfo.start(now);
}

export async function playLaugh() {
  const audioContext = getAudioContext();
  if (!audioContext || !master) return;
  if (audioContext.state === 'suspended') await audioContext.resume();

  const now = audioContext.currentTime + 0.04;
  const filter = audioContext.createBiquadFilter();
  const delay = audioContext.createDelay(0.8);
  const feedback = audioContext.createGain();
  filter.type = 'bandpass';
  filter.frequency.value = 920;
  filter.Q.value = 1.6;
  delay.delayTime.value = 0.17;
  feedback.gain.value = 0.28;
  filter.connect(master);
  filter.connect(delay).connect(feedback).connect(delay);
  delay.connect(master);

  for (let index = 0; index < 6; index += 1) {
    const start = now + index * 0.19;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const vibrato = audioContext.createOscillator();
    const vibratoGain = audioContext.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(540 - index * 30, start);
    oscillator.frequency.exponentialRampToValueAtTime(360 - index * 20, start + 0.16);
    vibrato.frequency.value = 5.8;
    vibratoGain.gain.value = 7;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.16, start + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.17);
    vibrato.connect(vibratoGain).connect(oscillator.frequency);
    oscillator.connect(gain).connect(filter);
    oscillator.start(start);
    vibrato.start(start);
    oscillator.stop(start + 0.19);
    vibrato.stop(start + 0.19);
  }
}
