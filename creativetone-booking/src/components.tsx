import type React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, ease, fontFamily, theme} from './theme';

/** Dark animated backdrop with drifting colour blobs. */
export const Background: React.FC = () => {
	const frame = useCurrentFrame();
	const drift = Math.sin(frame / 60) * 60;
	return (
		<AbsoluteFill style={{backgroundColor: theme.bg, overflow: 'hidden'}}>
			<div
				style={{
					position: 'absolute',
					width: 1100,
					height: 1100,
					left: -300 + drift,
					top: -450,
					borderRadius: '50%',
					background: 'radial-gradient(circle, rgba(255,77,46,0.35) 0%, rgba(255,77,46,0) 65%)',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					width: 1200,
					height: 1200,
					right: -400 - drift,
					bottom: -600,
					borderRadius: '50%',
					background: 'radial-gradient(circle, rgba(123,92,255,0.38) 0%, rgba(123,92,255,0) 65%)',
				}}
			/>
			<AbsoluteFill
				style={{
					backgroundImage:
						'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
					backgroundSize: '80px 80px',
				}}
			/>
		</AbsoluteFill>
	);
};

export const Logo: React.FC<{readonly size?: number; readonly color?: string}> = ({
	size = 34,
	color = theme.ink,
}) => (
	<div style={{display: 'flex', alignItems: 'center', gap: size * 0.3, fontFamily}}>
		<div
			style={{
				width: size * 1.1,
				height: size * 1.1,
				borderRadius: size * 0.32,
				background: theme.gradient,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				color: 'white',
				fontWeight: 800,
				fontSize: size * 0.5,
				letterSpacing: -0.5,
			}}
		>
			CT
		</div>
		<span style={{fontSize: size, fontWeight: 800, color, letterSpacing: -1}}>
			creativetone<span style={{color: theme.accent}}>.</span>
		</span>
	</div>
);

export const BROWSER = {left: 160, top: 90, width: 1600, height: 900, toolbar: 76};

/** A desktop browser window. Children render in the page area. */
export const BrowserFrame: React.FC<{
	readonly url: React.ReactNode;
	readonly loading?: number;
	readonly addressFocused?: boolean;
	readonly children?: React.ReactNode;
}> = ({url, loading = 0, addressFocused = false, children}) => {
	return (
		<div
			style={{
				position: 'absolute',
				left: BROWSER.left,
				top: BROWSER.top,
				width: BROWSER.width,
				height: BROWSER.height,
				borderRadius: 22,
				overflow: 'hidden',
				backgroundColor: '#FFFFFF',
				boxShadow: '0 60px 140px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)',
				fontFamily,
			}}
		>
			<div
				style={{
					height: BROWSER.toolbar,
					backgroundColor: '#F3F3F7',
					borderBottom: `1px solid ${theme.line}`,
					display: 'flex',
					alignItems: 'center',
					padding: '0 28px',
					gap: 28,
					position: 'relative',
				}}
			>
				<div style={{display: 'flex', gap: 10}}>
					<div style={{width: 16, height: 16, borderRadius: 8, backgroundColor: '#FF5F57'}} />
					<div style={{width: 16, height: 16, borderRadius: 8, backgroundColor: '#FEBC2E'}} />
					<div style={{width: 16, height: 16, borderRadius: 8, backgroundColor: '#28C840'}} />
				</div>
				<div
					style={{
						flex: 1,
						height: 46,
						borderRadius: 23,
						backgroundColor: '#FFFFFF',
						border: addressFocused ? `2.5px solid ${theme.accent}` : `1.5px solid ${theme.line}`,
						boxShadow: addressFocused ? '0 0 0 6px rgba(255,77,46,0.15)' : 'none',
						display: 'flex',
						alignItems: 'center',
						padding: '0 22px',
						gap: 14,
						fontSize: 24,
						color: theme.ink,
						fontWeight: 500,
					}}
				>
					<svg width="18" height="20" viewBox="0 0 18 20">
						<rect x="2" y="9" width="14" height="10" rx="2" fill={theme.inkMuted} />
						<path d="M5 9V6a4 4 0 0 1 8 0v3" stroke={theme.inkMuted} strokeWidth="2.2" fill="none" />
					</svg>
					{url}
				</div>
				<div
					style={{
						position: 'absolute',
						left: 0,
						bottom: -1,
						height: 4,
						width: `${loading * 100}%`,
						background: theme.gradient,
						opacity: loading > 0 && loading < 1 ? 1 : 0,
					}}
				/>
			</div>
			<div
				style={{
					position: 'relative',
					height: BROWSER.height - BROWSER.toolbar,
					overflow: 'hidden',
				}}
			>
				{children}
			</div>
		</div>
	);
};

export const Caret: React.FC<{readonly color?: string; readonly height?: number}> = ({
	color = theme.accent,
	height = 30,
}) => {
	const frame = useCurrentFrame();
	return (
		<span
			style={{
				display: 'inline-block',
				width: 3,
				height,
				marginLeft: 2,
				backgroundColor: color,
				opacity: Math.floor(frame / 8) % 2 === 0 ? 1 : 0,
				verticalAlign: 'middle',
			}}
		/>
	);
};

type CursorPoint = {readonly f: number; readonly x: number; readonly y: number};

/** Animated mouse pointer that moves through keyframes and pulses on clicks. */
export const Cursor: React.FC<{
	readonly points: readonly CursorPoint[];
	readonly clicks?: readonly number[];
}> = ({points, clicks = []}) => {
	const frame = useCurrentFrame();
	const fs = points.map((p) => p.f);
	const x = interpolate(frame, fs, points.map((p) => p.x), {...clamp, easing: ease});
	const y = interpolate(frame, fs, points.map((p) => p.y), {...clamp, easing: ease});
	const press = clicks.reduce(
		(acc, c) => Math.min(acc, interpolate(frame, [c - 3, c, c + 5], [1, 0.78, 1], clamp)),
		1,
	);
	const lastClick = [...clicks].reverse().find((c) => frame >= c);
	const ripple = lastClick === undefined ? 1 : interpolate(frame, [lastClick, lastClick + 18], [0, 1], clamp);

	return (
		<div style={{position: 'absolute', left: x, top: y, pointerEvents: 'none', zIndex: 50}}>
			<div
				style={{
					position: 'absolute',
					left: -50,
					top: -50,
					width: 100,
					height: 100,
					borderRadius: 50,
					border: `4px solid ${theme.accent}`,
					scale: String(0.2 + ripple),
					opacity: 1 - ripple,
				}}
			/>
			<svg
				width="44"
				height="52"
				viewBox="0 0 22 26"
				style={{scale: String(press), transformOrigin: '0 0', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.35))'}}
			>
				<path
					d="M1 1 L1 20 L6 15.5 L9.5 23.5 L13 22 L9.6 14.2 L16 14 Z"
					fill="#0B0B16"
					stroke="white"
					strokeWidth="1.6"
					strokeLinejoin="round"
				/>
			</svg>
		</div>
	);
};

/** Pill caption that labels the current step of the journey. */
export const StepPill: React.FC<{readonly step: string; readonly label: string; readonly delay?: number}> = ({
	step,
	label,
	delay = 0,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p = interpolate(frame, [delay, delay + 0.6 * fps], [0, 1], {...clamp, easing: ease});
	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				bottom: 36,
				display: 'flex',
				justifyContent: 'center',
				zIndex: 60,
				opacity: p,
				translate: `0px ${(1 - p) * 40}px`,
			}}
		>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 18,
					padding: '16px 30px 16px 16px',
					borderRadius: 999,
					backgroundColor: 'rgba(12,12,24,0.92)',
					border: '1px solid rgba(255,255,255,0.14)',
					boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
					fontFamily,
				}}
			>
				<div
					style={{
						background: theme.gradient,
						color: 'white',
						fontWeight: 800,
						fontSize: 24,
						padding: '8px 18px',
						borderRadius: 999,
						letterSpacing: 1,
					}}
				>
					{step}
				</div>
				<div style={{color: 'white', fontSize: 36, fontWeight: 700, letterSpacing: -0.5}}>{label}</div>
			</div>
		</div>
	);
};
