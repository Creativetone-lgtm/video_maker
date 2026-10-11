// Generates an original, royalty-free background track into public/music.wav.
// 120 BPM (1 beat = 15 frames at 30fps, 1 bar = 60 frames), F major, warm pop/house groove.
// Run: node scripts/gen-music.mjs
import {mkdirSync, writeFileSync} from 'node:fs';

const SR = 44100;
const BPM = 120;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;
const BARS = 17;
const LENGTH = BARS * BAR + 3;
const N = Math.round(LENGTH * SR);
const L = new Float32Array(N);
const R = new Float32Array(N);

let seed = 7;
const rand = () => {
	seed = (seed * 16807) % 2147483647;
	return seed / 2147483647 - 0.5;
};
const mtof = (m) => 440 * 2 ** ((m - 69) / 12);

// Chords: Fmaj7, Am7, Dm7, Bbmaj7 (one bar each)
const CHORDS = [
	[53, 57, 60, 64],
	[57, 60, 64, 67],
	[50, 53, 57, 60],
	[58, 62, 65, 69],
];
const ROOTS = [41, 45, 38, 46];

const add = (buf, i, v) => {
	if (i >= 0 && i < N) buf[i] += v;
};

// Sidechain envelope: ducks on every beat (from bar 1 on)
const duck = (t) => {
	const p = (t % BEAT) / BEAT;
	return 0.35 + 0.65 * Math.min(1, p / 0.45) ** 1.5;
};

const fullFrom = 0; // drums from the first beat — reels need energy immediately
const endAt = (BARS - 1) * BAR; // last bar = sustained final chord

// Pad: detuned saws, low-passed, sidechained
{
	let lpL = 0;
	let lpR = 0;
	for (let i = 0; i < N; i++) {
		const t = i / SR;
		const barIdx = Math.min(Math.floor(t / BAR), BARS - 1);
		const chord = CHORDS[barIdx % 4];
		const final = t >= endAt;
		const fade = final ? Math.exp(-(t - endAt) * 0.7) : 1;
		const intro = Math.min(1, t / 0.4);
		let sL = 0;
		let sR = 0;
		for (const note of final ? CHORDS[0] : chord) {
			const f = mtof(note);
			for (const [d, pan] of [
				[-0.11, 0.8],
				[0.09, 0.2],
				[0, 0.5],
			]) {
				const ph = (t * f * 2 ** (d / 12)) % 1;
				const saw = 2 * ph - 1;
				sL += saw * (1 - pan);
				sR += saw * pan;
			}
		}
		const cutoff = 0.035 + 0.02 * Math.sin(t * 0.5);
		lpL += cutoff * (sL - lpL);
		lpR += cutoff * (sR - lpR);
		const g = 0.05 * intro * fade * (final ? 1 : duck(t));
		L[i] += lpL * g;
		R[i] += lpR * g;
	}
}

// Kick
const kick = (at, gain = 1) => {
	const s = Math.round(at * SR);
	const len = Math.round(0.4 * SR);
	let ph = 0;
	for (let i = 0; i < len; i++) {
		const t = i / SR;
		const f = 45 + 110 * Math.exp(-t * 28);
		ph += f / SR;
		const v = Math.sin(2 * Math.PI * ph) * Math.exp(-t * 7) * 0.85 * gain;
		const click = i < 90 ? rand() * 0.3 * (1 - i / 90) : 0;
		add(L, s + i, v + click);
		add(R, s + i, v + click);
	}
};

// Hat: high-passed noise
const hat = (at, gain, open = false) => {
	const s = Math.round(at * SR);
	const len = Math.round((open ? 0.22 : 0.06) * SR);
	let prev = 0;
	for (let i = 0; i < len; i++) {
		const t = i / SR;
		const n = rand();
		const hp = n - prev;
		prev = n;
		const v = hp * Math.exp(-t * (open ? 18 : 70)) * gain;
		add(L, s + i, v * 0.8);
		add(R, s + i, v * 1.1);
	}
};

// Clap: layered band-limited noise bursts
const clap = (at, gain) => {
	const s = Math.round(at * SR);
	for (const off of [0, 0.011, 0.022]) {
		const len = Math.round(0.18 * SR);
		let lp = 0;
		let prev = 0;
		for (let i = 0; i < len; i++) {
			const t = i / SR;
			const n = rand();
			lp += 0.5 * (n - lp);
			const bp = lp - prev;
			prev = lp;
			const v = bp * Math.exp(-t * (off === 0.022 ? 14 : 60)) * gain;
			add(L, s + Math.round(off * SR) + i, v);
			add(R, s + Math.round(off * SR) + i, v);
		}
	}
};

// Bass: rounded sine with a little drive, off-beat 8ths
const bassNote = (at, midi, dur, gain) => {
	const s = Math.round(at * SR);
	const len = Math.round(dur * SR);
	const f = mtof(midi);
	for (let i = 0; i < len; i++) {
		const t = i / SR;
		const env = Math.min(1, t * 300) * Math.min(1, (dur - t) * 40);
		const v = Math.tanh(Math.sin(2 * Math.PI * f * t) * 1.6) * env * gain;
		add(L, s + i, v);
		add(R, s + i, v);
	}
};

// Pluck with stereo delay
const pluck = (at, midi, gain) => {
	const f = mtof(midi);
	for (const [delay, g, side] of [
		[0, 1, 0],
		[BEAT * 0.75, 0.38, 1],
		[BEAT * 1.5, 0.16, -1],
	]) {
		const s = Math.round((at + delay) * SR);
		const len = Math.round(0.5 * SR);
		for (let i = 0; i < len; i++) {
			const t = i / SR;
			const env = Math.min(1, t * 900) * Math.exp(-t * 9);
			const v =
				(Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(2 * Math.PI * f * 2 * t) * Math.exp(-t * 20)) *
				env *
				gain *
				g;
			add(L, s + i, v * (side === 1 ? 0.4 : 1));
			add(R, s + i, v * (side === -1 ? 0.4 : 1));
		}
	}
};

const ARP = [0, 2, 1, 3, 2, 1, 3, 2];

for (let bar = 0; bar < BARS; bar++) {
	const t0 = bar * BAR;
	const chord = CHORDS[bar % 4];
	const root = ROOTS[bar % 4];
	const last = bar === BARS - 1;
	if (last) {
		kick(t0, 1);
		clap(t0, 0.35);
		hat(t0, 0.25, true);
		bassNote(t0, ROOTS[0], BAR, 0.3);
		continue;
	}
	for (let b = 0; b < 4; b++) {
		const tb = t0 + b * BEAT;
		if (t0 >= fullFrom) {
			kick(tb);
			hat(tb + BEAT / 2, 0.22, b === 3 && bar % 2 === 1);
			hat(tb + BEAT / 4, 0.07);
			hat(tb + (BEAT * 3) / 4, 0.07);
			if (b === 1 || b === 3) clap(tb, 0.32);
			bassNote(tb + BEAT / 2, root, BEAT / 2 - 0.02, 0.32);
			if (b === 3) bassNote(tb + BEAT * 0.75, root + 12, BEAT / 4 - 0.02, 0.18);
		} else {
			hat(tb + BEAT / 2, 0.12);
		}
	}
	// arp: 8th notes, 2 octaves up
	for (let k = 0; k < 8; k++) {
		const note = chord[ARP[k]] + 12;
		pluck(t0 + k * (BEAT / 2), note, t0 >= fullFrom ? 0.07 : 0.05);
	}
}

// Master: gentle soft clip + normalize
let peak = 0;
for (let i = 0; i < N; i++) {
	L[i] = Math.tanh(L[i] * 1.1);
	R[i] = Math.tanh(R[i] * 1.1);
	peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
const norm = 0.89 / peak;
// fade out the tail
for (let i = 0; i < N; i++) {
	const t = i / SR;
	const fo = t > LENGTH - 1.5 ? (LENGTH - t) / 1.5 : 1;
	L[i] *= norm * fo;
	R[i] *= norm * fo;
}

const data = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
	data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i])) * 32767), i * 4);
	data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i])) * 32767), i * 4 + 2);
}
const header = Buffer.alloc(44);
header.write('RIFF', 0);
header.writeUInt32LE(36 + data.length, 4);
header.write('WAVE', 8);
header.write('fmt ', 12);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(2, 22);
header.writeUInt32LE(SR, 24);
header.writeUInt32LE(SR * 4, 28);
header.writeUInt16LE(4, 32);
header.writeUInt16LE(16, 34);
header.write('data', 36);
header.writeUInt32LE(data.length, 40);
mkdirSync('public', {recursive: true});
writeFileSync('public/music.wav', Buffer.concat([header, data]));
console.log(`music.wav written: ${LENGTH.toFixed(1)}s`);
