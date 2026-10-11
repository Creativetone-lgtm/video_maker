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
import {Background, BrowserFrame, Cursor, StepPill} from '../components';
import {SiteNav} from '../site';
import {clamp, DOMAIN, ease, fontFamily, theme} from '../theme';

type Props = {
	readonly headline: string;
	readonly ctaLabel: string;
	readonly stepLabel: string;
	readonly style?: React.CSSProperties;
};

const CLICK = 80;

const rise = (frame: number, delay: number) => ({
	opacity: interpolate(frame, [delay, delay + 14], [0, 1], clamp),
	translate: `0px ${interpolate(frame, [delay, delay + 20], [40, 0], {...clamp, easing: ease})}px`,
});

const Tile: React.FC<{
	readonly left: number;
	readonly top: number;
	readonly width: number;
	readonly height: number;
	readonly bg: string;
	readonly label: string;
	readonly delay: number;
	readonly phase: number;
}> = ({left, top, width, height, bg, label, delay, phase}) => {
	const frame = useCurrentFrame();
	return (
		<div
			style={{
				position: 'absolute',
				left,
				top: top + Math.sin((frame + phase) / 18) * 8,
				width,
				height,
				borderRadius: 28,
				background: bg,
				boxShadow: '0 30px 60px rgba(20,20,40,0.18)',
				display: 'flex',
				alignItems: 'flex-end',
				padding: 28,
				color: 'white',
				fontSize: 30,
				fontWeight: 800,
				...rise(frame, delay),
			}}
		>
			{label}
		</div>
	);
};

const HomeSceneInner: React.FC<Props> = ({headline, ctaLabel, stepLabel, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const press = interpolate(frame, [CLICK - 3, CLICK, CLICK + 6], [1, 0.93, 1.03], clamp);
	const glow = interpolate(frame, [CLICK, CLICK + 20], [0, 1], clamp);

	return (
		<AbsoluteFill style={{fontFamily, ...style}}>
			<Background />
			<AbsoluteFill
				style={{
					transformOrigin: '480px 814px',
					scale: interpolate(frame, [30, 100], [1, 1.1], {...clamp, easing: ease}),
				}}
			>
				<BrowserFrame url={<span>{DOMAIN}</span>}>
					<AbsoluteFill style={{backgroundColor: 'white'}}>
						<SiteNav ctaLabel={ctaLabel} />
						<div
							style={{
								position: 'absolute',
								left: 110,
								top: 170,
								display: 'flex',
								gap: 12,
								alignItems: 'center',
								padding: '10px 20px',
								borderRadius: 999,
								backgroundColor: '#FFF1EE',
								color: theme.accent,
								fontSize: 22,
								fontWeight: 700,
								...rise(frame, 4),
							}}
						>
							● Creative & growth agency
						</div>
						<div
							style={{
								position: 'absolute',
								left: 110,
								top: 240,
								width: 760,
								fontSize: 92,
								lineHeight: 1.02,
								fontWeight: 800,
								letterSpacing: -3,
								whiteSpace: 'pre-line',
								color: theme.ink,
								...rise(frame, 8),
							}}
						>
							{headline}
						</div>
						<div
							style={{
								position: 'absolute',
								left: 110,
								top: 480,
								width: 680,
								fontSize: 30,
								lineHeight: 1.4,
								color: theme.inkMuted,
								...rise(frame, 14),
							}}
						>
							Strategy, branding, content and performance — built around your business.
						</div>
						<div
							style={{
								position: 'absolute',
								left: 110,
								top: 600,
								width: 420,
								height: 96,
								borderRadius: 999,
								background: theme.gradient,
								color: 'white',
								fontSize: 34,
								fontWeight: 800,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 14,
								boxShadow: `0 20px 40px rgba(255,46,147,0.35), 0 0 0 ${glow * 30}px rgba(255,77,46,${0.3 * (1 - glow)})`,
								...rise(frame, 20),
								scale: String(press),
							}}
						>
							{ctaLabel} →
						</div>
						<Tile left={900} top={150} width={330} height={380} bg="linear-gradient(160deg,#FF4D2E,#FF2E93)" label="Branding" delay={18} phase={0} />
						<Tile left={1260} top={210} width={260} height={260} bg="linear-gradient(160deg,#7B5CFF,#3B2BB5)" label="Social" delay={24} phase={20} />
						<Tile left={1000} top={560} width={520} height={200} bg="linear-gradient(120deg,#0B0B16,#2A2A44)" label="+312% qualified leads" delay={30} phase={40} />
					</AbsoluteFill>
				</BrowserFrame>
				<Cursor
					points={[
						{f: 0, x: 1500, y: 1120},
						{f: 22, x: 1450, y: 960},
						{f: 70, x: 470, y: 820},
					]}
					clicks={[CLICK]}
				/>
			</AbsoluteFill>
			<StepPill step="STEP 02" label={stepLabel} delay={6} />
			<Audio name="Click" src={staticFile('click.wav')} from={CLICK - 1} premountFor={fps} />
		</AbsoluteFill>
	);
};

const schema = {
	headline: {type: 'text-content', default: 'Creative that\ngrows brands.', description: 'Hero headline'},
	ctaLabel: {type: 'text-content', default: 'Book Strategy', description: 'CTA label'},
	stepLabel: {type: 'text-content', default: 'Click “Book Strategy”', description: 'Step label'},
} as const satisfies InteractivitySchema;

export const HomeScene = Interactive.withSchema({
	Component: HomeSceneInner,
	componentName: '<HomeScene>',
	schema,
	wrapInSequence: true,
});
