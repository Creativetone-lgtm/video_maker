import type React from 'react';
import {brand, glass} from '../theme';
import {SCREEN} from '../ui';

/** iOS 26-style floating glass Safari address bar. `compact` (0–1) morphs it into the small pill shown while browsing. */
export const SafariBar: React.FC<{
	readonly top: number;
	readonly height: number;
	readonly focused: boolean;
	readonly loading: number;
	readonly compact: number;
	readonly text: React.ReactNode;
	readonly domain: string;
}> = ({top, height, focused, loading, compact, text, domain}) => {
	const fullW = SCREEN.width - 56;
	const width = fullW - compact * (fullW - 560);
	const h = height - compact * 22;
	return (
		<div
			style={{
				...glass,
				position: 'absolute',
				left: (SCREEN.width - width) / 2,
				top: top + compact * 22,
				width,
				height: h,
				borderRadius: h / 2,
				display: 'flex',
				alignItems: 'center',
				gap: 16,
				padding: '0 34px',
				overflow: 'hidden',
				zIndex: 35,
				border: focused ? `2.5px solid ${brand.orange}` : glass.border,
				fontSize: 36 - compact * 6,
				fontWeight: 500,
			}}
		>
			<svg width="22" height="26" viewBox="0 0 18 20" style={{flexShrink: 0}}>
				<rect x="2" y="9" width="14" height="10" rx="2.5" fill={brand.inkSoft} />
				<path d="M5 9V6a4 4 0 0 1 8 0v3" stroke={brand.inkSoft} strokeWidth="2.2" fill="none" />
			</svg>
			<div style={{flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textAlign: compact > 0.5 ? 'center' : 'left', color: brand.ink}}>
				{compact > 0.5 ? domain : text}
			</div>
			<svg width="30" height="30" viewBox="0 0 24 24" style={{flexShrink: 0, opacity: 0.7}}>
				<path d="M20 12a8 8 0 1 1-2.34-5.66" stroke={brand.inkSoft} strokeWidth="2.4" fill="none" strokeLinecap="round" />
				<path d="M20 4v5h-5" stroke={brand.inkSoft} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
			<div
				style={{
					position: 'absolute',
					left: 0,
					bottom: 0,
					height: 6,
					width: `${loading * 100}%`,
					background: brand.button,
					opacity: loading > 0 && loading < 1 ? 1 : 0,
				}}
			/>
		</div>
	);
};
