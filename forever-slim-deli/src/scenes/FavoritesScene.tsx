import {Audio} from '@remotion/media';
import type React from 'react';
import {AbsoluteFill, Interactive, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig, type InteractivitySchema} from 'remotion';
import {backOut, brand, clamp, fontFamily} from '../theme';
import {Blob, Dish, type DishName, Pill, PopWords} from '../ui';

type Props = {
	readonly line1: string;
	readonly line2: string;
	readonly style?: React.CSSProperties;
};

const DISHES: {name: DishName; label: string; x: number; y: number; size: number; delay: number}[] = [
	{name: 'hummus', label: 'Hummus', x: 540, y: 1110, size: 520, delay: 14},
	{name: 'grape-leaves', label: 'Grape Leaves', x: 250, y: 790, size: 400, delay: 24},
	{name: 'mtabal', label: 'Mtabal', x: 835, y: 800, size: 400, delay: 32},
	{name: 'hindbeh', label: 'Hindbeh', x: 250, y: 1450, size: 400, delay: 40},
	{name: 'green-beans', label: 'Loubieh', x: 835, y: 1450, size: 400, delay: 48},
];

const FavoritesSceneInner: React.FC<Props> = ({line1, line2, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	return (
		<AbsoluteFill style={{fontFamily, backgroundColor: brand.cream, ...style}}>
			<Blob x={900} y={300} size={900} color="rgba(232,93,6,0.18)" />
			<Blob x={150} y={1500} size={1000} color="rgba(93,137,57,0.2)" phase={50} />

			<PopWords text={line1} at={2} top={200} size={120} color={brand.green} />
			<PopWords text={line2} at={8} top={330} size={160} color={brand.orange} />

			{DISHES.map((d) => {
				const p = interpolate(frame, [d.delay, d.delay + 20], [0, 1], {...clamp, easing: backOut});
				return (
					<Dish
						key={d.name}
						name={d.name}
						x={d.x}
						y={d.y - (1 - Math.min(1, p)) * 1100}
						size={d.size}
						style={{
							rotate: `${(1 - p) * -160 + frame * 0.25}deg`,
							scale: String(0.6 + 0.4 * p),
						}}
					/>
				);
			})}
			{DISHES.map((d) => (
				<Pill key={d.label} at={d.delay + 14} x={d.x} y={d.y + d.size / 2 - 10} color={d.name === 'hummus' ? brand.orange : brand.green}>
					{d.label}
				</Pill>
			))}

			{DISHES.map((d) => (
				<Sequence key={d.name} name={`Land ${d.label}`} from={d.delay + 14} durationInFrames={10} premountFor={fps}>
					<Audio src={staticFile('sfx/pop.wav')} volume={0.7} />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};

const schema = {
	line1: {type: 'text-content', default: 'Mediterranean', description: 'Line 1'},
	line2: {type: 'text-content', default: 'Favorites!', description: 'Line 2'},
} as const satisfies InteractivitySchema;

export const FavoritesScene = Interactive.withSchema({Component: FavoritesSceneInner, componentName: '<FavoritesScene>', schema, wrapInSequence: true});
