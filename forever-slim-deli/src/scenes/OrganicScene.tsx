import {Audio} from '@remotion/media';
import type React from 'react';
import {AbsoluteFill, Interactive, interpolate, staticFile, useCurrentFrame, useVideoConfig, type InteractivitySchema} from 'remotion';
import {Chickpea, Cucumber, Garlic, Lemon, Mint, Olive, Parsley, Tomato} from '../icons';
import {backOut, brand, clamp, expoOut, fontFamily, inOut, progress} from '../theme';
import {Dish, KineticText} from '../ui';

type Props = {
	readonly line1: string;
	readonly line2: string;
	readonly style?: React.CSSProperties;
};

const BOWL = {x: 540, y: 1230, size: 640};
const SPOUT = {x: 630, y: 880};

const T = {pourStart: 78, pourEnd: 112, oilTitle: 64};

const INGREDIENTS = [
	{Icon: Tomato, angle: -165, delay: 8},
	{Icon: Lemon, angle: -130, delay: 13},
	{Icon: Parsley, angle: 0, delay: 18},
	{Icon: Garlic, angle: 35, delay: 23},
	{Icon: Chickpea, angle: 72, delay: 28},
	{Icon: Olive, angle: 108, delay: 33},
	{Icon: Cucumber, angle: 145, delay: 38},
	{Icon: Mint, angle: 180, delay: 43},
];

/** Olive oil bottle, drawn with its spout at the local origin so it can tilt around it. */
const Bottle: React.FC = () => (
	<svg width="200" height="480" viewBox="-100 -20 200 480">
		<rect x="-16" y="-20" width="32" height="26" rx="6" fill="#7A5230" />
		<path d="M-20 4 L20 4 L22 70 Q80 100 80 150 L80 420 Q80 450 50 450 L-50 450 Q-80 450 -80 420 L-80 150 Q-80 100 -22 70 Z" fill="#9CBF5A" opacity="0.95" />
		<path d="M-74 210 L74 210 L74 420 Q74 444 50 444 L-50 444 Q-74 444 -74 420 Z" fill={brand.oil} opacity="0.9" />
		<rect x="-62" y="240" width="124" height="120" rx="16" fill={brand.cream} />
		<text x="0" y="292" textAnchor="middle" fontFamily="Neue Haas Display" fontWeight="900" fontSize="30" fill={brand.green}>
			OLIVE
		</text>
		<text x="0" y="330" textAnchor="middle" fontFamily="Neue Haas Display" fontWeight="700" fontSize="26" fill={brand.orange}>
			OIL
		</text>
		<path d="M-60 130 Q-64 200 -60 400" stroke="rgba(255,255,255,0.5)" strokeWidth="10" fill="none" strokeLinecap="round" />
	</svg>
);

const spiral = (cx: number, cy: number, turns: number, rMax: number) => {
	const pts: string[] = [];
	const n = 120;
	for (let i = 0; i <= n; i++) {
		const t = i / n;
		const a = t * turns * Math.PI * 2;
		const r = 10 + t * rMax;
		pts.push(`${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r * 0.92).toFixed(1)}`);
	}
	return `M ${pts.join(' L ')}`;
};

const OrganicSceneInner: React.FC<Props> = ({line1, line2, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const bowlIn = interpolate(frame, [0, 18], [0, 1], {...clamp, easing: backOut});
	const bottleIn = progress(frame, 56, 72);
	const tilt = interpolate(frame, [58, 76, T.pourEnd + 4, T.pourEnd + 16], [-20, -140, -140, -60], {...clamp, easing: inOut});
	const head = progress(frame, T.pourStart, T.pourStart + 10, inOut);
	const tail = progress(frame, T.pourEnd, T.pourEnd + 10, inOut);
	const drizzle = progress(frame, T.pourStart + 6, T.pourEnd + 8, inOut);

	return (
		<AbsoluteFill style={{fontFamily, backgroundColor: brand.greenLight, ...style}}>
			<KineticText
				at={2}
				top={150}
				lines={[
					{text: line1, color: brand.green, size: 100},
					{text: line2, color: 'white', size: 100, block: brand.orange, at: T.oilTitle},
				]}
			/>

			<Dish name="hummus" x={BOWL.x} y={BOWL.y} size={BOWL.size} style={{scale: String(bowlIn), rotate: `${frame * 0.2}deg`}} />

			{/* Olive oil drizzle on the hummus */}
			<svg width="1080" height="1920" style={{position: 'absolute', left: 0, top: 0}}>
				<path
					d={spiral(BOWL.x, BOWL.y, 2.6, 190)}
					stroke={brand.oil}
					strokeWidth="16"
					strokeLinecap="round"
					fill="none"
					opacity="0.9"
					pathLength={1}
					strokeDasharray={1}
					strokeDashoffset={1 - drizzle}
				/>
				<path
					d={spiral(BOWL.x - 4, BOWL.y - 4, 2.6, 190)}
					stroke="rgba(255,248,200,0.8)"
					strokeWidth="5"
					strokeLinecap="round"
					fill="none"
					pathLength={1}
					strokeDasharray={1}
					strokeDashoffset={1 - drizzle}
				/>
				{/* Pour stream */}
				<path
					d={`M ${SPOUT.x} ${SPOUT.y} Q ${SPOUT.x - 10} ${(SPOUT.y + BOWL.y) / 2} ${BOWL.x} ${BOWL.y}`}
					stroke={brand.oil}
					strokeWidth={14 + Math.sin(frame / 2) * 2}
					strokeLinecap="round"
					fill="none"
					pathLength={1}
					strokeDasharray={`${Math.max(0, head - tail)} 2`}
					strokeDashoffset={-tail}
					opacity={head > 0 && tail < 1 ? 1 : 0}
				/>
			</svg>

			{/* Bottle tilting around its spout */}
			<div
				style={{
					position: 'absolute',
					left: SPOUT.x - 100,
					top: SPOUT.y - 20,
					transformOrigin: '100px 20px',
					rotate: `${tilt}deg`,
					translate: `${(1 - bottleIn) * 700}px ${(1 - bottleIn) * -500}px`,
					opacity: bottleIn,
					filter: 'drop-shadow(0 20px 30px rgba(40,60,20,0.25))',
				}}
			>
				<Bottle />
			</div>

			{/* Fresh ingredients fly in and orbit the bowl */}
			{INGREDIENTS.map(({Icon, angle, delay}, i) => {
				const p = progress(frame, delay, delay + 22, expoOut);
				const a = ((angle + frame * 0.15) * Math.PI) / 180;
				const dist = 410 + (1 - p) * 1100;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: BOWL.x + Math.cos(a) * dist - 80,
							top: BOWL.y + Math.sin(a) * dist - 80 + Math.sin((frame + i * 12) / 10) * 12,
							rotate: `${(1 - p) * 360}deg`,
							opacity: Math.min(1, p * 2),
							filter: 'drop-shadow(0 12px 16px rgba(40,60,20,0.22))',
						}}
					>
						<Icon size={160} />
					</div>
				);
			})}

			<Audio name="Ingredients whoosh" src={staticFile('sfx/whoosh.wav')} from={6} premountFor={fps} volume={0.7} />
			<Audio name="Ingredients whoosh 2" src={staticFile('sfx/whoosh.wav')} from={26} premountFor={fps} volume={0.5} />
			<Audio name="Bottle in" src={staticFile('sfx/whoosh.wav')} from={54} premountFor={fps} volume={0.5} />
			<Audio name="Olive oil pour" src={staticFile('sfx/pour.wav')} from={T.pourStart} durationInFrames={T.pourEnd - T.pourStart + 10} premountFor={fps} volume={0.9} />
		</AbsoluteFill>
	);
};

const schema = {
	line1: {type: 'text-content', default: 'Organic Ingredients.', description: 'Line 1'},
	line2: {type: 'text-content', default: 'Olive Oil Goodness.', description: 'Line 2'},
} as const satisfies InteractivitySchema;

export const OrganicScene = Interactive.withSchema({Component: OrganicSceneInner, componentName: '<OrganicScene>', schema, wrapInSequence: true});
