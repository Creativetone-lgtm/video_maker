import type React from 'react';
import {brand, fontFamily} from '../theme';
import {Caret} from '../ui';

// Layout of the site's booking form card, in screen px (matches the screenshot at FORM_SCROLL).
export const CARD = {left: 39, top: 130, width: 686, height: 1105};
export const INPUT = {left: 86 - CARD.left, width: 592, height: 98};
export const FIELD_TOPS = {name: 226, company: 407, email: 587, phone: 767, industry: 947} as const;
export const BUTTON = {left: 86, top: 1079, width: 318, height: 98};

export const fieldCenterY = (key: keyof typeof FIELD_TOPS) => FIELD_TOPS[key] + INPUT.height / 2;

const Label: React.FC<{readonly top: number; readonly children: React.ReactNode}> = ({top, children}) => (
	<div style={{position: 'absolute', left: INPUT.left, top: top - CARD.top - 50, fontSize: 32, fontWeight: 400, color: brand.ink}}>{children}</div>
);

export const Field: React.FC<{
	readonly label: string;
	readonly top: number;
	readonly value: string;
	readonly focused: boolean;
	readonly height?: number;
	readonly select?: boolean;
	readonly placeholder?: string;
}> = ({label, top, value, focused, height = INPUT.height, select = false, placeholder}) => (
	<>
		<Label top={top}>{label}</Label>
		<div
			style={{
				position: 'absolute',
				left: INPUT.left,
				top: top - CARD.top,
				width: INPUT.width,
				height,
				borderRadius: 22,
				background: 'linear-gradient(180deg, rgba(255,250,245,0.9) 0%, rgba(255,240,230,0.75) 100%)',
				border: focused ? `3px solid ${brand.orange}` : '2px solid rgba(255,255,255,0.95)',
				boxShadow: focused
					? '0 0 0 8px rgba(255,84,8,0.14), inset 0 2px 6px rgba(200,90,40,0.08)'
					: 'inset 0 2px 6px rgba(200,90,40,0.1), 0 2px 0 rgba(240,190,160,0.5)',
				display: 'flex',
				alignItems: 'center',
				padding: '0 30px',
				fontSize: value.startsWith('•') ? 40 : 32,
				letterSpacing: value.startsWith('•') ? 4 : 0,
				fontWeight: 500,
				color: brand.ink,
			}}
		>
			{value || (placeholder ? <span style={{color: brand.ink}}>{placeholder}</span> : null)}
			{focused && !select ? <Caret height={40} /> : null}
			{select ? (
				<svg width="28" height="28" viewBox="0 0 24 24" style={{marginLeft: 'auto'}}>
					<path d="M6 9l6 6 6-6" stroke={brand.ink} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			) : null}
		</div>
	</>
);

/** The glass card that holds the form. */
export const Card: React.FC<{readonly children: React.ReactNode; readonly style?: React.CSSProperties}> = ({children, style}) => (
	<div
		style={{
			position: 'absolute',
			left: CARD.left,
			top: CARD.top,
			width: CARD.width,
			height: CARD.height,
			borderRadius: 64,
			background: 'linear-gradient(160deg, #FFFBF6 0%, #FFF0E4 100%)',
			border: '2px solid rgba(255,255,255,0.9)',
			boxShadow: 'inset 0 2px 2px rgba(255,255,255,1), 0 30px 70px rgba(220,100,40,0.18)',
			fontFamily,
			...style,
		}}
	>
		{children}
	</div>
);
