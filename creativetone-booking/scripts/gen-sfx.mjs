// Generates the small sound effects used in the video into public/.
// Run: node scripts/gen-sfx.mjs
import {writeFileSync, mkdirSync} from 'node:fs';

const SR = 44100;

const writeWav = (name, samples) => {
	const data = Buffer.alloc(samples.length * 2);
	samples.forEach((s, i) => {
		data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, s)) * 32767), i * 2);
	});
	const header = Buffer.alloc(44);
	header.write('RIFF', 0);
	header.writeUInt32LE(36 + data.length, 4);
	header.write('WAVE', 8);
	header.write('fmt ', 12);
	header.writeUInt32LE(16, 16);
	header.writeUInt16LE(1, 20);
	header.writeUInt16LE(1, 22);
	header.writeUInt32LE(SR, 24);
	header.writeUInt32LE(SR * 2, 28);
	header.writeUInt16LE(2, 32);
	header.writeUInt16LE(16, 34);
	header.write('data', 36);
	header.writeUInt32LE(data.length, 40);
	mkdirSync('public', {recursive: true});
	writeFileSync(`public/${name}`, Buffer.concat([header, data]));
};

const buffer = (seconds) => new Float32Array(Math.round(seconds * SR));

// Deterministic noise
let seed = 1;
const rand = () => {
	seed = (seed * 16807) % 2147483647;
	return seed / 2147483647 - 0.5;
};

const addClick = (buf, at, gain = 0.5, tone = 1800) => {
	const start = Math.round(at * SR);
	const len = Math.round(0.035 * SR);
	for (let i = 0; i < len && start + i < buf.length; i++) {
		const t = i / SR;
		const env = Math.exp(-t * 160);
		buf[start + i] += (rand() * 0.8 + Math.sin(2 * Math.PI * tone * t) * 0.4) * env * gain;
	}
};

const addTone = (buf, at, freq, dur, gain) => {
	const start = Math.round(at * SR);
	const len = Math.round(dur * SR);
	for (let i = 0; i < len && start + i < buf.length; i++) {
		const t = i / SR;
		const env = Math.min(1, t * 200) * Math.exp(-t * (3 / dur));
		buf[start + i] +=
			(Math.sin(2 * Math.PI * freq * t) * 0.7 +
				Math.sin(2 * Math.PI * freq * 2 * t) * 0.2 +
				Math.sin(2 * Math.PI * freq * 3 * t) * 0.1) *
			env *
			gain;
	}
};

// Mouse click
const click = buffer(0.12);
addClick(click, 0, 0.7, 2400);
addClick(click, 0.045, 0.35, 1600);
writeWav('click.wav', click);

// Typing: one key every 2 frames at 30fps (66.7ms), 2 seconds, loopable
const typing = buffer(2);
for (let k = 0; k < 30; k++) {
	addClick(typing, k / 15 + (rand() * 0.006), 0.28 + rand() * 0.1, 1400 + rand() * 800);
}
writeWav('typing.wav', typing);

// Whoosh: filtered noise swell
const whoosh = buffer(0.7);
let lp = 0;
for (let i = 0; i < whoosh.length; i++) {
	const t = i / whoosh.length;
	const env = Math.sin(Math.PI * t) ** 2;
	const a = 0.02 + 0.25 * t;
	lp += a * (rand() - lp);
	whoosh[i] = lp * env * 2.2;
}
writeWav('whoosh.wav', whoosh);

// Success chime (two rising notes)
const chime = buffer(1.4);
addTone(chime, 0, 880, 0.9, 0.35);
addTone(chime, 0.12, 1318.5, 1.2, 0.35);
writeWav('success.wav', chime);

// Ringtone: marimba-like phrase, repeated twice (~4.4s)
const ring = buffer(4.6);
const phrase = [1318.5, 1046.5, 1318.5, 1568, 1318.5, 1046.5];
for (let r = 0; r < 2; r++) {
	phrase.forEach((f, n) => addTone(ring, r * 2.2 + n * 0.16, f, 0.5, 0.32));
}
writeWav('ring.wav', ring);

console.log('SFX written to public/');
