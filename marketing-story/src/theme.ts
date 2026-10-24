import {loadFont} from '@remotion/fonts';
import {Easing, interpolate, staticFile} from 'remotion';

// Rubik covers both Latin and Arabic; bundled locally so rendering works offline.
loadFont({family: 'Rubik', url: staticFile('fonts/rubik-latin.woff2'), weight: '400 900'});
loadFont({family: 'RubikArabic', url: staticFile('fonts/rubik-arabic.woff2'), weight: '400 900'});

export const fontFamily = 'Rubik, RubikArabic, Helvetica, Arial, sans-serif';

// Palette taken from the reference frame
export const c = {
	line: '#2B2420',
	facade: '#EBD3A4',
	facadeLight: '#F2DFB8',
	facadeDark: '#DCC08E',
	facade2: '#E3C996',
	window: '#2F4A70',
	windowLit: '#F6D37A',
	shutter: '#4F7F6E',
	burgundy: '#8C2F39',
	burgundyDark: '#6E222B',
	cream: '#F4E6CF',
	glass: '#9A978F',
	door: '#6E3F2B',
	wood: '#A8734A',
	woodDark: '#7A4F33',
	sidewalk: '#D8D1C3',
	sidewalkLine: '#B8B0A2',
	curb: '#ABA497',
	road: '#575352',
	roadLine: '#CFC7B8',
	yellow: '#E9B949',
	shutterGrey: '#3E4F63',
	skin: '#FFFFFF',
	hair: '#241B17',
	shirt: '#F4F1EA',
	pants: '#1E2A44',
	red: '#E0322B',
	green: '#3E9B4F',
	money: '#7BD389',
	hud: 'rgba(38,32,30,0.82)',
	night: '#141B33',
};

export const expoOut = Easing.bezier(0.16, 1, 0.3, 1);
export const inOut = Easing.bezier(0.65, 0, 0.35, 1);
export const backOut = Easing.bezier(0.34, 1.56, 0.64, 1);
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const progress = (frame: number, from: number, to: number, easing = expoOut) =>
	interpolate(frame, [from, to], [0, 1], {...clamp, easing});

export const pop = (frame: number, from: number, dur = 14) =>
	interpolate(frame, [from, from + dur], [0, 1], {...clamp, easing: backOut});

/** Scene start frames (global, 30fps). */
export const S = {
	dream: 0,
	spend: 150,
	marketing: 390,
	opening: 570,
	excuses: 780,
	end: 930,
	final: 1080,
	total: 1200,
};
