import {Audio} from '@remotion/media';
import type React from 'react';
import {AbsoluteFill, Img, Interactive, interpolate, staticFile, useCurrentFrame, useVideoConfig, type InteractivitySchema} from 'remotion';
import {Chickpea, Chili, Garlic, Lemon, Pomegranate, Tomato} from '../icons';
import {backOut, brand, clamp, fontFamily, inOut, pop} from '../theme';
import {KineticText} from '../ui';

type Props = {
	readonly line1: string;
	readonly line2: string;
	readonly style?: React.CSSProperties;
};

// clock-face.png is 1170×1254 with the painted hands removed; its centre is at (656, 731).
const SRC = {w: 1170, h: 1254, cx: 656, cy: 731};
const CLOCK = {x: 540, y: 1170, w: 660};
const K = CLOCK.w / SRC.w;
const H = SRC.h * K;

const T = {land: 24, sweepEnd: 62, ring: 58, ringEnd: 100};

const ICONS = [
	{Icon: Tomato, angle: -155, delay: 30},
	{Icon: Lemon, angle: -25, delay: 34},
	{Icon: Garlic, angle: 15, delay: 38},
	{Icon: Chili, angle: 165, delay: 42},
	{Icon: Chickpea, angle: 125, delay: 46},
	{Icon: Pomegranate, angle: 55, delay: 50},
];

const Hand: React.FC<{readonly length: number; readonly width: number; readonly angle: number; readonly tail?: number}> = ({length, width, angle, tail = 0}) => (
	<path
		d={`M ${-width / 2} ${tail} L ${-width * 0.3} ${-length * 0.85} L 0 ${-length} L ${width * 0.3} ${-length * 0.85} L ${width / 2} ${tail} Z`}
		fill="#E21F1A"
		transform={`rotate(${angle})`}
	/>
);

const HungrySceneInner: React.FC<Props> = ({line1, line2, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const drop = interpolate(frame, [0, T.land], [0, 1], {...clamp, easing: backOut});
	// Time-lapse: the minute hand sweeps two full turns, the hour hand follows.
	const sweep = interpolate(frame, [6, T.sweepEnd], [0, 1], {...clamp, easing: inOut});
	const minute = 60 + sweep * 720;
	const hour = -60 + sweep * 60;
	// Second hand ticks every 10 frames, in time with tick.wav
	const second = Math.floor(frame / 10) * 30 + interpolate(frame % 10, [0, 2], [-4, 0], clamp);
	// Relaxed alarm rock: ~3.3 swings per second, easing in and out
	const ringEnv = interpolate(frame, [T.ring, T.ring + 6, T.ringEnd - 10, T.ringEnd], [0, 1, 1, 0], clamp);
	const rock = Math.sin((frame - T.ring) * 0.7) * 4 * ringEnv;
	const hammer = Math.sin((frame - T.ring) * 0.7) > 0 ? ringEnv : 0;

	return (
		<AbsoluteFill style={{fontFamily, backgroundColor: brand.greenBg, ...style}}>
			<KineticText
				at={4}
				top={210}
				lines={[
					{text: line1, color: 'white', size: 190},
					{text: line2, color: 'white', size: 112, block: brand.orange},
				]}
			/>

			{/* Ringing marks by the bells */}
			{[-1, 1].map((side) =>
				[0, 1].map((k) => (
					<div
						key={`${side}-${k}`}
						style={{
							position: 'absolute',
							left: CLOCK.x + side * (CLOCK.w / 2 + 6 + k * 36) - 9,
							top: CLOCK.y - H / 2 + 40 + k * 46,
							width: 18,
							height: 64,
							borderRadius: 9,
							backgroundColor: 'white',
							rotate: `${side * (35 + k * 15)}deg`,
							opacity: side === 1 ? hammer : ringEnv - hammer,
							scale: String(0.8 + 0.2 * ringEnv),
						}}
					/>
				)),
			)}

			{/* Alarm clock */}
			<div
				style={{
					position: 'absolute',
					left: CLOCK.x - CLOCK.w / 2,
					top: CLOCK.y - H / 2 - (1 - drop) * 1500,
					width: CLOCK.w,
					height: H,
					transformOrigin: '50% 95%',
					rotate: `${rock + (1 - Math.min(1, drop)) * 8}deg`,
				}}
			>
				<Img src={staticFile('clock-face.png')} style={{width: CLOCK.w, height: H, filter: 'drop-shadow(0 30px 30px rgba(20,40,10,0.35))'}} />
				<svg width={CLOCK.w} height={H} style={{position: 'absolute', left: 0, top: 0}}>
					<g transform={`translate(${SRC.cx * K} ${SRC.cy * K})`}>
						<Hand length={100} width={16} angle={hour} tail={14} />
						<Hand length={150} width={12} angle={minute} tail={16} />
						<g transform={`rotate(${second})`}>
							<rect x={-1.6} y={-172} width={3.2} height={200} rx={1.6} fill="#E21F1A" />
						</g>
						<circle r={15} fill="#E21F1A" />
						<circle r={8} fill="#141414" />
					</g>
				</svg>
			</div>

			{/* Food icons pop around the clock */}
			{ICONS.map(({Icon, angle, delay}, i) => {
				const p = pop(frame, delay, 16);
				const rad = (angle * Math.PI) / 180;
				const dist = 470 * Math.min(1, p);
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: CLOCK.x + Math.cos(rad) * dist - 70,
							top: CLOCK.y + Math.sin(rad) * dist - 70 + Math.sin((frame + i * 10) / 12) * 10,
							width: 140,
							height: 140,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							scale: String(p),
							rotate: `${(1 - Math.min(1, p)) * -60}deg`,
							filter: 'drop-shadow(0 10px 12px rgba(20,40,10,0.3))',
						}}
					>
						<Icon size={140} />
					</div>
				);
			})}

			<Audio name="Ticking" src={staticFile('sfx/tick.wav')} durationInFrames={T.ring} premountFor={fps} volume={0.7} />
			<Audio name="Clock lands" src={staticFile('sfx/pop.wav')} from={T.land - 8} premountFor={fps} volume={0.5} />
			<Audio name="Alarm" src={staticFile('sfx/alarm.wav')} from={T.ring} premountFor={fps} volume={0.6} />
			<Audio name="Icons pop" src={staticFile('sfx/pop.wav')} from={34} premountFor={fps} volume={0.45} />
			<Audio name="Icons pop 2" src={staticFile('sfx/pop.wav')} from={46} premountFor={fps} volume={0.45} />
		</AbsoluteFill>
	);
};

const schema = {
	line1: {type: 'text-content', default: 'Hungry?', description: 'Line 1'},
	line2: {type: 'text-content', default: 'In a hurry?', description: 'Line 2'},
} as const satisfies InteractivitySchema;

export const HungryScene = Interactive.withSchema({Component: HungrySceneInner, componentName: '<HungryScene>', schema, wrapInSequence: true});
