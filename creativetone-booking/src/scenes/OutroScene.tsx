import type React from 'react';
import {
	AbsoluteFill,
	Interactive,
	interpolate,
	useCurrentFrame,
	type InteractivitySchema,
} from 'remotion';
import {Background, Logo} from '../components';
import {clamp, ease, fontFamily, theme} from '../theme';

type Props = {
	readonly oldWay: string;
	readonly line1: string;
	readonly line2: string;
	readonly domain: string;
	readonly ctaLabel: string;
	readonly style?: React.CSSProperties;
};

const OutroSceneInner: React.FC<Props> = ({oldWay, line1, line2, domain, ctaLabel, style}) => {
	const frame = useCurrentFrame();
	const strike = interpolate(frame, [18, 34], [0, 1], {...clamp, easing: ease});
	const oldOut = interpolate(frame, [44, 60], [0, 1], {...clamp, easing: ease});

	return (
		<AbsoluteFill style={{fontFamily, alignItems: 'center', justifyContent: 'center', ...style}}>
			<Background />

			{/* The old way, crossed out */}
			<div
				style={{
					position: 'absolute',
					top: 420,
					left: 0,
					right: 0,
					display: 'flex',
					justifyContent: 'center',
					opacity: interpolate(frame, [0, 10], [0, 1], clamp) * (1 - oldOut),
					translate: `0px ${-oldOut * 120}px`,
					scale: String(1 - oldOut * 0.15),
				}}
			>
				<div style={{position: 'relative', fontSize: 96, fontWeight: 700, color: 'rgba(255,255,255,0.55)', letterSpacing: -2}}>
					{oldWay}
					<div
						style={{
							position: 'absolute',
							left: -10,
							top: '52%',
							height: 10,
							borderRadius: 5,
							width: `calc(${strike * 100}% + 20px)`,
							background: theme.accent,
						}}
					/>
				</div>
			</div>

			{/* The new way */}
			<div
				style={{
					position: 'absolute',
					top: 250,
					left: 0,
					right: 0,
					textAlign: 'center',
				}}
			>
				<div
					style={{
						fontSize: 150,
						fontWeight: 800,
						color: 'white',
						letterSpacing: -6,
						opacity: interpolate(frame, [52, 64], [0, 1], clamp),
						translate: `0px ${interpolate(frame, [52, 72], [60, 0], {...clamp, easing: ease})}px`,
					}}
				>
					{line1}
				</div>
				<div
					style={{
						marginTop: 10,
						fontSize: 84,
						fontWeight: 800,
						letterSpacing: -3,
						background: theme.gradient,
						backgroundClip: 'text',
						WebkitBackgroundClip: 'text',
						color: 'transparent',
						opacity: interpolate(frame, [64, 76], [0, 1], clamp),
						translate: `0px ${interpolate(frame, [64, 84], [60, 0], {...clamp, easing: ease})}px`,
					}}
				>
					{line2}
				</div>
			</div>

			{/* End card */}
			<div
				style={{
					position: 'absolute',
					top: 720,
					left: 0,
					right: 0,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					gap: 28,
					opacity: interpolate(frame, [84, 98], [0, 1], clamp),
					translate: `0px ${interpolate(frame, [84, 104], [50, 0], {...clamp, easing: ease})}px`,
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 24,
						padding: '22px 36px 22px 24px',
						borderRadius: 999,
						backgroundColor: 'white',
					}}
				>
					<Logo size={36} />
					<div style={{width: 2, height: 40, backgroundColor: theme.line}} />
					<div style={{fontSize: 34, fontWeight: 600, color: theme.inkMuted}}>{domain}</div>
				</div>
				<div
					style={{
						padding: '30px 44px',
						borderRadius: 999,
						background: theme.gradient,
						color: 'white',
						fontSize: 36,
						fontWeight: 800,
						boxShadow: `0 0 0 ${interpolate(frame % 40, [0, 40], [0, 26])}px rgba(255,77,46,${interpolate(frame % 40, [0, 40], [0.35, 0])})`,
					}}
				>
					{ctaLabel} →
				</div>
			</div>
		</AbsoluteFill>
	);
};

const schema = {
	oldWay: {type: 'text-content', default: '“Hi, can you help me?”', description: 'Old way (crossed out)'},
	line1: {type: 'text-content', default: 'Just book.', description: 'Line 1'},
	line2: {type: 'text-content', default: 'We’ll be ready for the call.', description: 'Line 2'},
	domain: {type: 'text-content', default: 'creativetoneagency.com', description: 'Domain'},
	ctaLabel: {type: 'text-content', default: 'Book Strategy', description: 'CTA label'},
} as const satisfies InteractivitySchema;

export const OutroScene = Interactive.withSchema({
	Component: OutroSceneInner,
	componentName: '<OutroScene>',
	schema,
	wrapInSequence: true,
});
