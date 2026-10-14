import type React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {brand, fontFamily, pop} from './theme';

export type DishName = 'hummus' | 'mtabal' | 'hindbeh' | 'grape-leaves' | 'green-beans';

/** A top-down kraft bowl of food, centred on (x, y). */
export const Dish: React.FC<{
	readonly name: DishName;
	readonly x: number;
	readonly y: number;
	readonly size: number;
	readonly style?: React.CSSProperties;
}> = ({name, x, y, size, style}) => (
	<Img
		src={staticFile(`dishes/${name}.png`)}
		style={{
			position: 'absolute',
			left: x - size / 2,
			top: y - size / 2,
			width: size,
			height: size,
			objectFit: 'contain',
			filter: 'drop-shadow(0 30px 40px rgba(40,30,10,0.28))',
			...style,
		}}
	/>
);

/** Headline whose words pop in one after another. */
export const PopWords: React.FC<{
	readonly text: string;
	readonly at: number;
	readonly top: number;
	readonly size: number;
	readonly color: string;
	readonly stagger?: number;
	readonly weight?: number;
	readonly italic?: boolean;
}> = ({text, at, top, size, color, stagger = 4, weight = 900, italic = false}) => {
	const frame = useCurrentFrame();
	return (
		<div
			style={{
				position: 'absolute',
				left: 60,
				right: 60,
				top,
				textAlign: 'center',
				fontFamily,
				fontSize: size,
				fontWeight: weight,
				fontStyle: italic ? 'italic' : 'normal',
				letterSpacing: -size * 0.03,
				lineHeight: 1,
				color,
			}}
		>
			{text.split(' ').map((w, i) => {
				const p = pop(frame, at + i * stagger, 14);
				return (
					<span
						key={`${w}-${i}`}
						style={{
							display: 'inline-block',
							margin: `0 ${size * 0.12}px`,
							opacity: Math.min(1, p * 1.5),
							scale: String(p),
							translate: `0px ${(1 - Math.min(1, p)) * 40}px`,
						}}
					>
						{w}
					</span>
				);
			})}
		</div>
	);
};

/** Soft decorative blobs. */
export const Blob: React.FC<{readonly x: number; readonly y: number; readonly size: number; readonly color: string; readonly phase?: number}> = ({
	x,
	y,
	size,
	color,
	phase = 0,
}) => {
	const frame = useCurrentFrame();
	return (
		<div
			style={{
				position: 'absolute',
				left: x - size / 2 + Math.sin((frame + phase) / 30) * 30,
				top: y - size / 2 + Math.cos((frame + phase) / 34) * 30,
				width: size,
				height: size,
				borderRadius: '50%',
				background: `radial-gradient(circle, ${color} 0%, rgba(255,255,255,0) 65%)`,
			}}
		/>
	);
};

export const Pill: React.FC<{readonly children: React.ReactNode; readonly at: number; readonly x: number; readonly y: number; readonly color?: string}> = ({
	children,
	at,
	x,
	y,
	color = brand.green,
}) => {
	const frame = useCurrentFrame();
	const p = pop(frame, at, 14);
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				translate: '-50% -50%',
				scale: String(p),
				opacity: Math.min(1, p * 1.5),
				padding: '14px 30px',
				borderRadius: 999,
				backgroundColor: color,
				color: 'white',
				fontFamily,
				fontSize: 36,
				fontWeight: 700,
				whiteSpace: 'nowrap',
				boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
			}}
		>
			{children}
		</div>
	);
};


