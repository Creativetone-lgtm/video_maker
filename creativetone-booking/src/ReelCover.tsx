import type React from 'react';
import {AbsoluteFill} from 'remotion';
import {SafariBar} from './scenes/SafariBar';
import {brand, DOMAIN, fontFamily, glassDark} from './theme';
import {Background, Logo, Phone, SCREEN, SitePage, StatusBar} from './ui';

type Props = {
	readonly variant: 'phone' | 'orange' | 'dark';
	readonly line1: string;
	readonly line2: string;
};

// Instagram shows Reels covers cropped to 4:5 in the profile grid (y ≈ 285–1635),
// so all key content stays inside that band.

const PhoneIcon: React.FC<{readonly size?: number; readonly rotate?: number}> = ({size = 56, rotate = 0}) => (
	<svg width={size} height={size} viewBox="0 0 24 24" style={{rotate: `${rotate}deg`}}>
		<path
			fill="white"
			d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
		/>
	</svg>
);

/** A: the real homepage on an iPhone, headline above. */
const PhoneCover: React.FC<Omit<Props, 'variant'>> = ({line1, line2}) => (
	<AbsoluteFill style={{fontFamily}}>
		<Background />
		<div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center'}}>
			<div style={{fontSize: 128, fontWeight: 800, letterSpacing: -5, lineHeight: 1, color: brand.ink}}>{line1}</div>
			<div style={{marginTop: 8, fontSize: 128, fontWeight: 800, letterSpacing: -5, lineHeight: 1, color: brand.orange}}>{line2}</div>
		</div>
		<AbsoluteFill style={{translate: '0px 300px', scale: '0.6'}}>
			<Phone>
				<SitePage scrollY={0} />
				<StatusBar />
				<SafariBar top={SCREEN.height - 64 - 104} height={104} focused={false} loading={0} compact={1} text={DOMAIN} domain={DOMAIN} />
			</Phone>
		</AbsoluteFill>
	</AbsoluteFill>
);

/** B: bold brand orange, white type. */
const OrangeCover: React.FC<Omit<Props, 'variant'>> = ({line1, line2}) => (
	<AbsoluteFill style={{fontFamily, background: 'linear-gradient(160deg, #FF7A2E 0%, #FF5408 45%, #EE3A23 100%)', alignItems: 'center', justifyContent: 'center'}}>
		<div style={{position: 'absolute', width: 1300, height: 1300, left: -420, top: -480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 60%)'}} />
		<div style={{position: 'absolute', width: 1100, height: 1100, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.18)'}} />
		<div style={{position: 'absolute', width: 1600, height: 1600, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.12)'}} />
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
			<div
				style={{
					position: 'relative',
					padding: '26px 48px',
					borderRadius: 999,
					backgroundColor: 'rgba(255,255,255,0.18)',
					border: '2px solid rgba(255,255,255,0.45)',
					color: 'rgba(255,255,255,0.85)',
					fontSize: 50,
					fontWeight: 600,
				}}
			>
				Hi, can you help me?
				<div style={{position: 'absolute', left: 36, right: 36, top: '50%', height: 6, borderRadius: 3, backgroundColor: 'white'}} />
			</div>
			<div style={{marginTop: 90, fontSize: 200, fontWeight: 800, letterSpacing: -8, lineHeight: 0.95, color: 'white'}}>{line1}</div>
			<div style={{marginTop: 16, fontSize: 116, fontWeight: 700, letterSpacing: -4, lineHeight: 1, color: '#FFE3D2'}}>{line2}</div>
			<div style={{marginTop: 120}}>
				<Logo width={380} color="white" />
			</div>
		</div>
	</AbsoluteFill>
);

/** C: dark premium with a glass incoming-call card. */
const DarkCover: React.FC<Omit<Props, 'variant'>> = ({line1, line2}) => (
	<AbsoluteFill style={{fontFamily, backgroundColor: brand.dark, alignItems: 'center'}}>
		<div style={{position: 'absolute', width: 1400, height: 1400, left: -160, top: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,84,8,0.55) 0%, rgba(255,84,8,0) 62%)'}} />
		<div style={{position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center'}}>
			<div style={{fontSize: 170, fontWeight: 800, letterSpacing: -7, lineHeight: 0.95, color: 'white'}}>{line1}</div>
			<div style={{marginTop: 14, fontSize: 112, fontWeight: 800, letterSpacing: -4, lineHeight: 1, color: brand.orange}}>{line2}</div>
		</div>
		<div
			style={{
				...glassDark,
				position: 'absolute',
				top: 820,
				width: 760,
				height: 700,
				borderRadius: 72,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				color: 'white',
			}}
		>
			<div style={{marginTop: 64, fontSize: 30, fontWeight: 500, opacity: 0.7}}>incoming call</div>
			<div
				style={{
					marginTop: 34,
					width: 230,
					height: 230,
					borderRadius: 115,
					background: brand.button,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					boxShadow: '0 0 0 26px rgba(255,84,8,0.16), 0 0 0 58px rgba(255,84,8,0.08), 0 20px 60px rgba(255,84,8,0.5)',
				}}
			>
				<Logo width={175} color="white" />
			</div>
			<div style={{marginTop: 60, fontSize: 64, fontWeight: 700, letterSpacing: -1.5}}>CreativeTone</div>
			<div style={{marginTop: 6, fontSize: 32, fontWeight: 500, opacity: 0.7}}>Strategy call…</div>
			<div style={{marginTop: 50, display: 'flex', gap: 220}}>
				<div style={{width: 110, height: 110, borderRadius: 55, backgroundColor: brand.danger, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<PhoneIcon rotate={135} />
				</div>
				<div style={{width: 110, height: 110, borderRadius: 55, backgroundColor: brand.success, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 14px rgba(52,199,89,0.22)'}}>
					<PhoneIcon />
				</div>
			</div>
		</div>
	</AbsoluteFill>
);

export const ReelCover: React.FC<Props> = ({variant, ...rest}) =>
	variant === 'phone' ? <PhoneCover {...rest} /> : variant === 'orange' ? <OrangeCover {...rest} /> : <DarkCover {...rest} />;

