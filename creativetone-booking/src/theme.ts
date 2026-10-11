import {loadFont} from '@remotion/fonts';
import {Easing, interpolate, staticFile} from 'remotion';

// Inter variable font (latin subset), bundled in public/ so rendering works offline.
loadFont({family: 'Inter', url: staticFile('Inter.woff2'), weight: '400 800'});

export const fontFamily = 'Inter, Helvetica, Arial, sans-serif';

export const theme = {
	bg: '#07070F',
	bgSoft: '#12121F',
	accent: '#FF4D2E',
	accent2: '#FF2E93',
	violet: '#7B5CFF',
	success: '#22C55E',
	text: '#FFFFFF',
	muted: 'rgba(255,255,255,0.62)',
	ink: '#0B0B16',
	inkMuted: '#5B5B72',
	line: '#E7E7F0',
	gradient: 'linear-gradient(120deg, #FF4D2E 0%, #FF2E93 55%, #7B5CFF 100%)',
};

export const DOMAIN = 'creativetoneagency.com';

/** Frames per typed character. Matches the click spacing in public/typing.wav. */
export const FRAMES_PER_CHAR = 2;

export const ease = Easing.bezier(0.16, 1, 0.3, 1);

export const clamp = {
	extrapolateLeft: 'clamp',
	extrapolateRight: 'clamp',
} as const;

/** Returns the substring visible at `frame` when typing starts at `start`. */
export const typed = (text: string, frame: number, start: number) => {
	const chars = Math.floor(
		interpolate(frame, [start, start + text.length * FRAMES_PER_CHAR], [0, text.length], clamp),
	);
	return text.slice(0, chars);
};

export const typingDuration = (text: string) => text.length * FRAMES_PER_CHAR;
