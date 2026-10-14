// Generates the sound effects used in the video into public/sfx.
// Run: node scripts/gen-sfx.mjs
import {mkdirSync, writeFileSync} from 'node:fs';

const SR = 44100;

const writeWav = (name, samples) => {
	const data = Buffer.alloc(samples.length * 2);
	samples.forEach((s, i) => data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, s)) * 32767), i * 2));
	const h = Buffer.alloc(44);
	h.write('RIFF', 0);
	h.writeUInt32LE(36 + data.length, 4);
	h.write('WAVE', 8);
	h.write('fmt ', 12);
	h.writeUInt32LE(16, 16);
	h.writeUInt16LE(1, 20);
	h.writeUInt16LE(1, 22);
	h.writeUInt32LE(SR, 24);
	h.writeUInt32LE(SR * 2, 28);
	h.writeUInt16LE(2, 32);
	h.writeUInt16LE(16, 34);
	h.write('data', 36);
	h.writeUInt32LE(data.length, 40);
	mkdirSync('public/sfx', {recursive: true});
	writeFileSync(`public/sfx/${name}`, Buffer.concat([h, data]));
};

let seed = 3;
const rand = () => {
	seed = (seed * 16807) % 2147483647;
	return seed / 2147483647 - 0.5;
};
const buffer = (s) => new Float32Array(Math.round(s * SR));

// Pop: quick upward pitch blip
const pop = buffer(0.15);
{
	let ph = 0;
	for (let i = 0; i < pop.length; i++) {
		const t = i / SR;
		ph += (380 + 900 * Math.min(1, t / 0.04)) / SR;
		pop[i] = Math.sin(2 * Math.PI * ph) * Math.exp(-t * 32) * 0.6;
	}
}
writeWav('pop.wav', pop);

// Clock ticking: tick-tock every 10 frames (1/3 s) for 3s — matches the second hand
const tick = buffer(3);
for (let k = 0; k < 9; k++) {
	const s = Math.round(((k * 10) / 30) * SR);
	const f = k % 2 ? 1500 : 1900;
	for (let i = 0; i < 1800; i++) {
		const t = i / SR;
		tick[s + i] += (Math.sin(2 * Math.PI * f * t) * 0.6 + rand() * 0.3) * Math.exp(-t * 220) * 0.5;
	}
}
writeWav('tick.wav', tick);

// Whoosh
const whoosh = buffer(0.55);
{
	let lp = 0;
	for (let i = 0; i < whoosh.length; i++) {
		const t = i / whoosh.length;
		lp += (0.02 + 0.3 * t) * (rand() - lp);
		whoosh[i] = lp * Math.sin(Math.PI * t) ** 2 * 2;
	}
}
writeWav('whoosh.wav', whoosh);

// Olive-oil pour: soft gurgling, low-passed noise with bubbly modulation
const pour = buffer(2);
{
	let lp = 0;
	for (let i = 0; i < pour.length; i++) {
		const t = i / SR;
		lp += 0.06 * (rand() - lp);
		const bubbles = 0.6 + 0.4 * Math.sin(2 * Math.PI * (7 + 3 * Math.sin(t * 5)) * t);
		const env = Math.min(1, t / 0.15) * Math.min(1, (2 - t) / 0.3);
		pour[i] = lp * bubbles * env * 2.4;
	}
}
writeWav('pour.wav', pour);

// Lid snap / thud
const lid = buffer(0.2);
for (let i = 0; i < lid.length; i++) {
	const t = i / SR;
	lid[i] = (Math.sin(2 * Math.PI * 160 * t) * 0.7 + rand() * 0.5 * Math.exp(-t * 90)) * Math.exp(-t * 30) * 0.7;
}
writeWav('lid.wav', lid);

// Paper bag rustle
const bag = buffer(0.5);
{
	let hp = 0;
	for (let i = 0; i < bag.length; i++) {
		const t = i / SR;
		const n = rand();
		const crinkle = Math.abs(Math.sin(t * 90 + Math.sin(t * 37) * 3)) > 0.7 ? 1 : 0.35;
		bag[i] = (n - hp) * crinkle * Math.sin(Math.PI * (t / 0.5)) * 0.9;
		hp = n;
	}
}
writeWav('bag.wav', bag);

// Bright ding for the logo
const ding = buffer(1.6);
for (const [f, at, g] of [
	[1046.5, 0, 0.28],
	[1568, 0.08, 0.24],
	[2093, 0.16, 0.16],
]) {
	const s = Math.round(at * SR);
	for (let i = 0; s + i < ding.length; i++) {
		const t = i / SR;
		ding[s + i] += Math.sin(2 * Math.PI * f * t) * Math.min(1, t * 300) * Math.exp(-t * 2.6) * g;
	}
}
writeWav('ding.wav', ding);

// Alarm bell: relaxed double-bell ring, one strike every 0.15s (~4.5 frames), 1.5s
const alarm = buffer(1.9);
for (let k = 0; k < 10; k++) {
	const s0 = Math.round(k * 0.15 * SR);
	const f = k % 2 ? 1760 : 2093;
	for (let i = 0; s0 + i < alarm.length && i < 0.4 * SR; i++) {
		const t = i / SR;
		const v = (Math.sin(2 * Math.PI * f * t) * 0.6 + Math.sin(2 * Math.PI * f * 2.76 * t) * 0.18) * Math.min(1, t * 800) * Math.exp(-t * 9);
		alarm[s0 + i] += v * 0.22 * (k > 7 ? 0.6 : 1);
	}
}
writeWav('alarm.wav', alarm);

console.log('SFX written to public/sfx');
