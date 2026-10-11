import {Audio} from '@remotion/media';
import type React from 'react';
import {
	AbsoluteFill,
	Interactive,
	interpolate,
	random,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
	type InteractivitySchema,
} from 'remotion';
import {Background, BrowserFrame, StepPill} from '../components';
import {clamp, DOMAIN, ease, fontFamily, theme} from '../theme';

type Props = {
	readonly title: string;
	readonly subtitle: string;
	readonly style?: React.CSSProperties;
};

const CONFETTI_COLORS = [theme.accent, theme.accent2, theme.violet, '#FFC83D', theme.success];

const SentSceneInner: React.FC<Props> = ({title, subtitle, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const pop = interpolate(frame, [4, 22], [0, 1], {...clamp, easing: ease});
	const check = interpolate(frame, [14, 30], [1, 0], {...clamp, easing: ease});

	return (
		<AbsoluteFill style={{fontFamily, ...style}}>
			<Background />
			<BrowserFrame url={<span>{DOMAIN}/book-strategy</span>}>
				<AbsoluteFill
					style={{
						background: 'linear-gradient(180deg,#F7F6FB 0%,#FFFFFF 100%)',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					{new Array(40).fill(true).map((_, i) => {
						const angle = random(`a${i}`) * Math.PI * 2;
						const dist = 250 + random(`d${i}`) * 450;
						const p = interpolate(frame, [12, 60], [0, 1], {...clamp, easing: ease});
						return (
							<div
								key={i}
								style={{
									position: 'absolute',
									left: 800 + Math.cos(angle) * dist * p,
									top: 330 + Math.sin(angle) * dist * p + p * p * 120,
									width: 14 + random(`s${i}`) * 12,
									height: 8 + random(`h${i}`) * 8,
									borderRadius: 3,
									backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
									rotate: `${random(`r${i}`) * 360 + frame * 8}deg`,
									opacity: interpolate(frame, [12, 16, 60, 80], [0, 1, 1, 0], clamp),
								}}
							/>
						);
					})}
					<div
						style={{
							width: 200,
							height: 200,
							borderRadius: 100,
							backgroundColor: theme.success,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							boxShadow: `0 0 0 ${pop * 26}px rgba(34,197,94,0.15), 0 30px 60px rgba(34,197,94,0.35)`,
							scale: String(pop),
							marginTop: -40,
						}}
					>
						<svg width="110" height="110" viewBox="0 0 24 24">
							<path
								d="M5 12.5 L10 17.5 L19 7"
								fill="none"
								stroke="white"
								strokeWidth="3"
								strokeLinecap="round"
								strokeLinejoin="round"
								pathLength={1}
								strokeDasharray={1}
								strokeDashoffset={check}
							/>
						</svg>
					</div>
					<div
						style={{
							marginTop: 48,
							fontSize: 72,
							fontWeight: 800,
							letterSpacing: -2,
							color: theme.ink,
							opacity: interpolate(frame, [18, 30], [0, 1], clamp),
							translate: `0px ${interpolate(frame, [18, 34], [30, 0], {...clamp, easing: ease})}px`,
						}}
					>
						{title}
					</div>
					<div
						style={{
							marginTop: 16,
							fontSize: 32,
							color: theme.inkMuted,
							opacity: interpolate(frame, [26, 38], [0, 1], clamp),
							translate: `0px ${interpolate(frame, [26, 42], [30, 0], {...clamp, easing: ease})}px`,
						}}
					>
						{subtitle}
					</div>
				</AbsoluteFill>
			</BrowserFrame>
			<StepPill step="DONE" label="Request sent ✓" delay={10} />
			<Audio name="Success chime" src={staticFile('success.wav')} from={8} premountFor={fps} volume={0.8} />
		</AbsoluteFill>
	);
};

const schema = {
	title: {type: 'text-content', default: 'Request sent!', description: 'Title'},
	subtitle: {type: 'text-content', default: 'Sit tight, Alex — we’re getting ready for your call.', description: 'Subtitle'},
} as const satisfies InteractivitySchema;

export const SentScene = Interactive.withSchema({
	Component: SentSceneInner,
	componentName: '<SentScene>',
	schema,
	wrapInSequence: true,
});
