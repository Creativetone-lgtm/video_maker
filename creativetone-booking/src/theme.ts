import {loadFont} from '@remotion/fonts';
import type React from 'react';
import {Easing, interpolate, staticFile} from 'remotion';

// Outfit — the CreativeTone brand typeface, bundled in public/fonts.
const WEIGHTS = [
	['Light', '300'],
	['Regular', '400'],
	['Medium', '500'],
	['SemiBold', '600'],
	['Bold', '700'],
	['ExtraBold', '800'],
	['Black', '900'],
] as const;

for (const [name, weight] of WEIGHTS) {
	loadFont({family: 'Outfit', url: staticFile(`fonts/Outfit-${name}.otf`), weight});
}

export const fontFamily = 'Outfit, Helvetica, Arial, sans-serif';

// Colours sampled from creativetoneagency.com
export const brand = {
	orange: '#FF5408',
	orangeHot: '#FF4E00',
	logo: '#EE3A23',
	ink: '#1A1714',
	inkSoft: '#4A423C',
	cream: '#FFF8EF',
	peach: '#FEE5D1',
	peachDeep: '#FDC3A0',
	dark: '#1E1714',
	success: '#34C759',
	danger: '#FF3B30',
	button: 'linear-gradient(180deg, #FF6A1F 0%, #FF4E00 100%)',
};

/** iOS-style light "liquid glass" surface. */
export const glass: React.CSSProperties = {
	background: 'linear-gradient(140deg, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0.28) 100%)',
	backdropFilter: 'blur(28px) saturate(180%)',
	WebkitBackdropFilter: 'blur(28px) saturate(180%)',
	border: '1.5px solid rgba(255,255,255,0.75)',
	boxShadow:
		'inset 0 2px 2px rgba(255,255,255,0.9), inset 0 -2px 6px rgba(255,255,255,0.35), 0 24px 60px rgba(200,72,20,0.18)',
};

/** Dark glass, for the call screen. */
export const glassDark: React.CSSProperties = {
	background: 'linear-gradient(140deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 100%)',
	backdropFilter: 'blur(30px) saturate(160%)',
	WebkitBackdropFilter: 'blur(30px) saturate(160%)',
	border: '1.5px solid rgba(255,255,255,0.28)',
	boxShadow: 'inset 0 2px 2px rgba(255,255,255,0.35), 0 20px 50px rgba(0,0,0,0.25)',
};

export const DOMAIN = 'creativetoneagency.com';

/** Frames per typed character. Matches the key spacing in public/typing.wav. */
export const FRAMES_PER_CHAR = 2;

export const expoOut = Easing.bezier(0.16, 1, 0.3, 1);
export const inOut = Easing.bezier(0.65, 0, 0.35, 1);
export const backOut = Easing.bezier(0.34, 1.56, 0.64, 1);

export const clamp = {
	extrapolateLeft: 'clamp',
	extrapolateRight: 'clamp',
} as const;

/** 0 → 1 progress between two frames. */
export const progress = (frame: number, from: number, to: number, easing = expoOut) =>
	interpolate(frame, [from, to], [0, 1], {...clamp, easing});

/** Returns the part of `text` typed at `frame` when typing starts at `start`. */
export const typed = (text: string, frame: number, start: number) => {
	const chars = Math.floor(
		interpolate(frame, [start, start + text.length * FRAMES_PER_CHAR], [0, text.length], clamp),
	);
	return text.slice(0, chars);
};

export const typingDuration = (text: string) => text.length * FRAMES_PER_CHAR;

/** Masks typed details so no real data is shown. */
export const masked = (length: number) => '•'.repeat(length);
