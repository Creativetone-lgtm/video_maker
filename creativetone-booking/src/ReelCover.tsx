import type React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {ChatBubble} from './scenes/HookScene';
import {FloatingChips} from './scenes/FloatingChips';
import {brand, fontFamily, glass, glassDark} from './theme';
import {Background, Logo, Phone, SCREEN, StatusBar} from './ui';

type Props = {
	readonly oldWay: string;
	readonly line1: string;
	readonly line2: string;
	readonly callerName: string;
};

// Instagram shows Reels covers cropped to 4:5 in the profile grid (y ≈ 285–1635),
// so the logo, headline and caller name all sit inside that band.

export const ReelCover: React.FC<Props> = ({oldWay, line1, line2, callerName}) => {
	return (
		<AbsoluteFill style={{fontFamily}}>
			<Background />

			{/* Ringing waves behind the phone */}
			{[0, 1, 2].map((i) => (
				<div
					key={i}
					style={{
						position: 'absolute',
						left: 640 - (520 + i * 260) / 2,
						top: 1550 - (520 + i * 260) / 2,
						width: 520 + i * 260,
						height: 520 + i * 260,
						borderRadius: '50%',
						border: `4px solid rgba(255,84,8,${0.4 - i * 0.12})`,
					}}
				/>
			))}

			{/* Phone with the incoming call */}
			<AbsoluteFill style={{translate: '100px 640px', scale: '0.8', rotate: '-9deg'}}>
				<Phone>
					<AbsoluteFill style={{overflow: 'hidden'}}>
						<Img
							src={staticFile('site/page-00.jpg')}
							style={{position: 'absolute', left: -120, top: -100, width: SCREEN.width + 240, filter: 'blur(50px) saturate(1.4)', scale: '1.3'}}
						/>
						<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(255,84,8,0.55) 0%, rgba(30,23,20,0.55) 55%, rgba(30,23,20,0.85) 100%)'}} />
					</AbsoluteFill>
					<StatusBar color="white" />
					<div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', color: 'white'}}>
						<div style={{fontSize: 32, fontWeight: 500, opacity: 0.8}}>incoming call</div>
						<div style={{marginTop: 14, fontSize: 84, fontWeight: 700, letterSpacing: -2}}>{callerName}</div>
						<div style={{marginTop: 8, fontSize: 36, fontWeight: 500, opacity: 0.85}}>Strategy call…</div>
					</div>
					<div
						style={{
							...glassDark,
							position: 'absolute',
							left: SCREEN.width / 2 - 170,
							top: 530,
							width: 340,
							height: 340,
							borderRadius: 170,
							background: brand.button,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							boxShadow: '0 0 0 30px rgba(255,255,255,0.12), 0 0 0 70px rgba(255,255,255,0.06), 0 30px 80px rgba(255,84,8,0.55)',
						}}
					>
						<Logo width={250} color="white" />
					</div>
				</Phone>
			</AbsoluteFill>

			{/* "Accept" glass notification */}
			<div
				style={{
					...glass,
					position: 'absolute',
					left: 70,
					top: 1330,
					display: 'flex',
					alignItems: 'center',
					gap: 22,
					padding: '22px 36px 22px 22px',
					borderRadius: 999,
					rotate: '-4deg',
				}}
			>
				<div style={{width: 84, height: 84, borderRadius: 42, backgroundColor: brand.success, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<svg width="46" height="46" viewBox="0 0 24 24">
						<path
							fill="white"
							d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
						/>
					</svg>
				</div>
				<div>
					<div style={{fontSize: 38, fontWeight: 700, color: brand.ink}}>Request sent ✓</div>
					<div style={{fontSize: 28, fontWeight: 500, color: brand.inkSoft}}>We’ll call you</div>
				</div>
			</div>

			<FloatingChips
				chips={[
					{label: 'Strategy', x: 770, y: 1560, delay: -30},
					{label: 'Growth', x: 90, y: 1540, delay: -30, accent: true},
				]}
			/>

			{/* Logo + headline */}
			<div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center'}}>
				<Logo width={400} />
			</div>
			<div style={{position: 'absolute', left: -30, right: 0, top: 360}}>
				<ChatBubble text={oldWay} at={-30} top={110} strikeAt={-30} />
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 690, textAlign: 'center'}}>
				<div style={{fontSize: 168, fontWeight: 800, letterSpacing: -7, lineHeight: 0.95, color: brand.ink}}>{line1}</div>
				<div style={{marginTop: 10, fontSize: 112, fontWeight: 800, letterSpacing: -4, lineHeight: 1, color: brand.orange}}>{line2}</div>
			</div>
		</AbsoluteFill>
	);
};
