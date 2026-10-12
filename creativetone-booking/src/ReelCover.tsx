import type React from 'react';
import {AbsoluteFill} from 'remotion';
import {brand, fontFamily, glass} from './theme';
import {Background, Logo} from './ui';

type Props = {
	readonly line1: string;
	readonly line2: string;
};

// Instagram shows Reels covers cropped to 4:5 in the profile grid (y ≈ 285–1635),
// so everything sits centred inside that band.

const PhoneIcon: React.FC = () => (
	<svg width="92" height="92" viewBox="0 0 24 24">
		<path
			fill="white"
			d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
		/>
	</svg>
);

export const ReelCover: React.FC<Props> = ({line1, line2}) => {
	return (
		<AbsoluteFill style={{fontFamily, alignItems: 'center', justifyContent: 'center'}}>
			<Background />
			<div style={{position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				{/* Ringing call icon */}
				<div
					style={{
						...glass,
						width: 250,
						height: 250,
						borderRadius: 125,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						boxShadow: `${glass.boxShadow}, 0 0 0 36px rgba(255,255,255,0.22), 0 0 0 80px rgba(255,255,255,0.12)`,
					}}
				>
					<div
						style={{
							width: 170,
							height: 170,
							borderRadius: 85,
							background: brand.button,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							boxShadow: '0 20px 50px rgba(255,84,8,0.45), inset 0 3px 3px rgba(255,255,255,0.45)',
						}}
					>
						<PhoneIcon />
					</div>
				</div>

				<div style={{marginTop: 130, fontSize: 200, fontWeight: 800, letterSpacing: -8, lineHeight: 0.95, color: brand.ink}}>{line1}</div>
				<div style={{marginTop: 18, fontSize: 124, fontWeight: 800, letterSpacing: -5, lineHeight: 1, color: brand.orange}}>{line2}</div>

				<div style={{marginTop: 120}}>
					<Logo width={380} />
				</div>
			</div>
		</AbsoluteFill>
	);
};
