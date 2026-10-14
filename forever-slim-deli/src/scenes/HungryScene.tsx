import {Audio} from '@remotion/media';
import type React from 'react';
import {AbsoluteFill, Interactive, interpolate, staticFile, useCurrentFrame, useVideoConfig, type InteractivitySchema} from 'remotion';
import {Chickpea, Cutlery, Lemon, Mint, Olive, Tomato} from '../icons';
import {backOut, brand, clamp, fontFamily, pop} from '../theme';
import {Blob, PopWords} from '../ui';

type Props = {
	readonly line1: string;
	readonly line2: string;
	readonly style?: React.CSSProperties;
};

const CLOCK = {x: 540, y: 1140, r: 300};

const ICONS = [
	{Icon: Tomato, angle: -150, delay: 22},
	{Icon: Lemon, angle: -90, delay: 28},
	{Icon: Olive, angle: -30, delay: 34},
	{Icon: Mint, angle: 30, delay: 40},
	{Icon: Chickpea, angle: 90, delay: 46},
	{Icon: Cutlery, angle: 150, delay: 52},
];

const HungrySceneInner: React.FC<Props> = ({line1, line2, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const clockIn = interpolate(frame, [0, 18], [0, 1], {...clamp, easing: backOut});
	const shake = Math.sin(frame * 1.7) * 2.5 * Math.min(1, frame / 20);
	// Hands race faster and faster
	const minute = frame * frame * 0.35;
	const hour = minute / 12;

	return (
		<AbsoluteFill style={{fontFamily, background: `linear-gradient(180deg, ${brand.green} 0%, ${brand.greenDark} 100%)`, ...style}}>
			<Blob x={180} y={300} size={900} color="rgba(255,255,255,0.18)" />
			<Blob x={900} y={1700} size={1000} color="rgba(232,93,6,0.35)" phase={40} />

			<PopWords text={line1} at={4} top={260} size={190} color="white" />
			<PopWords text={line2} at={20} top={470} size={130} color={brand.orangeLight} stagger={5} />

			{/* Clock */}
			<div
				style={{
					position: 'absolute',
					left: CLOCK.x - CLOCK.r,
					top: CLOCK.y - CLOCK.r,
					width: CLOCK.r * 2,
					height: CLOCK.r * 2,
					scale: String(clockIn),
					rotate: `${shake}deg`,
				}}
			>
				<svg width={CLOCK.r * 2} height={CLOCK.r * 2} viewBox="0 0 200 200">
					<circle cx="100" cy="100" r="96" fill={brand.orange} />
					<circle cx="100" cy="100" r="84" fill="white" />
					{new Array(12).fill(true).map((_, i) => (
						<rect key={i} x="98" y="22" width="4" height={i % 3 === 0 ? 14 : 8} rx="2" fill={brand.greenDark} transform={`rotate(${i * 30} 100 100)`} />
					))}
					<rect x="96" y="52" width="8" height="52" rx="4" fill={brand.greenDark} transform={`rotate(${hour} 100 100)`} />
					<rect x="98" y="30" width="4" height="74" rx="2" fill={brand.orange} transform={`rotate(${minute} 100 100)`} />
					<circle cx="100" cy="100" r="8" fill={brand.greenDark} />
				</svg>
				{/* bells */}
				<div style={{position: 'absolute', left: 40, top: -40, width: 120, height: 70, borderRadius: '70px 70px 10px 10px', backgroundColor: brand.orange, rotate: '-30deg'}} />
				<div style={{position: 'absolute', right: 40, top: -40, width: 120, height: 70, borderRadius: '70px 70px 10px 10px', backgroundColor: brand.orange, rotate: '30deg'}} />
			</div>

			{/* Food icons pop around the clock */}
			{ICONS.map(({Icon, angle, delay}, i) => {
				const p = pop(frame, delay, 14);
				const rad = (angle * Math.PI) / 180;
				const dist = (CLOCK.r + 150) * Math.min(1, p);
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: CLOCK.x + Math.cos(rad) * dist - 75,
							top: CLOCK.y + Math.sin(rad) * dist - 75 + Math.sin((frame + i * 10) / 8) * 10,
							width: 150,
							height: 150,
							borderRadius: 75,
							backgroundColor: 'rgba(255,255,255,0.16)',
							border: '2px solid rgba(255,255,255,0.35)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							scale: String(p),
							rotate: `${(1 - Math.min(1, p)) * -90}deg`,
						}}
					>
						<Icon size={104} />
					</div>
				);
			})}

			<Audio name="Ticking" src={staticFile('sfx/tick.wav')} durationInFrames={90} premountFor={fps} volume={0.8} />
			<Audio name="Pop line 1" src={staticFile('sfx/pop.wav')} from={4} premountFor={fps} />
			<Audio name="Pop line 2" src={staticFile('sfx/pop.wav')} from={20} premountFor={fps} />
			<Audio name="Pop icons" src={staticFile('sfx/pop.wav')} from={34} premountFor={fps} volume={0.6} />
			<Audio name="Pop icons 2" src={staticFile('sfx/pop.wav')} from={46} premountFor={fps} volume={0.6} />
		</AbsoluteFill>
	);
};

const schema = {
	line1: {type: 'text-content', default: 'Hungry?', description: 'Line 1'},
	line2: {type: 'text-content', default: 'In a hurry?', description: 'Line 2'},
} as const satisfies InteractivitySchema;

export const HungryScene = Interactive.withSchema({Component: HungrySceneInner, componentName: '<HungryScene>', schema, wrapInSequence: true});
