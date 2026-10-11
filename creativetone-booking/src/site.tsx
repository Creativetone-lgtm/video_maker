import type React from 'react';
import {Logo} from './components';
import {fontFamily, theme} from './theme';

/** Top navigation of the mocked creativetoneagency.com page. */
export const SiteNav: React.FC<{readonly ctaLabel: string; readonly highlight?: number}> = ({
	ctaLabel,
	highlight = 0,
}) => (
	<div
		style={{
			position: 'absolute',
			left: 0,
			right: 0,
			top: 0,
			height: 100,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			padding: '0 70px',
			borderBottom: `1px solid ${theme.line}`,
			fontFamily,
			backgroundColor: 'white',
		}}
	>
		<Logo size={32} />
		<div style={{display: 'flex', gap: 48, fontSize: 24, fontWeight: 600, color: theme.inkMuted}}>
			<span>Work</span>
			<span>Services</span>
			<span>Industries</span>
			<span>About</span>
		</div>
		<div
			style={{
				padding: '14px 28px',
				borderRadius: 999,
				background: theme.ink,
				color: 'white',
				fontSize: 22,
				fontWeight: 700,
				boxShadow: highlight ? `0 0 0 ${8 * highlight}px rgba(255,77,46,0.25)` : 'none',
			}}
		>
			{ctaLabel}
		</div>
	</div>
);
