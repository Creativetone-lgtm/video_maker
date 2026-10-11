import {Audio} from '@remotion/media';
import type React from 'react';
import {AbsoluteFill, Interactive, interpolate, staticFile, useCurrentFrame, useVideoConfig, type InteractivitySchema} from 'remotion';
import {brand, clamp, fontFamily, glass, inOut, progress, typed, typingDuration} from '../theme';
import {Background, Caption, Caret, focusY, Keyboard, KEYBOARD_HEIGHT, Phone, pressedKey, SCREEN, SitePage, StatusBar, Tap} from '../ui';
import {SafariBar} from './SafariBar';

type Props = {
	readonly domain: string;
	readonly caption: string;
	readonly style?: React.CSSProperties;
};

const TAP_BAR = 36;
const TYPE_START = 54;
const BAR_H = 104;

const FAVORITES = ['N', 'M', 'Y', 'W', 'G', 'P', 'L', 'S'];

const SafariSceneInner: React.FC<Props> = ({domain, caption, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const typeEnd = TYPE_START + typingDuration(domain);
	const go = typeEnd + 10;

	const enter = progress(frame, 8, 32);
	const kb = progress(frame, TAP_BAR + 2, TAP_BAR + 14) * (1 - progress(frame, go + 2, go + 14, inOut));
	const loading = interpolate(frame, [go, go + 30], [0, 1], clamp);
	const page = progress(frame, go + 12, go + 30);

	const barBottomY = SCREEN.height - 64 - BAR_H;
	const barKeyboardY = SCREEN.height - KEYBOARD_HEIGHT - BAR_H - 20;
	const barY = interpolate(kb, [0, 1], [barBottomY, barKeyboardY]);

	const zoom = progress(frame, TAP_BAR + 4, TAP_BAR + 20, inOut) * (1 - progress(frame, go + 4, go + 26, inOut));
	const scale = 1 + zoom * 0.32;
	const ty = zoom * focusY(barKeyboardY + 200, 1.32, 900);

	const text = typed(domain, frame, TYPE_START);
	const focused = frame >= TAP_BAR && frame < go;

	return (
		<AbsoluteFill style={{fontFamily, ...style}}>
			<Background />
			<AbsoluteFill style={{scale: String(scale), translate: `0px ${ty}px`}}>
				<Phone
					style={{
						translate: `0px ${(1 - enter) * 1400}px`,
						rotate: `${(1 - enter) * -10}deg`,
						scale: String(0.85 + enter * 0.15),
					}}
				>
					{/* Safari start page */}
					<AbsoluteFill style={{background: `linear-gradient(180deg, ${brand.cream} 0%, ${brand.peach} 100%)`, opacity: 1 - page}}>
						<div style={{position: 'absolute', left: 56, top: 150, fontSize: 52, fontWeight: 700, color: brand.ink}}>Favourites</div>
						{FAVORITES.map((l, i) => (
							<div
								key={l}
								style={{
									...glass,
									position: 'absolute',
									left: 56 + (i % 4) * 172,
									top: 250 + Math.floor(i / 4) * 200,
									width: 136,
									height: 136,
									borderRadius: 36,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontSize: 54,
									fontWeight: 700,
									color: i === 2 ? brand.orange : brand.inkSoft,
									opacity: progress(frame, 8 + i * 2, 20 + i * 2),
								}}
							>
								{l}
							</div>
						))}
						<div style={{...glass, position: 'absolute', left: 56, right: 56, top: 690, height: 220, borderRadius: 44, padding: 36}}>
							<div style={{fontSize: 34, fontWeight: 700, color: brand.ink}}>Privacy Report</div>
							<div style={{marginTop: 12, fontSize: 28, color: brand.inkSoft}}>Safari kept your browsing private.</div>
						</div>
					</AbsoluteFill>

					{/* The real site appears after "go" */}
					<AbsoluteFill style={{opacity: page, scale: String(1.06 - page * 0.06)}}>
						<SitePage scrollY={0} />
					</AbsoluteFill>
					<StatusBar />

					<SafariBar
						top={barY}
						height={BAR_H}
						focused={focused}
						loading={loading}
						compact={page}
						text={
							text.length ? (
								<span style={{color: brand.ink}}>
									{text}
									{focused ? <Caret /> : null}
								</span>
							) : (
								<span style={{color: 'rgba(26,23,20,0.45)'}}>
									Search or enter website
									{focused ? <Caret /> : null}
								</span>
							)
						}
						domain={domain}
					/>
					<Keyboard shown={kb} pressed={pressedKey(domain, frame, TYPE_START)} returnLabel="go" />
					<Tap x={SCREEN.width / 2} y={barBottomY + BAR_H / 2} at={TAP_BAR} />
					<Tap x={SCREEN.width - 110} y={SCREEN.height - KEYBOARD_HEIGHT + 22 + 3 * 114 + 46} at={go} />
				</Phone>
			</AbsoluteFill>

			<Caption step="1" at={22}>
				{caption}
			</Caption>

			<Audio name="Tap bar" src={staticFile('tap.wav')} from={TAP_BAR - 1} premountFor={fps} />
			<Audio name="Typing" src={staticFile('typing.wav')} from={TYPE_START} durationInFrames={typeEnd - TYPE_START} premountFor={fps} />
			<Audio name="Tap go" src={staticFile('tap.wav')} from={go - 1} premountFor={fps} />
			<Audio name="Page load" src={staticFile('whoosh.wav')} from={go + 8} premountFor={fps} volume={0.5} />
		</AbsoluteFill>
	);
};

const schema = {
	domain: {type: 'text-content', default: 'creativetoneagency.com', description: 'Domain typed'},
	caption: {type: 'text-content', default: 'Type our website', description: 'Caption'},
} as const satisfies InteractivitySchema;

export const SafariScene = Interactive.withSchema({
	Component: SafariSceneInner,
	componentName: '<SafariScene>',
	schema,
	wrapInSequence: true,
});

