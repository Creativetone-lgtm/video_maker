import {Audio} from '@remotion/media';
import type React from 'react';
import {AbsoluteFill, Img, Interactive, interpolate, staticFile, useCurrentFrame, useVideoConfig, type InteractivitySchema} from 'remotion';
import {Chickpea, Lemon, Mint, Olive, Pomegranate, Tomato} from '../icons';
import {backOut, brand, clamp, fontFamily, pop} from '../theme';
import {KineticText} from '../ui';

type Props = {
	readonly line1: string;
	readonly line2: string;
	readonly style?: React.CSSProperties;
};

const CLOCK = {x: 540, y: 1170, w: 660};
const RING_AT = 20;

const ICONS = [
	{Icon: Tomato, angle: -155, delay: 26},
	{Icon: Lemon, angle: -25, delay: 30},
	{Icon: Olive, angle: 15, delay: 34},
	{Icon: Mint, angle: 165, delay: 38},
	{Icon: Chickpea, angle: 125, delay: 42},
	{Icon: Pomegranate, angle: 55, delay: 46},
];

const HungrySceneInner: React.FC<Props> = ({line1, line2, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const spin = interpolate(frame, [0, RING_AT], [0, 1], {...clamp, easing: backOut});
	const ringing = frame >= RING_AT ? 1 : 0;
	const shake = ringing * Math.sin(frame * 2.6) * 5;
	const jitter = ringing * Math.sin(frame * 3.3) * 6;
	const buzz = ringing * (Math.floor(frame / 2) % 2);

	return (
		<AbsoluteFill style={{fontFamily, backgroundColor: brand.green, ...style}}>
			<KineticText
				at={4}
				top={210}
				lines={[
					{text: line1, color: 'white', size: 190},
					{text: line2, color: 'white', size: 112, block: brand.orange},
				]}
			/>

			{/* Alarm clock: spins in, then rings */}
			<div
				style={{
					position: 'absolute',
					left: CLOCK.x - CLOCK.w / 2 + jitter,
					top: CLOCK.y - (CLOCK.w * 1254) / 1170 / 2,
					width: CLOCK.w,
					scale: String(spin),
					rotate: `${(1 - spin) * -360 + shake}deg`,
				}}
			>
				<Img src={staticFile('clock.png')} style={{width: CLOCK.w, filter: 'drop-shadow(0 30px 30px rgba(20,40,10,0.35))'}} />
			</div>
			{/* Ringing marks by the bells */}
			{[
				[-1, 0],
				[-1, 1],
				[1, 0],
				[1, 1],
			].map(([side, k]) => (
				<div
					key={`${side}-${k}`}
					style={{
						position: 'absolute',
						left: CLOCK.x + side * (CLOCK.w / 2 + 10 + k * 34) - 9,
						top: CLOCK.y - 340 + k * 50,
						width: 18,
						height: 70,
						borderRadius: 9,
						backgroundColor: 'white',
						rotate: `${side * (40 + k * 15)}deg`,
						opacity: buzz,
					}}
				/>
			))}

			{/* Food icons pop around the clock */}
			{ICONS.map(({Icon, angle, delay}, i) => {
				const p = pop(frame, delay, 14);
				const rad = (angle * Math.PI) / 180;
				const dist = 470 * Math.min(1, p);
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: CLOCK.x + Math.cos(rad) * dist - 70,
							top: CLOCK.y + Math.sin(rad) * dist - 70 + Math.sin((frame + i * 10) / 8) * 10,
							width: 140,
							height: 140,
							borderRadius: 70,
							backgroundColor: 'white',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							scale: String(p),
							rotate: `${(1 - Math.min(1, p)) * -90}deg`,
						}}
					>
						<Icon size={96} />
					</div>
				);
			})}

			<Audio name="Clock whoosh" src={staticFile('sfx/whoosh.wav')} premountFor={fps} volume={0.6} />
			<Audio name="Alarm" src={staticFile('sfx/alarm.wav')} from={RING_AT} premountFor={fps} volume={0.55} />
			<Audio name="Icons pop" src={staticFile('sfx/pop.wav')} from={30} premountFor={fps} volume={0.6} />
			<Audio name="Icons pop 2" src={staticFile('sfx/pop.wav')} from={42} premountFor={fps} volume={0.6} />
		</AbsoluteFill>
	);
};

const schema = {
	line1: {type: 'text-content', default: 'Hungry?', description: 'Line 1'},
	line2: {type: 'text-content', default: 'In a hurry?', description: 'Line 2'},
} as const satisfies InteractivitySchema;

export const HungryScene = Interactive.withSchema({Component: HungrySceneInner, componentName: '<HungryScene>', schema, wrapInSequence: true});
