import {Audio} from '@remotion/media';
import type React from 'react';
import {AbsoluteFill, Interactive, interpolate, staticFile, useCurrentFrame, useVideoConfig, type InteractivitySchema} from 'remotion';
import {backOut, brand, clamp, expoOut, fontFamily, progress} from '../theme';
import {Background, Logo} from '../ui';
import {ChatBubble} from './HookScene';
import {FloatingChips} from './FloatingChips';

type Props = {
	readonly oldWay: string;
	readonly line1: string;
	readonly line2: string;
	readonly line3: string;
	readonly ctaLabel: string;
	readonly style?: React.CSSProperties;
};

/** Frame (local) of the final music hit, where the logo lands. */
const HIT = 90;

const rise = (frame: number, at: number) => {
	const p = progress(frame, at, at + 18, expoOut);
	return {opacity: p, translate: `0px ${(1 - p) * 70}px`, filter: `blur(${(1 - p) * 12}px)`};
};

const OutroSceneInner: React.FC<Props> = ({oldWay, line1, line2, line3, ctaLabel, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const bubbleOut = progress(frame, 30, 42);
	const logo = interpolate(frame, [HIT, HIT + 18], [0, 1], {...clamp, easing: backOut});
	const pulse = (frame % 40) / 40;

	return (
		<AbsoluteFill style={{fontFamily, ...style}}>
			<Background />
			<FloatingChips
				chips={[
					{label: 'Branding', x: 70, y: 1360, delay: HIT + 4},
					{label: 'Meta Ads', x: 720, y: 1340, delay: HIT + 8},
					{label: 'Content', x: 170, y: 1490, delay: HIT + 12, accent: true},
					{label: 'Strategy', x: 620, y: 1475, delay: HIT + 16},
				]}
			/>

			<AbsoluteFill style={{opacity: 1 - bubbleOut, scale: String(1 - bubbleOut * 0.3), filter: `blur(${bubbleOut * 14}px)`}}>
				<div style={{position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', fontSize: 56, fontWeight: 700, color: brand.inkSoft, ...rise(frame, 0)}}>
					No more
				</div>
				<ChatBubble text={oldWay} at={4} top={680} strikeAt={16} />
			</AbsoluteFill>

			<div style={{position: 'absolute', left: 0, right: 0, top: 470 - logo * 140, textAlign: 'center'}}>
				<div style={{fontSize: 170, fontWeight: 800, letterSpacing: -7, color: brand.ink, lineHeight: 1, ...rise(frame, 38)}}>{line1}</div>
				<div style={{marginTop: 26, fontSize: 84, fontWeight: 700, letterSpacing: -3, color: brand.ink, lineHeight: 1.05, ...rise(frame, 50)}}>{line2}</div>
				<div style={{fontSize: 84, fontWeight: 800, letterSpacing: -3, color: brand.orange, lineHeight: 1.05, ...rise(frame, 58)}}>{line3}</div>
			</div>

			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: 960 - (680 * 408) / 1332 / 2,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 60,
				}}
			>
				<div style={{scale: String(logo), opacity: Math.min(1, logo * 1.5)}}>
					<Logo width={680} />
				</div>
				<div
					style={{
						padding: '30px 64px',
						borderRadius: 999,
						background: brand.button,
						color: 'white',
						fontSize: 50,
						fontWeight: 700,
						boxShadow: `0 20px 44px rgba(255,84,8,0.4), inset 0 2px 2px rgba(255,255,255,0.4), 0 0 0 ${pulse * 30}px rgba(255,84,8,${0.35 * (1 - pulse)})`,
						...rise(frame, HIT + 14),
					}}
				>
					{ctaLabel} →
				</div>
			</div>

			<Audio name="Bubble pop" src={staticFile('tap.wav')} from={4} premountFor={fps} />
			<Audio name="Bubble away" src={staticFile('whoosh.wav')} from={28} premountFor={fps} volume={0.5} />
			<Audio name="Logo hit" src={staticFile('success.wav')} from={HIT} premountFor={fps} volume={0.45} />
		</AbsoluteFill>
	);
};

const schema = {
	oldWay: {type: 'text-content', default: 'Hi, can you help me?', description: 'Old way (crossed out)'},
	line1: {type: 'text-content', default: 'Just book.', description: 'Line 1'},
	line2: {type: 'text-content', default: 'We’ll be ready', description: 'Line 2'},
	line3: {type: 'text-content', default: 'for the call.', description: 'Line 3 (orange)'},
	ctaLabel: {type: 'text-content', default: 'Book a Strategy Call', description: 'CTA label'},
} as const satisfies InteractivitySchema;

export const OutroScene = Interactive.withSchema({
	Component: OutroSceneInner,
	componentName: '<OutroScene>',
	schema,
	wrapInSequence: true,
});
