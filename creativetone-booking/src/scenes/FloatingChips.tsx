import type React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {backOut, brand, clamp, fontFamily, glass} from '../theme';

type Chip = {readonly label: string; readonly x: number; readonly y: number; readonly delay: number; readonly accent?: boolean};

/** Glass service chips (from the site) that float around the frame. */
export const FloatingChips: React.FC<{readonly chips: readonly Chip[]}> = ({chips}) => {
	const frame = useCurrentFrame();
	return (
		<>
			{chips.map((c, i) => {
				const p = interpolate(frame, [c.delay, c.delay + 16], [0, 1], {...clamp, easing: backOut});
				return (
					<div
						key={c.label}
						style={{
							...glass,
							position: 'absolute',
							left: c.x,
							top: c.y + Math.sin((frame + i * 23) / 22) * 14,
							padding: '18px 34px',
							borderRadius: 999,
							fontFamily,
							fontSize: 36,
							fontWeight: 600,
							color: c.accent ? 'white' : brand.ink,
							background: c.accent ? brand.button : glass.background,
							opacity: Math.min(1, p),
							scale: String(p),
							rotate: `${Math.sin((frame + i * 40) / 40) * 3}deg`,
						}}
					>
						{c.label}
					</div>
				);
			})}
		</>
	);
};
