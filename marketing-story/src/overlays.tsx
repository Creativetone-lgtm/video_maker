import type React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {backOut, c, clamp, expoOut, fontFamily, pop, progress} from './theme';

const Panel: React.FC<{readonly label: string; readonly value: string; readonly width: number; readonly color?: string; readonly flash?: number}> = ({
	label,
	value,
	width,
	color = 'white',
	flash = 0,
}) => (
	<div
		style={{
			width,
			height: 104,
			borderRadius: 18,
			backgroundColor: c.hud,
			padding: '12px 22px',
			fontFamily,
			boxShadow: flash > 0 ? `0 0 0 ${flash * 8}px rgba(224,50,43,${0.6 * flash})` : undefined,
		}}
	>
		<div style={{fontSize: 22, letterSpacing: 4, color: 'rgba(255,255,255,0.7)', fontWeight: 500}}>{label}</div>
		<div style={{fontSize: 52, fontWeight: 800, color, lineHeight: 1.1}}>{value}</div>
	</div>
);

/** Sim-game HUD at the top: cash, customers, day. */
export const Hud: React.FC<{readonly cash: number; readonly customers: number; readonly day: number; readonly cashFlash?: number; readonly opacity?: number}> = ({
	cash,
	customers,
	day,
	cashFlash = 0,
	opacity = 1,
}) => (
	<div style={{position: 'absolute', left: 30, right: 30, top: 120, display: 'flex', gap: 14, opacity, zIndex: 50}}>
		<Panel label="CASH" value={`$${Math.round(cash).toLocaleString('en-US')}`} width={430} color={cash <= 0 ? '#FF6B5E' : 'white'} flash={cashFlash} />
		<Panel label="CUSTOMERS" value={String(customers)} width={300} />
		<Panel label="DAY" value={day > 0 ? String(day) : '—'} width={262} />
	</div>
);

/** Red "-$15,000 DECOR" style label that pops and floats up. */
export const MoneyPop: React.FC<{readonly at: number; readonly amount: string; readonly label: string; readonly x: number; readonly y: number}> = ({at, amount, label, x, y}) => {
	const frame = useCurrentFrame();
	if (frame < at || frame > at + 60) return null;
	const p = pop(frame, at, 12);
	const rise = progress(frame, at, at + 60);
	const fade = interpolate(frame, [at + 42, at + 60], [1, 0], clamp);
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y - rise * 120,
				translate: '-50% 0',
				scale: String(p),
				opacity: fade,
				textAlign: 'center',
				fontFamily,
				zIndex: 40,
			}}
		>
			<div
				style={{
					fontSize: 84,
					fontWeight: 900,
					color: '#FF4B3E',
					WebkitTextStroke: `4px ${c.line}`,
					paintOrder: 'stroke fill',
					lineHeight: 1,
				}}
			>
				{amount}
			</div>
			<div
				style={{
					marginTop: 8,
					display: 'inline-block',
					padding: '6px 18px',
					borderRadius: 12,
					backgroundColor: c.line,
					color: 'white',
					fontSize: 34,
					fontWeight: 800,
					letterSpacing: 3,
				}}
			>
				{label}
			</div>
		</div>
	);
};

/** Comic speech bubble with a tail pointing down-left or down-right. */
export const Bubble: React.FC<{
	readonly at: number;
	readonly until?: number;
	readonly x: number;
	readonly y: number;
	readonly children: React.ReactNode;
	readonly tail?: 'left' | 'right' | 'down';
	readonly size?: number;
	readonly shake?: number;
}> = ({at, until = 100000, x, y, children, tail = 'down', size = 52, shake = 0}) => {
	const frame = useCurrentFrame();
	if (frame < at || frame > until) return null;
	const p = interpolate(frame, [at, at + 12], [0, 1], {...clamp, easing: backOut});
	const out = interpolate(frame, [until - 8, until], [0, 1], clamp);
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				translate: '-50% -100%',
				scale: String(p * (1 - out)),
				transformOrigin: tail === 'left' ? '15% 100%' : tail === 'right' ? '85% 100%' : '50% 100%',
				rotate: `${Math.sin(frame * 1.3) * shake}deg`,
				zIndex: 45,
			}}
		>
			<div
				style={{
					position: 'relative',
					padding: '22px 34px',
					borderRadius: 40,
					backgroundColor: 'white',
					border: `6px solid ${c.line}`,
					fontFamily,
					fontWeight: 800,
					fontSize: size,
					color: c.line,
					whiteSpace: 'nowrap',
					direction: 'rtl',
				}}
			>
				{children}
				<svg
					width={60}
					height={50}
					viewBox="0 0 60 50"
					style={{
						position: 'absolute',
						bottom: -44,
						left: tail === 'left' ? 40 : tail === 'right' ? undefined : 'calc(50% - 30px)',
						right: tail === 'right' ? 40 : undefined,
					}}
				>
					<path d={tail === 'right' ? 'M 6 0 L 50 46 L 40 0' : 'M 54 0 L 10 46 L 20 0'} fill="white" stroke={c.line} strokeWidth={6} strokeLinejoin="round" />
					<rect x={0} y={0} width={60} height={6} fill="white" />
				</svg>
			</div>
		</div>
	);
};

/** Voiceover line shown as subtitles, words slide up one by one (right-to-left for Arabic). */
export const Caption: React.FC<{readonly text: string; readonly at: number; readonly until: number}> = ({text, at, until}) => {
	const frame = useCurrentFrame();
	if (frame < at || frame > until) return null;
	const out = interpolate(frame, [until - 8, until], [0, 1], clamp);
	const words = text.split(' ');
	return (
		<div
			style={{
				position: 'absolute',
				left: 70,
				right: 70,
				top: 1470,
				display: 'flex',
				flexWrap: 'wrap',
				justifyContent: 'center',
				columnGap: 18,
				rowGap: 6,
				direction: 'rtl',
				fontFamily,
				fontWeight: 800,
				fontSize: 62,
				lineHeight: 1.35,
				color: 'white',
				opacity: 1 - out,
				zIndex: 60,
			}}
		>
			{words.map((w, i) => {
				const p = progress(frame, at + i * 3, at + i * 3 + 12, expoOut);
				return (
					<span
						key={`${w}-${i}`}
						style={{
							display: 'inline-block',
							opacity: p,
							translate: `0px ${(1 - p) * 30}px`,
							textShadow: '0 4px 0 rgba(0,0,0,0.55), 0 0 18px rgba(0,0,0,0.45)',
						}}
					>
						{w}
					</span>
				);
			})}
		</div>
	);
};

/** Big red X stamped over something. */
export const RedX: React.FC<{readonly at: number; readonly until?: number; readonly x: number; readonly y: number; readonly size?: number}> = ({at, until = 100000, x, y, size = 320}) => {
	const frame = useCurrentFrame();
	if (frame < at || frame > until) return null;
	const p = interpolate(frame, [at, at + 8], [2.2, 1], {...clamp, easing: expoOut});
	return (
		<svg width={size} height={size} viewBox="0 0 100 100" style={{position: 'absolute', left: x - size / 2, top: y - size / 2, scale: String(p), opacity: Math.min(1, (frame - at) / 3), zIndex: 42}}>
			<path d="M 14 14 L 86 86 M 86 14 L 14 86" stroke={c.line} strokeWidth={22} strokeLinecap="round" />
			<path d="M 14 14 L 86 86 M 86 14 L 14 86" stroke={c.red} strokeWidth={14} strokeLinecap="round" />
		</svg>
	);
};

/** Fade to/from black between scenes. */
export const Dip: React.FC<{readonly at: number; readonly len?: number}> = ({at, len = 8}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [at - len, at, at + len], [0, 1, 0], clamp);
	if (o <= 0) return null;
	return <div style={{position: 'absolute', inset: 0, backgroundColor: 'black', opacity: o, zIndex: 90}} />;
};
