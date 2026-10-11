import {Audio} from '@remotion/media';
import type React from 'react';
import {
	AbsoluteFill,
	Interactive,
	interpolate,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
	type InteractivitySchema,
} from 'remotion';
import {Background} from '../components';
import {clamp, ease, fontFamily, theme} from '../theme';

type Props = {
	readonly callerName: string;
	readonly headline: string;
	readonly style?: React.CSSProperties;
};

const ANSWER = 118;

const Ripple: React.FC<{readonly offset: number}> = ({offset}) => {
	const frame = useCurrentFrame();
	const p = ((frame + offset) % 45) / 45;
	return (
		<div
			style={{
				position: 'absolute',
				width: 200,
				height: 200,
				borderRadius: 100,
				border: `3px solid ${theme.accent2}`,
				scale: String(1 + p * 1.4),
				opacity: frame < ANSWER ? (1 - p) * 0.7 : 0,
			}}
		/>
	);
};

const CallSceneInner: React.FC<Props> = ({callerName, headline, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const ringing = frame < ANSWER;
	const shake = ringing && Math.floor(frame / 33) % 2 === 0 ? Math.sin(frame * 1.9) * 2.4 : 0;
	const answered = interpolate(frame, [ANSWER, ANSWER + 12], [0, 1], {...clamp, easing: ease});
	const seconds = Math.max(0, Math.floor((frame - ANSWER) / fps));
	const dots = '.'.repeat((Math.floor(frame / 8) % 3) + 1);

	return (
		<AbsoluteFill style={{fontFamily, ...style}}>
			<Background />

			<div
				style={{
					position: 'absolute',
					left: 160,
					top: 300,
					width: 820,
					opacity: interpolate(frame, [4, 18], [0, 1], clamp),
					translate: `${interpolate(frame, [4, 26], [-60, 0], {...clamp, easing: ease})}px 0px`,
				}}
			>
				<div style={{fontSize: 34, fontWeight: 700, color: theme.accent, letterSpacing: 2, textTransform: 'uppercase'}}>
					Moments later…
				</div>
				<div style={{marginTop: 20, fontSize: 108, fontWeight: 800, lineHeight: 1.02, letterSpacing: -4, color: 'white', whiteSpace: 'pre-line'}}>
					{headline}
				</div>
				<div
					style={{
						marginTop: 34,
						fontSize: 40,
						color: theme.muted,
						opacity: interpolate(frame, [20, 34], [0, 1], clamp),
					}}
				>
					No chasing. No waiting. We call you.
				</div>
			</div>

			{/* Phone */}
			<div
				style={{
					position: 'absolute',
					left: 1180,
					top: 90,
					width: 470,
					height: 900,
					borderRadius: 70,
					padding: 16,
					background: '#1A1A26',
					boxShadow: '0 60px 140px rgba(0,0,0,0.6), 0 0 0 2px rgba(255,255,255,0.12)',
					rotate: `${shake}deg`,
					translate: `0px ${interpolate(frame, [0, 24], [120, 0], {...clamp, easing: ease})}px`,
					opacity: interpolate(frame, [0, 12], [0, 1], clamp),
				}}
			>
				<div
					style={{
						position: 'relative',
						width: '100%',
						height: '100%',
						borderRadius: 56,
						overflow: 'hidden',
						background: `linear-gradient(180deg, #2B1240 0%, #12121F 60%, ${answered > 0 ? '#0E2A1B' : '#12121F'} 100%)`,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						color: 'white',
					}}
				>
					<div style={{marginTop: 18, width: 130, height: 36, borderRadius: 18, background: 'black'}} />
					<div style={{marginTop: 50, fontSize: 24, color: theme.muted, fontWeight: 500}}>
						{ringing ? 'Incoming call' : 'Connected'}
					</div>
					<div style={{position: 'relative', marginTop: 70, width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
						<Ripple offset={0} />
						<Ripple offset={15} />
						<Ripple offset={30} />
						<div
							style={{
								width: 200,
								height: 200,
								borderRadius: 100,
								background: theme.gradient,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: 78,
								fontWeight: 800,
								letterSpacing: -2,
								boxShadow: '0 20px 60px rgba(255,46,147,0.45)',
							}}
						>
							CT
						</div>
					</div>
					<div style={{marginTop: 60, fontSize: 52, fontWeight: 800, letterSpacing: -1}}>{callerName}</div>
					<div style={{marginTop: 12, fontSize: 28, color: ringing ? theme.muted : theme.success, fontWeight: 600}}>
						{ringing ? `calling${dots}` : `00:0${seconds}`}
					</div>
					<div style={{marginTop: 10, fontSize: 22, color: theme.muted}}>Strategy call · E-commerce</div>

					<div style={{position: 'absolute', bottom: 80, left: 0, right: 0, display: 'flex', justifyContent: 'space-around'}}>
						<div
							style={{
								width: 104,
								height: 104,
								borderRadius: 52,
								backgroundColor: '#EF4444',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: 46,
								opacity: 1 - answered,
								scale: String(1 - answered * 0.4),
							}}
						>
							<div style={{rotate: '135deg', display: 'flex'}}><svg width="50" height="50" viewBox="0 0 24 24"><path fill="white" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg></div>
						</div>
						<div
							style={{
								width: 104,
								height: 104,
								borderRadius: 52,
								backgroundColor: theme.success,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: 46,
								boxShadow: ringing ? `0 0 0 ${10 + Math.sin(frame / 4) * 8}px rgba(34,197,94,0.25)` : 'none',
								scale: String(interpolate(frame, [ANSWER - 4, ANSWER, ANSWER + 6], [1, 0.85, 1], clamp)),
								translate: `${interpolate(frame, [ANSWER, ANSWER + 14], [0, -112], {...clamp, easing: ease})}px 0px`,
							}}
						>
							<svg width="50" height="50" viewBox="0 0 24 24"><path fill="white" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>
						</div>
					</div>
				</div>
			</div>
			<Audio name="Ringtone" src={staticFile('ring.wav')} from={6} durationInFrames={ANSWER - 6} premountFor={fps} volume={0.9} />
			<Audio name="Answer tap" src={staticFile('click.wav')} from={ANSWER - 1} premountFor={fps} />
		</AbsoluteFill>
	);
};

const schema = {
	callerName: {type: 'text-content', default: 'Creativetone', description: 'Caller name'},
	headline: {type: 'text-content', default: 'Creativetone\nis calling.', description: 'Headline'},
} as const satisfies InteractivitySchema;

export const CallScene = Interactive.withSchema({
	Component: CallSceneInner,
	componentName: '<CallScene>',
	schema,
	wrapInSequence: true,
});
