// Generates all music and sound effects for the video into public/ (original, royalty-free).
// Run: node scripts/gen-audio.mjs
import {mkdirSync, writeFileSync} from 'node:fs';

const SR = 44100;
let seed = 11;
const rand = () => {
	seed = (seed * 16807) % 2147483647;
	return seed / 2147483647 - 0.5;
};
const mtof = (m) => 440 * 2 ** ((m - 69) / 12);
const buf = (s) => new Float32Array(Math.round(s * SR));
const add = (b, i, v) => {
	if (i >= 0 && i < b.length) b[i] += v;
};

const writeWav = (path, L, R = L) => {
	let peak = 0;
	for (let i = 0; i < L.length; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
	const norm = peak > 0.95 ? 0.95 / peak : 1;
	const data = Buffer.alloc(L.length * 4);
	for (let i = 0; i < L.length; i++) {
		data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * norm)) * 32767), i * 4);
		data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * norm)) * 32767), i * 4 + 2);
	}
	const h = Buffer.alloc(44);
	h.write('RIFF', 0);
	h.writeUInt32LE(36 + data.length, 4);
	h.write('WAVE', 8);
	h.write('fmt ', 12);
	h.writeUInt32LE(16, 16);
	h.writeUInt16LE(1, 20);
	h.writeUInt16LE(2, 22);
	h.writeUInt32LE(SR, 24);
	h.writeUInt32LE(SR * 4, 28);
	h.writeUInt16LE(4, 32);
	h.writeUInt16LE(16, 34);
	h.write('data', 36);
	h.writeUInt32LE(data.length, 40);
	writeFileSync(`public/${path}`, Buffer.concat([h, data]));
};

// ---------- instruments ----------
const pluck = (b, at, midi, dur, gain) => {
	const f = mtof(midi);
	const s = Math.round(at * SR);
	for (let i = 0; i < dur * SR; i++) {
		const t = i / SR;
		const env = Math.min(1, t * 600) * Math.exp(-t * 7);
		add(b, s + i, (Math.sin(2 * Math.PI * f * t) + 0.35 * Math.sin(4 * Math.PI * f * t) * Math.exp(-t * 18)) * env * gain);
	}
};
const marimba = (b, at, midi, gain) => {
	const f = mtof(midi);
	const s = Math.round(at * SR);
	for (let i = 0; i < 0.6 * SR; i++) {
		const t = i / SR;
		add(b, s + i, (Math.sin(2 * Math.PI * f * t) * 0.8 + Math.sin(2 * Math.PI * f * 4 * t) * 0.2 * Math.exp(-t * 30)) * Math.min(1, t * 900) * Math.exp(-t * 9) * gain);
	}
};
const bass = (b, at, midi, dur, gain) => {
	const f = mtof(midi);
	const s = Math.round(at * SR);
	for (let i = 0; i < dur * SR; i++) {
		const t = i / SR;
		const env = Math.min(1, t * 200) * Math.min(1, (dur - t) * 30);
		add(b, s + i, Math.tanh(Math.sin(2 * Math.PI * f * t) * 1.5) * env * gain);
	}
};
const shaker = (b, at, gain) => {
	const s = Math.round(at * SR);
	let prev = 0;
	for (let i = 0; i < 0.05 * SR; i++) {
		const t = i / SR;
		const n = rand();
		add(b, s + i, (n - prev) * Math.exp(-t * 60) * gain);
		prev = n;
	}
};
const knock = (b, at, gain) => {
	const s = Math.round(at * SR);
	let ph = 0;
	for (let i = 0; i < 0.25 * SR; i++) {
		const t = i / SR;
		ph += (60 + 90 * Math.exp(-t * 30)) / SR;
		add(b, s + i, Math.sin(2 * Math.PI * ph) * Math.exp(-t * 14) * gain);
	}
};

// ---------- happy music: bouncy, playful, F major, 112 BPM, 16s ----------
{
	const BPM = 112;
	const beat = 60 / BPM;
	const L = buf(16);
	const prog = [
		[65, [53, 57, 60]],
		[70, [58, 62, 65]],
		[72, [60, 64, 67]],
		[65, [53, 57, 60]],
	];
	const melody = [77, 76, 74, 72, 74, 76, 77, 79, 81, 79, 77, 76, 74, 72, 74, 72];
	let n = 0;
	for (let bar = 0; bar < 8; bar++) {
		const [, chord] = prog[bar % 4];
		const root = chord[0] - 12;
		for (let k = 0; k < 4; k++) {
			const t = (bar * 4 + k) * beat;
			if (t > 15.5) break;
			knock(L, t, k % 2 === 0 ? 0.5 : 0.25);
			shaker(L, t + beat / 2, 0.2);
			bass(L, t, root + (k % 2 ? 7 : 0), beat * 0.45, 0.22);
			chord.forEach((m) => pluck(L, t + beat / 2, m + 12, 0.3, 0.05));
			marimba(L, t, melody[n % melody.length], 0.18);
			if (k === 3) marimba(L, t + beat / 2, melody[(n + 1) % melody.length], 0.12);
			n++;
		}
	}
	for (let i = 0; i < L.length; i++) L[i] = Math.tanh(L[i] * 1.2) * 0.8;
	writeWav('music-happy.wav', L);
}

// ---------- sad comedic ending: slow minor pad + "wah wah wah wahhh" trombone, 9s ----------
{
	const L = buf(9);
	// soft pad: Dm - Bb - Gm - A
	const chords = [
		[50, 53, 57],
		[46, 50, 53],
		[43, 46, 50],
		[45, 49, 52],
	];
	chords.forEach((c, ci) => {
		c.forEach((m) => {
			const f = mtof(m + 12);
			const s = Math.round(ci * 1.6 * SR);
			for (let i = 0; i < 1.9 * SR; i++) {
				const t = i / SR;
				const env = Math.min(1, t / 0.4) * Math.min(1, (1.9 - t) / 0.5);
				add(L, s + i, (Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(2 * Math.PI * f * 2.003 * t)) * env * 0.05);
			}
		});
	});
	// trombone "wah wah wah wahhh"
	const notes = [
		[6.4 - 6.4 + 1.2, 58, 0.45],
		[1.75, 57, 0.45],
		[2.3, 56, 0.45],
		[2.85, 55, 1.6],
	];
	for (const [at, m, dur] of notes) {
		const f0 = mtof(m - 12);
		const s = Math.round((at + 3.2) * SR);
		let ph = 0;
		let lp = 0;
		for (let i = 0; i < dur * SR; i++) {
			const t = i / SR;
			const vib = dur > 1 ? Math.sin(2 * Math.PI * 5.5 * t) * 0.025 * Math.min(1, t / 0.4) : 0;
			const bend = dur > 1 ? -0.04 * Math.min(1, t / dur) : 0;
			ph += (f0 * (1 + vib + bend)) / SR;
			const saw = 2 * (ph % 1) - 1;
			const wah = 0.05 + 0.25 * Math.min(1, t / 0.12) * (1 - 0.6 * Math.min(1, t / dur));
			lp += wah * (saw - lp);
			const env = Math.min(1, t / 0.04) * Math.min(1, (dur - t) / 0.08);
			add(L, s + i, lp * env * 0.5);
		}
	}
	writeWav('music-sad.wav', L);
}

// ---------- SFX ----------
mkdirSync('public/sfx', {recursive: true});
const sfx = (name, seconds, fn) => {
	const L = buf(seconds);
	fn(L);
	writeWav(`sfx/${name}.wav`, L);
};

sfx('kaching', 0.9, (b) => {
	// drawer clunk + bell
	knock(b, 0, 0.5);
	for (let i = 0; i < 0.06 * SR; i++) add(b, i, rand() * Math.exp((-i / SR) * 70) * 0.5);
	for (const [f, at] of [
		[2637, 0.06],
		[3520, 0.1],
	]) {
		const s = Math.round(at * SR);
		for (let i = 0; i < 0.7 * SR; i++) {
			const t = i / SR;
			add(b, s + i, (Math.sin(2 * Math.PI * f * t) + 0.4 * Math.sin(2 * Math.PI * f * 2.76 * t)) * Math.exp(-t * 6) * 0.25);
		}
	}
});

sfx('scratch', 0.7, (b) => {
	let lp = 0;
	for (let i = 0; i < b.length; i++) {
		const t = i / SR;
		const rate = 0.05 + 0.5 * Math.abs(Math.sin(t * 9));
		lp += rate * (rand() - lp);
		const tone = Math.sin(2 * Math.PI * (300 + 900 * Math.sin(t * 9)) * t) * 0.3;
		b[i] = (lp * 2 + tone) * Math.min(1, (0.7 - t) / 0.1) * 0.8;
	}
});

sfx('tick', 4, (b) => {
	for (let k = 0; k < 8; k++) {
		const s = Math.round(k * 0.5 * SR);
		const f = k % 2 ? 1500 : 1950;
		for (let i = 0; i < 1800; i++) {
			const t = i / SR;
			add(b, s + i, (Math.sin(2 * Math.PI * f * t) * 0.6 + rand() * 0.3) * Math.exp(-t * 230) * 0.6);
		}
	}
});

sfx('fasttick', 3, (b) => {
	for (let k = 0; k < 30; k++) {
		const s = Math.round(k * 0.1 * SR);
		for (let i = 0; i < 1200; i++) {
			const t = i / SR;
			add(b, s + i, (Math.sin(2 * Math.PI * (k % 2 ? 1600 : 2000) * t) * 0.6 + rand() * 0.3) * Math.exp(-t * 260) * 0.5);
		}
	}
});

sfx('crickets', 3, (b) => {
	for (let c = 0; c < 6; c++) {
		const s0 = c * 0.5 + (c % 2) * 0.12;
		for (let k = 0; k < 3; k++) {
			const s = Math.round((s0 + k * 0.06) * SR);
			for (let i = 0; i < 0.04 * SR; i++) {
				const t = i / SR;
				add(b, s + i, Math.sin(2 * Math.PI * 4400 * t) * Math.sin((Math.PI * t) / 0.04) * 0.18);
			}
		}
	}
});

sfx('pop', 0.15, (b) => {
	let ph = 0;
	for (let i = 0; i < b.length; i++) {
		const t = i / SR;
		ph += (380 + 900 * Math.min(1, t / 0.04)) / SR;
		b[i] = Math.sin(2 * Math.PI * ph) * Math.exp(-t * 32) * 0.6;
	}
});

sfx('sparkle', 0.8, (b) => {
	[2093, 2637, 3136, 4186].forEach((f, k) => {
		const s = Math.round(k * 0.06 * SR);
		for (let i = 0; i < 0.5 * SR; i++) {
			const t = i / SR;
			add(b, s + i, Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 9) * 0.14);
		}
	});
});

sfx('whoosh', 0.5, (b) => {
	let lp = 0;
	for (let i = 0; i < b.length; i++) {
		const t = i / b.length;
		lp += (0.02 + 0.3 * t) * (rand() - lp);
		b[i] = lp * Math.sin(Math.PI * t) ** 2 * 2;
	}
});

sfx('stamp', 0.4, (b) => {
	knock(b, 0, 0.9);
	for (let i = 0; i < 0.08 * SR; i++) add(b, i, rand() * Math.exp((-i / SR) * 50) * 0.6);
});

sfx('click', 0.12, (b) => {
	for (let i = 0; i < 0.03 * SR; i++) {
		const t = i / SR;
		add(b, i, (rand() * 0.6 + Math.sin(2 * Math.PI * 2500 * t) * 0.4) * Math.exp(-t * 200) * 0.8);
	}
	for (let i = 0; i < 0.03 * SR; i++) {
		const t = i / SR;
		add(b, Math.round(0.05 * SR) + i, rand() * Math.exp(-t * 300) * 0.4);
	}
});

sfx('flip', 0.3, (b) => {
	let prev = 0;
	for (let i = 0; i < b.length; i++) {
		const t = i / SR;
		const n = rand();
		b[i] = (n - prev) * Math.sin((Math.PI * t) / 0.3) * 0.7;
		prev = n;
	}
	knock(b, 0.22, 0.3);
});

sfx('steps', 1.2, (b) => {
	for (let k = 0; k < 4; k++) knock(b, k * 0.28, 0.35);
});

sfx('boing', 0.5, (b) => {
	let ph = 0;
	for (let i = 0; i < b.length; i++) {
		const t = i / SR;
		ph += (220 + 180 * Math.sin(t * 40) * Math.exp(-t * 6)) / SR;
		b[i] = Math.sin(2 * Math.PI * ph) * Math.exp(-t * 6) * 0.5;
	}
});

console.log('audio written');
