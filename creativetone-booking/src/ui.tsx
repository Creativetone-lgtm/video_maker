import type React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {backOut, brand, clamp, fontFamily, glass, progress} from './theme';

// ---------------------------------------------------------------------------
// Geometry
// ---------------------------------------------------------------------------

/** The phone is drawn at a logical 800×1730 and scaled by PHONE_K onto the frame. */
export const PHONE_K = 0.9;
const LOGICAL = {width: 800, height: 1730, inset: 16, radius: 118};
export const PHONE = {
	width: LOGICAL.width * PHONE_K,
	height: LOGICAL.height * PHONE_K,
	left: 540 - (LOGICAL.width * PHONE_K) / 2,
	top: 262,
	inset: LOGICAL.inset * PHONE_K,
	radius: LOGICAL.radius * PHONE_K,
};
/** Screen space: all phone content is laid out in these logical px. */
export const SCREEN = {
	width: LOGICAL.width - LOGICAL.inset * 2,
	height: LOGICAL.height - LOGICAL.inset * 2,
	top: PHONE.top + PHONE.inset,
};
/** The full-page screenshot is 1170px wide (3x). */
export const SITE_SCALE = SCREEN.width / 1170;
export const STATUS_BAR = 60;

/** Translate (in px) that brings a screen-space y onto `targetY` of the frame at the given camera scale. */
export const focusY = (screenY: number, scale: number, targetY = 960) =>
	targetY - 960 - (SCREEN.top + screenY * PHONE_K - 960) * scale;

// ---------------------------------------------------------------------------
// Background
// ---------------------------------------------------------------------------

const Orbit: React.FC<{readonly size: number; readonly speed: number; readonly phase: number}> = ({size, speed, phase}) => {
	const frame = useCurrentFrame();
	return (
		<div
			style={{
				position: 'absolute',
				left: 540 - size / 2,
				top: 960 - size / 2,
				width: size,
				height: size,
				borderRadius: '50%',
				border: '2px solid rgba(255,84,8,0.16)',
				rotate: `${phase + frame * speed}deg`,
			}}
		>
			<div
				style={{
					position: 'absolute',
					left: size / 2 - 9,
					top: -9,
					width: 18,
					height: 18,
					borderRadius: 9,
					backgroundColor: brand.orange,
					boxShadow: '0 0 20px rgba(255,84,8,0.6)',
				}}
			/>
		</div>
	);
};

/** Warm peach backdrop with drifting glows and the site's orbit motif. */
export const Background: React.FC = () => {
	const frame = useCurrentFrame();
	const drift = Math.sin(frame / 50) * 70;
	return (
		<AbsoluteFill style={{background: `linear-gradient(180deg, ${brand.cream} 0%, ${brand.peach} 55%, #FDD3B8 100%)`, overflow: 'hidden'}}>
			<div
				style={{
					position: 'absolute',
					width: 1300,
					height: 1300,
					left: -520 + drift,
					top: -380,
					borderRadius: '50%',
					background: 'radial-gradient(circle, rgba(255,110,40,0.55) 0%, rgba(255,110,40,0) 62%)',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					width: 1400,
					height: 1400,
					right: -640 - drift,
					bottom: -420,
					borderRadius: '50%',
					background: 'radial-gradient(circle, rgba(255,84,8,0.45) 0%, rgba(255,84,8,0) 62%)',
				}}
			/>
			<Orbit size={1500} speed={0.18} phase={20} />
			<Orbit size={1050} speed={-0.25} phase={140} />
			<Orbit size={640} speed={0.35} phase={260} />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------------------
// Brand
// ---------------------------------------------------------------------------

export const Logo: React.FC<{readonly width: number; readonly color?: 'orange' | 'white' | 'ink'; readonly style?: React.CSSProperties}> = ({
	width,
	color = 'orange',
	style,
}) => <Img src={staticFile(`logo-${color}.png`)} style={{width, height: (width * 408) / 1332, ...style}} />;

// ---------------------------------------------------------------------------
// Phone
// ---------------------------------------------------------------------------

export const StatusBar: React.FC<{readonly color?: string}> = ({color = brand.ink}) => (
	<div
		style={{
			position: 'absolute',
			left: 0,
			right: 0,
			top: 0,
			height: STATUS_BAR,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			padding: '14px 58px 0 66px',
			fontFamily,
			fontSize: 30,
			fontWeight: 600,
			color,
			zIndex: 40,
		}}
	>
		<span>9:41</span>
		<div style={{display: 'flex', gap: 10, alignItems: 'center'}}>
			<svg width="34" height="22" viewBox="0 0 17 11">
				<rect x="0" y="7" width="3" height="4" rx="1" fill={color} />
				<rect x="4.5" y="5" width="3" height="6" rx="1" fill={color} />
				<rect x="9" y="2.5" width="3" height="8.5" rx="1" fill={color} />
				<rect x="13.5" y="0" width="3" height="11" rx="1" fill={color} />
			</svg>
			<svg width="30" height="22" viewBox="0 0 15 11">
				<path d="M7.5 10.5 L5 7.6 A3.6 3.6 0 0 1 10 7.6 Z" fill={color} />
				<path d="M2.6 5.2 A7 7 0 0 1 12.4 5.2" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" />
				<path d="M0.6 2.8 A10 10 0 0 1 14.4 2.8" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" />
			</svg>
			<svg width="48" height="22" viewBox="0 0 24 11">
				<rect x="0.5" y="0.5" width="20" height="10" rx="3" stroke={color} strokeOpacity="0.45" fill="none" />
				<rect x="2" y="2" width="17" height="7" rx="1.8" fill={color} />
				<rect x="21.5" y="3.5" width="1.6" height="4" rx="0.8" fill={color} fillOpacity="0.45" />
			</svg>
		</div>
	</div>
);

/** iPhone body. Children render in screen space (SCREEN.width × SCREEN.height). */
export const Phone: React.FC<{readonly children?: React.ReactNode; readonly style?: React.CSSProperties}> = ({children, style}) => (
	<div
		style={{
			position: 'absolute',
			left: PHONE.left,
			top: PHONE.top,
			width: PHONE.width,
			height: PHONE.height,
			borderRadius: PHONE.radius,
			background: 'linear-gradient(145deg, #3A3330 0%, #141110 40%, #2A2420 100%)',
			padding: PHONE.inset,
			boxShadow:
				'0 80px 160px rgba(140,50,10,0.35), 0 30px 60px rgba(0,0,0,0.25), inset 0 0 0 3px rgba(255,255,255,0.12)',
			...style,
		}}
	>
		<div
			style={{
				width: SCREEN.width * PHONE_K,
				height: SCREEN.height * PHONE_K,
				borderRadius: PHONE.radius - PHONE.inset,
				overflow: 'hidden',
				position: 'relative',
			}}
		>
			<div
				style={{
					position: 'absolute',
					left: 0,
					top: 0,
					width: SCREEN.width,
					height: SCREEN.height,
					transformOrigin: '0 0',
					scale: String(PHONE_K),
					backgroundColor: brand.cream,
					fontFamily,
				}}
			>
				{children}
				{/* Dynamic Island */}
				<div
					style={{
						position: 'absolute',
						left: SCREEN.width / 2 - 96,
						top: 16,
						width: 192,
						height: 56,
						borderRadius: 28,
						backgroundColor: 'black',
						zIndex: 45,
					}}
				/>
				{/* Home indicator */}
				<div
					style={{
						position: 'absolute',
						left: SCREEN.width / 2 - 120,
						bottom: 14,
						width: 240,
						height: 9,
						borderRadius: 5,
						backgroundColor: 'rgba(26,23,20,0.75)',
						zIndex: 45,
					}}
				/>
			</div>
		</div>
	</div>
);

// ---------------------------------------------------------------------------
// The real website, from the full-page screenshot
// ---------------------------------------------------------------------------

const PAGE_HEIGHT = 37107;
const CHUNK = 3000;
const CHUNKS = Math.ceil(PAGE_HEIGHT / CHUNK);

/** Formats the src for a page chunk. */
const chunkSrc = (i: number) => staticFile(`site/page-${String(i).padStart(2, '0')}.jpg`);

const PageLayer: React.FC<{readonly scrollY: number; readonly opacity?: number}> = ({scrollY, opacity = 1}) => {
	const viewH = (SCREEN.height - STATUS_BAR) / SITE_SCALE;
	const chunks: number[] = [];
	for (let i = 0; i < CHUNKS; i++) {
		const top = i * CHUNK;
		if (top + CHUNK > scrollY - 200 && top < scrollY + viewH + 200) chunks.push(i);
	}
	return (
		<div style={{position: 'absolute', inset: 0, opacity}}>
			{chunks.map((i) => (
				<Img
					key={i}
					src={chunkSrc(i)}
					style={{
						position: 'absolute',
						left: 0,
						top: STATUS_BAR + (i * CHUNK - scrollY) * SITE_SCALE,
						width: SCREEN.width,
					}}
				/>
			))}
		</div>
	);
};

/**
 * The scrollable creativetoneagency.com page. `scrollY` is in screenshot pixels.
 * `velocity` (screenshot px / frame) adds a motion trail while scrolling fast.
 */
export const SitePage: React.FC<{readonly scrollY: number; readonly velocity?: number}> = ({scrollY, velocity = 0}) => {
	const ghosts = Math.abs(velocity) > 40 ? [0.25, 0.5, 0.75] : [];
	return (
		<AbsoluteFill style={{backgroundColor: brand.peach}}>
			<PageLayer scrollY={scrollY} />
			{ghosts.map((k) => (
				<PageLayer key={k} scrollY={scrollY - velocity * k} opacity={0.2} />
			))}
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------------------
// Interaction helpers
// ---------------------------------------------------------------------------

/** Finger tap indicator in screen space. */
export const Tap: React.FC<{readonly x: number; readonly y: number; readonly at: number}> = ({x, y, at}) => {
	const frame = useCurrentFrame();
	const appear = progress(frame, at - 8, at - 2);
	const ring = progress(frame, at, at + 16);
	const fade = interpolate(frame, [at + 6, at + 16], [1, 0], clamp);
	const press = interpolate(frame, [at - 2, at, at + 5], [1, 0.82, 1], clamp);
	if (frame < at - 10 || frame > at + 18) return null;
	return (
		<div style={{position: 'absolute', left: x, top: y, zIndex: 60, pointerEvents: 'none'}}>
			<div
				style={{
					position: 'absolute',
					left: -70,
					top: -70,
					width: 140,
					height: 140,
					borderRadius: 70,
					border: '4px solid rgba(255,255,255,0.95)',
					boxShadow: '0 0 30px rgba(255,84,8,0.5)',
					scale: String(0.4 + ring * 0.9),
					opacity: (1 - ring) * appear,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: -42,
					top: -42,
					width: 84,
					height: 84,
					borderRadius: 42,
					background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.55) 70%)',
					border: '2px solid rgba(255,255,255,0.9)',
					boxShadow: '0 10px 30px rgba(120,40,10,0.35)',
					scale: String(appear * press),
					opacity: appear * fade,
				}}
			/>
		</div>
	);
};

/** Big glass caption at the top of the reel. */
export const Caption: React.FC<{readonly step?: string; readonly children: React.ReactNode; readonly at?: number; readonly until?: number}> = ({
	step,
	children,
	at = 0,
	until = Infinity,
}) => {
	const frame = useCurrentFrame();
	const inP = interpolate(frame, [at, at + 14], [0, 1], {...clamp, easing: backOut});
	const outP = Number.isFinite(until) ? progress(frame, until - 10, until) : 0;
	if (frame < at || frame > until) return null;
	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				top: 96,
				display: 'flex',
				justifyContent: 'center',
				zIndex: 80,
				opacity: Math.min(1, inP * 1.4) * (1 - outP),
				scale: String(0.7 + inP * 0.3 - outP * 0.1),
				translate: `0px ${(1 - inP) * -30 - outP * 30}px`,
				filter: `blur(${(1 - Math.min(1, inP)) * 10 + outP * 10}px)`,
			}}
		>
			<div
				style={{
					...glass,
					background: 'linear-gradient(140deg, rgba(255,255,255,0.88) 0%, rgba(255,246,238,0.72) 100%)',
					display: 'flex',
					alignItems: 'center',
					gap: 20,
					padding: step ? '18px 40px 18px 18px' : '22px 44px',
					borderRadius: 999,
					fontFamily,
					fontSize: 50,
					fontWeight: 700,
					letterSpacing: -1,
					color: brand.ink,
					whiteSpace: 'nowrap',
				}}
			>
				{step ? (
					<div
						style={{
							width: 72,
							height: 72,
							borderRadius: 36,
							background: brand.button,
							color: 'white',
							fontSize: 34,
							fontWeight: 800,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							boxShadow: '0 8px 20px rgba(255,84,8,0.4)',
						}}
					>
						{step}
					</div>
				) : null}
				{children}
			</div>
		</div>
	);
};

export const Caret: React.FC<{readonly height?: number; readonly color?: string}> = ({height = 34, color = brand.orange}) => {
	const frame = useCurrentFrame();
	return (
		<span
			style={{
				display: 'inline-block',
				width: 3.5,
				height,
				marginLeft: 3,
				borderRadius: 2,
				backgroundColor: color,
				verticalAlign: 'middle',
				opacity: Math.floor(frame / 8) % 2 === 0 ? 1 : 0,
			}}
		/>
	);
};

// ---------------------------------------------------------------------------
// iOS keyboard
// ---------------------------------------------------------------------------

export const KEYBOARD_HEIGHT = 560;
const ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
const KEY_W = 66;
const KEY_H = 92;
const KEY_GAP = 9.5;

const Key: React.FC<{
	readonly left: number;
	readonly top: number;
	readonly width?: number;
	readonly label: string;
	readonly pressed?: boolean;
	readonly dark?: boolean;
	readonly accent?: boolean;
	readonly fontSize?: number;
}> = ({left, top, width = KEY_W, label, pressed = false, dark = false, accent = false, fontSize = 40}) => (
	<div
		style={{
			position: 'absolute',
			left,
			top,
			width,
			height: KEY_H,
			borderRadius: 14,
			background: accent ? brand.button : dark ? 'rgba(255,255,255,0.32)' : pressed ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.88)',
			boxShadow: '0 2px 0 rgba(120,60,30,0.22)',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			fontSize,
			fontWeight: accent ? 600 : 400,
			color: accent ? 'white' : brand.ink,
		}}
	>
		{label}
		{pressed && label.length === 1 ? (
			<div
				style={{
					position: 'absolute',
					left: -14,
					bottom: KEY_H - 6,
					width: width + 28,
					height: 128,
					borderRadius: 20,
					backgroundColor: 'white',
					boxShadow: '0 10px 24px rgba(120,60,30,0.3)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontSize: 64,
					color: brand.ink,
				}}
			>
				{label}
			</div>
		) : null}
	</div>
);

/** Glass iOS keyboard (URL / text layout). `shown` slides it in from the bottom of the screen. */
export const Keyboard: React.FC<{readonly shown: number; readonly pressed?: string | null; readonly returnLabel?: string}> = ({
	shown,
	pressed = null,
	returnLabel = 'go',
}) => {
	const rowLeft = (count: number) => (SCREEN.width - (count * KEY_W + (count - 1) * KEY_GAP)) / 2;
	const p = pressed?.toLowerCase() ?? null;
	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				top: SCREEN.height - KEYBOARD_HEIGHT * shown,
				height: KEYBOARD_HEIGHT,
				background: 'linear-gradient(180deg, rgba(255,240,228,0.55) 0%, rgba(253,215,190,0.6) 100%)',
				backdropFilter: 'blur(30px) saturate(180%)',
				borderTop: '1.5px solid rgba(255,255,255,0.8)',
				zIndex: 30,
			}}
		>
			{ROWS.map((row, r) =>
				row.split('').map((ch, k) => (
					<Key
						key={ch}
						left={rowLeft(row.length) + k * (KEY_W + KEY_GAP)}
						top={22 + r * (KEY_H + 22)}
						label={ch}
						pressed={p === ch}
					/>
				)),
			)}
			<Key left={10} top={22 + 2 * (KEY_H + 22)} width={92} label="⇧" dark fontSize={36} />
			<Key left={SCREEN.width - 102} top={22 + 2 * (KEY_H + 22)} width={92} label="⌫" dark fontSize={34} />
			<Key left={10} top={22 + 3 * (KEY_H + 22)} width={150} label="123" dark fontSize={32} />
			<Key left={170} top={22 + 3 * (KEY_H + 22)} width={260} label="space" fontSize={30} pressed={p === ' '} />
			<Key left={440} top={22 + 3 * (KEY_H + 22)} width={KEY_W + 20} label="." pressed={p === '.'} />
			<Key left={SCREEN.width - 10 - 200} top={22 + 3 * (KEY_H + 22)} width={200} label={returnLabel} accent fontSize={32} />
		</div>
	);
};

/** Character being pressed at `frame` while typing `text` from `start` (2 frames per char). */
export const pressedKey = (text: string, frame: number, start: number) => {
	const i = Math.floor((frame - start) / 2);
	if (i < 0 || i >= text.length) return null;
	return text[i];
};


/** Scroll position (screenshot px) where the booking form card sits just under the status bar. */
export const FORM_SCROLL = 30985;

/** Screen-space y of a screenshot y when scrolled to `scrollY`. */
export const siteToScreenY = (siteY: number, scrollY: number) => STATUS_BAR + (siteY - scrollY) * SITE_SCALE;
