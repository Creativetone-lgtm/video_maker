import {Audio} from '@remotion/media';
import type React from 'react';
import {AbsoluteFill, Interactive, interpolate, random, staticFile, useCurrentFrame, useVideoConfig, type InteractivitySchema} from 'remotion';
import {backOut, brand, clamp, fontFamily, glass, inOut, masked, progress} from '../theme';
import {Background, Caption, focusY, FORM_SCROLL, Phone, SitePage, StatusBar} from '../ui';
import {BUTTON, Card, CARD, Field, FIELD_TOPS} from './FormCard';

type Props = {
	readonly title: string;
	readonly subtitle: string;
	readonly industry: string;
	readonly caption: string;
	readonly style?: React.CSSProperties;
};

const CONFETTI = [brand.orange, '#FF8A4C', brand.peachDeep, brand.ink, '#FFFFFF'];

const SentSceneInner: React.FC<Props> = ({title, subtitle, industry, caption, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const out = progress(frame, 0, 10);
	const pop = interpolate(frame, [6, 22], [0, 1], {...clamp, easing: backOut});
	const check = 1 - progress(frame, 16, 32);
	const pull = progress(frame, 4, 34, inOut);
	const scale = 1.15 - pull * 0.15;
	const ty = (1 - pull) * focusY(BUTTON.top + BUTTON.height / 2, 1.15, 900);
	const cx = CARD.width / 2;

	return (
		<AbsoluteFill style={{fontFamily, ...style}}>
			<Background />
			<AbsoluteFill style={{scale: String(scale), translate: `0px ${ty}px`}}>
				<Phone style={{rotate: `${Math.sin(pull * Math.PI) * -2}deg`}}>
					<SitePage scrollY={FORM_SCROLL} />
					<Card>
						<div style={{opacity: 1 - out, filter: `blur(${out * 10}px)`}}>
							<Field label="Name" top={FIELD_TOPS.name} value={masked(10)} focused={false} />
							<Field label="Company" top={FIELD_TOPS.company} value={masked(8)} focused={false} />
							<Field label="Email" top={FIELD_TOPS.email} value={masked(14)} focused={false} />
							<Field label="Phone" top={FIELD_TOPS.phone} value={masked(11)} focused={false} />
							<Field label="Industry" top={FIELD_TOPS.industry} height={89} value={industry} focused={false} select />
						</div>
						{new Array(36).fill(true).map((_, i) => {
							const angle = random(`a${i}`) * Math.PI * 2;
							const dist = 160 + random(`d${i}`) * 380;
							const p = progress(frame, 14, 60);
							return (
								<div
									key={i}
									style={{
										position: 'absolute',
										left: cx + Math.cos(angle) * dist * p,
										top: 420 + Math.sin(angle) * dist * p + p * p * 160,
										width: 16 + random(`w${i}`) * 14,
										height: 10 + random(`h${i}`) * 8,
										borderRadius: 4,
										backgroundColor: CONFETTI[i % CONFETTI.length],
										rotate: `${random(`r${i}`) * 360 + frame * 9}deg`,
										opacity: interpolate(frame, [14, 18, 62, 80], [0, 1, 1, 0], clamp),
									}}
								/>
							);
						})}
						<div
							style={{
								position: 'absolute',
								left: cx - 120,
								top: 300,
								width: 240,
								height: 240,
								borderRadius: 120,
								background: brand.button,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								boxShadow: `0 0 0 ${pop * 30}px rgba(255,84,8,0.12), 0 30px 60px rgba(255,84,8,0.4), inset 0 3px 3px rgba(255,255,255,0.45)`,
								scale: String(pop),
							}}
						>
							<svg width="130" height="130" viewBox="0 0 24 24">
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
								position: 'absolute',
								left: 0,
								right: 0,
								top: 600,
								textAlign: 'center',
								fontSize: 80,
								fontWeight: 800,
								letterSpacing: -3,
								color: brand.ink,
								opacity: progress(frame, 18, 30),
								translate: `0px ${(1 - progress(frame, 18, 34)) * 40}px`,
							}}
						>
							{title}
						</div>
						<div
							style={{
								position: 'absolute',
								left: 40,
								right: 40,
								top: 710,
								textAlign: 'center',
								fontSize: 38,
								color: brand.inkSoft,
								opacity: progress(frame, 24, 36),
								translate: `0px ${(1 - progress(frame, 24, 40)) * 40}px`,
							}}
						>
							{subtitle}
						</div>
						<div
							style={{
								...glass,
								position: 'absolute',
								left: cx - 230,
								top: 830,
								width: 460,
								height: 84,
								borderRadius: 42,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 12,
								fontSize: 32,
								fontWeight: 600,
								color: brand.orange,
								opacity: progress(frame, 30, 42),
								scale: String(interpolate(frame, [30, 44], [0.7, 1], {...clamp, easing: backOut})),
							}}
						>
							<svg width="30" height="30" viewBox="0 0 24 24">
								<path d="M5 12.5l4.5 4.5L19 7.5" stroke={brand.orange} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
							{industry}
						</div>
					</Card>
					<StatusBar />
				</Phone>
			</AbsoluteFill>
			<Caption at={8}>{caption}</Caption>
			<Audio name="Sent swoosh" src={staticFile('sent.wav')} premountFor={fps} volume={0.8} />
			<Audio name="Success chime" src={staticFile('success.wav')} from={14} premountFor={fps} volume={0.7} />
		</AbsoluteFill>
	);
};

const schema = {
	title: {type: 'text-content', default: 'Request sent!', description: 'Title'},
	subtitle: {type: 'text-content', default: 'We’ll be ready for your call.', description: 'Subtitle'},
	industry: {type: 'text-content', default: 'Healthcare & Doctors', description: 'Industry chip'},
	caption: {type: 'text-content', default: 'Sent. That’s it.', description: 'Caption'},
} as const satisfies InteractivitySchema;

export const SentScene = Interactive.withSchema({
	Component: SentSceneInner,
	componentName: '<SentScene>',
	schema,
	wrapInSequence: true,
});
