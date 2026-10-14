import {loadFont} from '@remotion/fonts';
import {Easing, interpolate, staticFile} from 'remotion';

// Neue Haas Grotesk Display Pro — the Forever Slim brand typeface, bundled in public/fonts.
for (const [file, weight] of [
	['NeueHaasDisplayRoman', '400'],
	['NeueHaasDisplayMediu', '500'],
	['NeueHaasDisplayBold', '700'],
	['NeueHaasDisplayBlack', '900'],
] as const) {
	loadFont({family: 'Neue Haas Display', url: staticFile(`fonts/${file}.ttf`), weight});
}
loadFont({family: 'Neue Haas Display', url: staticFile('fonts/NeueHaasDisplayBlackItalic.ttf'), weight: '900', style: 'italic'});

export const fontFamily = '"Neue Haas Display", Helvetica, Arial, sans-serif';

// Sampled from the Forever Slim logo
export const brand = {
	orange: '#E85D06',
	orangeLight: '#FF8A3D',
	green: '#5C893A',
	/** Lighter tint of the brand green, for full-frame backgrounds. */
	greenBg: '#6A9E43',
	greenDark: '#3F6328',
	greenDeep: '#2C4A1C',
	greenLight: '#EAF2DF',
	cream: '#FBF6EC',
	kraft: '#C99B68',
	kraftDark: '#A97B4B',
	ink: '#1F2A17',
	oil: '#E8B425',
};

export const expoOut = Easing.bezier(0.16, 1, 0.3, 1);
export const inOut = Easing.bezier(0.65, 0, 0.35, 1);
export const backOut = Easing.bezier(0.34, 1.56, 0.64, 1);

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const progress = (frame: number, from: number, to: number, easing = expoOut) =>
	interpolate(frame, [from, to], [0, 1], {...clamp, easing});

export const pop = (frame: number, from: number, dur = 16) =>
	interpolate(frame, [from, from + dur], [0, 1], {...clamp, easing: backOut});
