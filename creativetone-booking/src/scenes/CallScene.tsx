import {Audio} from '@remotion/media';
import type React from 'react';
import {AbsoluteFill, Img, Interactive, interpolate, staticFile, useCurrentFrame, useVideoConfig, type InteractivitySchema} from 'remotion';
import {backOut, brand, clamp, fontFamily, glassDark, inOut, progress} from '../theme';
import {Background, Caption, Logo, Phone, PHONE, SCREEN, StatusBar, Tap} from '../ui';

type Props = {
	readonly callerName: string;
	readonly subtitle: string;
	readonly caption: string;
	readonly style?: React.CSSProperties;
};

const ANSWER = 108;

const PhoneIcon: React.FC<{readonly size?: number; readonly rotate?: number}> = ({size = 64, rotate = 0}) => (
	<svg width={size} height={size} viewBox="0 0 24 24" style={{rotate: `${rotate}deg`}}>
		<path
			fill="white"
			d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
		/>
	</svg>
);

const Ripple: React.FC<{readonly offset: number; readonly size: number; readonly color: string}> = ({offset, size, color}) => {
	const frame = useCurrentFrame();
	const p = ((frame + offset) % 40) / 40;
	return (
		<div
			style={{
				position: 'absolute',
				left: -size / 2,
				top: -size / 2,
				width: size,
				height: size,
				borderRadius: '50%',
				border: `4px solid ${color}`,
				scale: String(1 + p * 0.9),
				opacity: frame < ANSWER ? (1 - p) * 0.8 : 0,
			}}
		/>
	);
};

const GRID = ['mute', 'keypad', 'speaker', 'add', 'FaceTime', 'contacts'];

const CallSceneInner: React.FC<Props> = ({callerName, subtitle, caption, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const ringing = frame < ANSWER;
	const shake = ringing && Math.floor(frame / 30) % 2 === 0 ? Math.sin(frame * 2.1) * 1.6 : 0;
	const enter = progress(frame, 0, 18);
	const answered = progress(frame, ANSWER, ANSWER + 14, inOut);
	const seconds = Math.max(0, Math.floor((frame - ANSWER) / fps) + 1);
	const dots = '.'.repeat((Math.floor(frame / 8) % 3) + 1);
	const centerY = PHONE.top + PHONE.height / 2;

	return (
		<AbsoluteFill style={{fontFamily, ...style}}>
			<Background />
			{/* Ringing waves around the phone */}
			<div style={{position: 'absolute', left: 540, top: centerY}}>
				<Ripple offset={0} size={1500} color="rgba(255,84,8,0.35)" />
				<Ripple offset={13} size={1500} color="rgba(255,84,8,0.3)" />
				<Ripple offset={26} size={1500} color="rgba(255,84,8,0.25)" />
			</div>
			<AbsoluteFill style={{scale: String(0.94 + enter * 0.04 + answered * 0.02)}}>
				<Phone style={{rotate: `${shake}deg`}}>
					{/* Poster wallpaper: the site, blurred in brand colour */}
					<AbsoluteFill style={{overflow: 'hidden'}}>
						<Img
							src={staticFile('site/page-00.jpg')}
							style={{position: 'absolute', left: -120, top: -100, width: SCREEN.width + 240, filter: 'blur(50px) saturate(1.4)', scale: '1.3'}}
						/>
						<AbsoluteFill
							style={{
								background: `linear-gradient(180deg, rgba(255,84,8,0.55) 0%, rgba(30,23,20,0.55) 55%, rgba(30,23,20,0.85) 100%)`,
							}}
						/>
						<AbsoluteFill style={{backgroundColor: `rgba(16,60,32,${answered * 0.35})`}} />
					</AbsoluteFill>
					<StatusBar color="white" />

					<div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', color: 'white'}}>
						<div style={{fontSize: 32, fontWeight: 500, opacity: 0.8}}>{ringing ? 'incoming call' : 'connected'}</div>
						<div style={{marginTop: 14, fontSize: 84, fontWeight: 700, letterSpacing: -2}}>{callerName}</div>
						<div style={{marginTop: 8, fontSize: 36, fontWeight: 500, opacity: 0.85}}>
							{ringing ? `${subtitle}${dots}` : `00:0${seconds}`}
						</div>
					</div>

					{/* Contact poster */}
					<div
						style={{
							position: 'absolute',
							left: SCREEN.width / 2,
							top: 700 - answered * 120,
							scale: String(interpolate(frame, [4, 22], [0.6, 1], {...clamp, easing: backOut}) * (1 - answered * 0.35)),
						}}
					>
						<Ripple offset={0} size={340} color="rgba(255,255,255,0.6)" />
						<Ripple offset={20} size={340} color="rgba(255,255,255,0.5)" />
						<div
							style={{
								...glassDark,
								position: 'absolute',
								left: -170,
								top: -170,
								width: 340,
								height: 340,
								borderRadius: 170,
								background: brand.button,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								boxShadow: '0 30px 80px rgba(255,84,8,0.55), inset 0 3px 4px rgba(255,255,255,0.5)',
							}}
						>
							<Logo width={250} color="white" />
						</div>
					</div>

					{/* Ringing controls */}
					<div style={{opacity: 1 - answered}}>
						<div style={{position: 'absolute', left: 0, right: 0, top: 1180, display: 'flex', justifyContent: 'space-around', padding: '0 70px'}}>
							{['Remind Me', 'Message'].map((l) => (
								<div key={l} style={{...glassDark, padding: '20px 34px', borderRadius: 999, color: 'white', fontSize: 30, fontWeight: 600}}>
									{l}
								</div>
							))}
						</div>
						<div style={{position: 'absolute', left: 0, right: 0, top: 1360, display: 'flex', justifyContent: 'space-between', padding: '0 110px'}}>
							<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
								<div style={{width: 160, height: 160, borderRadius: 80, backgroundColor: brand.danger, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 3px 3px rgba(255,255,255,0.35)'}}>
									<PhoneIcon rotate={135} />
								</div>
								<div style={{color: 'white', fontSize: 30, fontWeight: 500}}>Decline</div>
							</div>
							<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
								<div
									style={{
										width: 160,
										height: 160,
										borderRadius: 80,
										backgroundColor: brand.success,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										boxShadow: `0 0 0 ${12 + Math.sin(frame / 3.5) * 10}px rgba(52,199,89,0.3), inset 0 3px 3px rgba(255,255,255,0.35)`,
										scale: String(interpolate(frame, [ANSWER - 3, ANSWER, ANSWER + 5], [1, 0.86, 1], clamp)),
									}}
								>
									<div style={{rotate: `${Math.sin(frame / 2) * 12}deg`, display: 'flex'}}>
										<PhoneIcon />
									</div>
								</div>
								<div style={{color: 'white', fontSize: 30, fontWeight: 500}}>Accept</div>
							</div>
						</div>
					</div>

					{/* Connected controls */}
					<div style={{opacity: answered, translate: `0px ${(1 - answered) * 80}px`}}>
						<div style={{position: 'absolute', left: 90, right: 90, top: 900, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', rowGap: 50}}>
							{GRID.map((g) => (
								<div key={g} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
									<div style={{...glassDark, width: 150, height: 150, borderRadius: 75}} />
									<div style={{color: 'white', fontSize: 26, fontWeight: 500}}>{g}</div>
								</div>
							))}
						</div>
						<div
							style={{
								position: 'absolute',
								left: SCREEN.width / 2 - 80,
								top: 1400,
								width: 160,
								height: 160,
								borderRadius: 80,
								backgroundColor: brand.danger,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<PhoneIcon rotate={135} />
						</div>
					</div>

					<Tap x={SCREEN.width - 190} y={1440} at={ANSWER} />
				</Phone>
			</AbsoluteFill>

			<Caption at={6}>{caption}</Caption>

			<Audio name="Ringtone" src={staticFile('ring.wav')} from={4} durationInFrames={ANSWER - 4} premountFor={fps} volume={0.95} />
			<Audio name="Answer tap" src={staticFile('tap.wav')} from={ANSWER - 1} premountFor={fps} />
		</AbsoluteFill>
	);
};

const schema = {
	callerName: {type: 'text-content', default: 'CreativeTone', description: 'Caller name'},
	subtitle: {type: 'text-content', default: 'Strategy call', description: 'Call subtitle'},
	caption: {type: 'text-content', default: 'Then… we call you.', description: 'Caption'},
} as const satisfies InteractivitySchema;

export const CallScene = Interactive.withSchema({
	Component: CallSceneInner,
	componentName: '<CallScene>',
	schema,
	wrapInSequence: true,
});
