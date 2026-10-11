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

// Soft tap (iOS-style touch)
const tap = buffer(0.1);
{
	const len = Math.round(0.05 * SR);
	for (let i = 0; i < len; i++) {
		const t = i / SR;
		tap[i] += (Math.sin(2 * Math.PI * 520 * t) * 0.6 + rand() * 0.25) * Math.exp(-t * 110) * 0.7;
	}
}
writeWav('tap.wav', tap);

// iOS keyboard "tock": one key every 2 frames at 30fps (66.7ms), 3 seconds, loopable
const keyTock = (buf, at, gain, f) => {
	const s = Math.round(at * SR);
	const len = Math.round(0.03 * SR);
	for (let i = 0; i < len && s + i < buf.length; i++) {
		const t = i / SR;
		buf[s + i] += (Math.sin(2 * Math.PI * f * t) * 0.7 + rand() * 0.35) * Math.exp(-t * 190) * gain;
	}
};
const typing = buffer(3);
for (let k = 0; k < 45; k++) {
	keyTock(typing, k / 15, 0.32 + rand() * 0.08, 1150 + rand() * 250);
}
writeWav('typing.wav', typing);

// Whoosh: filtered noise swell
const whoosh = buffer(0.6);
let lp = 0;
for (let i = 0; i < whoosh.length; i++) {
	const t = i / whoosh.length;
	const env = Math.sin(Math.PI * t) ** 2;
	const a = 0.02 + 0.3 * t;
	lp += a * (rand() - lp);
	whoosh[i] = lp * env * 2;
}
writeWav('whoosh.wav', whoosh);

// Sent: rising swoosh + bright blip
const sent = buffer(0.9);
{
	let l = 0;
	for (let i = 0; i < Math.round(0.45 * SR); i++) {
		const t = i / (0.45 * SR);
		l += (0.03 + 0.4 * t) * (rand() - l);
		sent[i] += l * Math.sin(Math.PI * t) * 1.6;
	}
	addTone(sent, 0.38, 1760, 0.4, 0.22);
}
writeWav('sent.wav', sent);

// Success chime (two rising notes)
const chime = buffer(1.4);
addTone(chime, 0, 1046.5, 0.9, 0.3);
addTone(chime, 0.1, 1568, 1.2, 0.3);
writeWav('success.wav', chime);

// Ringtone: marimba-like phrase, repeated (~4.4s)
const ring = buffer(4.6);
const phrase = [1318.5, 1046.5, 1318.5, 1568, 1318.5, 1046.5];
for (let r = 0; r < 2; r++) {
	phrase.forEach((f, n) => addTone(ring, r * 2.2 + n * 0.16, f, 0.5, 0.5));
}
writeWav('ring.wav', ring);

console.log('SFX written to public/');
