import {Audio} from '@remotion/media';
import type React from 'react';
import {AbsoluteFill, Interactive, interpolate, staticFile, useCurrentFrame, useVideoConfig, type InteractivitySchema} from 'remotion';
import {backOut, brand, clamp, expoOut, fontFamily, glass, inOut, progress} from '../theme';
import {Background} from '../ui';
import {FloatingChips} from './FloatingChips';

type Props = {
	readonly message1: string;
	readonly message2: string;
	readonly headline: string;
	readonly highlight: string;
	readonly style?: React.CSSProperties;
};

const STRIKE = 50;
const FLY = 60;
const HEADLINE = 68;

export const ChatBubble: React.FC<{readonly text: string; readonly at: number; readonly top: number; readonly strikeAt?: number}> = ({
	text,
	at,
	top,
	strikeAt = 100000,
}) => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [at, at + 14], [0, 1], {...clamp, easing: backOut});
	const strike = progress(frame, strikeAt, strikeAt + 10, inOut);
	return (
		<div
			style={{
				position: 'absolute',
				right: 110,
				top,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'flex-end',
				transformOrigin: 'right bottom',
				scale: String(p),
				opacity: Math.min(1, p),
			}}
		>
			<div
				style={{
					position: 'relative',
					padding: '30px 44px',
					borderRadius: 52,
					borderBottomRightRadius: 14,
					background: brand.button,
					color: 'white',
					fontSize: 58,
					fontWeight: 600,
					letterSpacing: -1,
					boxShadow: '0 24px 50px rgba(255,84,8,0.35), inset 0 2px 2px rgba(255,255,255,0.45)',
					whiteSpace: 'nowrap',
				}}
			>
				{text}
				<div
					style={{
						position: 'absolute',
						left: 30,
						top: '50%',
						height: 8,
						borderRadius: 4,
						width: `calc(${strike} * (100% - 60px))`,
						backgroundColor: brand.ink,
					}}
				/>
			</div>
			<div style={{marginTop: 10, marginRight: 14, fontSize: 28, fontWeight: 500, color: brand.inkSoft}}>Delivered</div>
		</div>
	);
};

const HookSceneInner: React.FC<Props> = ({message1, message2, headline, highlight, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const fly = progress(frame, FLY, FLY + 14, inOut);
	const typingDots = interpolate(frame, [26, 32, 44, 48], [0, 1, 1, 0], clamp);

	const words = headline.split(' ');

	return (
		<AbsoluteFill style={{fontFamily, ...style}}>
			<Background />
			<FloatingChips
				chips={[
					{label: 'Strategy', x: 90, y: 1520, delay: HEADLINE + 6},
					{label: 'Creative', x: 640, y: 1640, delay: HEADLINE + 10, accent: true},
					{label: 'Growth', x: 300, y: 1760, delay: HEADLINE + 14},
				]}
			/>

			{/* The old way */}
			<AbsoluteFill
				style={{
					translate: `0px ${-fly * 500}px`,
					opacity: 1 - fly,
					filter: `blur(${fly * 16}px)`,
				}}
			>
				<div
					style={{
						position: 'absolute',
						left: 110,
						top: 380,
						fontSize: 40,
						fontWeight: 600,
						color: brand.inkSoft,
						opacity: progress(frame, 2, 14),
					}}
				>
					The old way…
				</div>
				<ChatBubble text={message1} at={4} top={520} strikeAt={STRIKE} />
				<ChatBubble text={message2} at={18} top={740} strikeAt={STRIKE + 4} />
				<div
					style={{
						...glass,
						position: 'absolute',
						left: 110,
						top: 960,
						padding: '30px 38px',
						borderRadius: 52,
						borderBottomLeftRadius: 14,
						display: 'flex',
						gap: 14,
						opacity: typingDots,
						scale: String(0.6 + typingDots * 0.4),
						transformOrigin: 'left bottom',
					}}
				>
					{[0, 1, 2].map((d) => (
						<div
							key={d}
							style={{
								width: 22,
								height: 22,
								borderRadius: 11,
								backgroundColor: brand.inkSoft,
								opacity: 0.35 + 0.65 * Math.max(0, Math.sin((frame - d * 4) / 3)),
							}}
						/>
					))}
				</div>
				<div
					style={{
						position: 'absolute',
						left: 110,
						top: 1120,
						fontSize: 40,
						fontWeight: 600,
						color: brand.orange,
						opacity: progress(frame, 46, 52),
					}}
				>
					…still waiting for a reply.
				</div>
			</AbsoluteFill>

			{/* The new way */}
			<div
				style={{
					position: 'absolute',
					left: 90,
					right: 90,
					top: 640,
					fontSize: 150,
					lineHeight: 0.98,
					fontWeight: 800,
					letterSpacing: -6,
					color: brand.ink,
				}}
			>
				{words.map((w, i) => {
					const p = progress(frame, HEADLINE + i * 4, HEADLINE + i * 4 + 16, expoOut);
					return (
						<span
							key={`${w}-${i}`}
							style={{
								display: 'inline-block',
								marginRight: 34,
								color: w.replace(/[.,]/g, '') === highlight ? brand.orange : brand.ink,
								opacity: p,
								translate: `0px ${(1 - p) * 80}px`,
								filter: `blur(${(1 - p) * 12}px)`,
							}}
						>
							{w}
						</span>
					);
				})}
			</div>

			<Audio name="Message pop 1" src={staticFile('tap.wav')} from={4} premountFor={fps} />
			<Audio name="Message pop 2" src={staticFile('tap.wav')} from={18} premountFor={fps} />
			<Audio name="Fly away" src={staticFile('whoosh.wav')} from={FLY - 4} premountFor={fps} volume={0.6} />
		</AbsoluteFill>
	);
};

const schema = {
	message1: {type: 'text-content', default: 'Hi, can you help me?', description: 'Message 1'},
	message2: {type: 'text-content', default: 'Hello??', description: 'Message 2'},
	headline: {type: 'text-content', default: 'There’s a faster way.', description: 'Headline'},
	highlight: {type: 'text-content', default: 'faster', description: 'Highlighted word'},
} as const satisfies InteractivitySchema;

export const HookScene = Interactive.withSchema({
	Component: HookSceneInner,
	componentName: '<HookScene>',
	schema,
	wrapInSequence: true,
});
