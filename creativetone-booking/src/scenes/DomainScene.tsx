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
import {Background, BrowserFrame, Caret, Logo, StepPill} from '../components';
import {clamp, ease, fontFamily, theme, typed, typingDuration} from '../theme';

type Props = {
	readonly domain: string;
	readonly stepLabel: string;
	readonly style?: React.CSSProperties;
};

const TYPE_START = 38;

const DomainSceneInner: React.FC<Props> = ({domain, stepLabel, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const typeEnd = TYPE_START + typingDuration(domain);
	const enterAt = typeEnd + 10;
	const text = typed(domain, frame, TYPE_START);

	return (
		<AbsoluteFill style={{fontFamily, ...style}}>
			<Background />
			<AbsoluteFill
				style={{
					transformOrigin: '560px 128px',
					opacity: interpolate(frame, [0, 15], [0, 1], clamp),
					scale: interpolate(frame, [0, 34, enterAt + 4, enterAt + 32], [1.2, 1.45, 1.45, 1], {
						...clamp,
						easing: ease,
					}),
					translate: interpolate(
						frame,
						[0, 34, enterAt + 4, enterAt + 32],
						['200px 300px', '400px 412px', '400px 412px', '0px 0px'],
						{...clamp, easing: ease},
					),
				}}
			>
				<BrowserFrame
					addressFocused={frame < enterAt}
					loading={interpolate(frame, [enterAt, enterAt + 30], [0, 1], clamp)}
					url={
						<span style={{color: text.length ? theme.ink : theme.inkMuted}}>
							{text.length ? text : 'Search or enter website'}
							{frame < enterAt ? <Caret height={28} /> : null}
						</span>
					}
				>
					<AbsoluteFill
						style={{
							alignItems: 'center',
							justifyContent: 'center',
							opacity: interpolate(frame, [enterAt + 18, enterAt + 34], [0, 1], clamp),
							scale: interpolate(frame, [enterAt + 18, enterAt + 40], [0.92, 1], {...clamp, easing: ease}),
						}}
					>
						<Logo size={64} />
					</AbsoluteFill>
				</BrowserFrame>
			</AbsoluteFill>

			{/* Enter keycap */}
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'}}>
				<div
					style={{
						marginTop: 260,
						padding: '22px 44px',
						borderRadius: 22,
						background: 'white',
						color: theme.ink,
						fontSize: 44,
						fontWeight: 800,
						boxShadow: `0 ${interpolate(frame, [enterAt - 2, enterAt, enterAt + 4], [14, 4, 14], clamp)}px 0 #C9C9D6, 0 30px 60px rgba(0,0,0,0.4)`,
						opacity: interpolate(frame, [enterAt - 10, enterAt - 4, enterAt + 8, enterAt + 14], [0, 1, 1, 0], clamp),
						scale: interpolate(frame, [enterAt - 10, enterAt - 4, enterAt, enterAt + 4], [0.6, 1, 0.9, 1], {
							...clamp,
							easing: ease,
						}),
					}}
				>
					Enter ↵
				</div>
			</AbsoluteFill>

			<StepPill step="STEP 01" label={stepLabel} delay={8} />

			<Audio name="Typing" src={staticFile('typing.wav')} from={TYPE_START} durationInFrames={typeEnd - TYPE_START} premountFor={fps} volume={0.8} />
			<Audio name="Enter key" src={staticFile('click.wav')} from={enterAt} premountFor={fps} />
		</AbsoluteFill>
	);
};

const schema = {
	domain: {type: 'text-content', default: 'creativetoneagency.com', description: 'Domain typed'},
	stepLabel: {type: 'text-content', default: 'Type our domain', description: 'Step label'},
} as const satisfies InteractivitySchema;

export const DomainScene = Interactive.withSchema({
	Component: DomainSceneInner,
	componentName: '<DomainScene>',
	schema,
	wrapInSequence: true,
});
