import {Audio} from '@remotion/media';
import type React from 'react';
import {AbsoluteFill, Interactive, interpolate, staticFile, useCurrentFrame, useVideoConfig, type InteractivitySchema} from 'remotion';
import {brand, clamp, DOMAIN, fontFamily, inOut, progress} from '../theme';
import {Background, Caption, focusY, FORM_SCROLL, Phone, SCREEN, SITE_SCALE, SitePage, siteToScreenY, StatusBar, Tap} from '../ui';
import {SafariBar} from './SafariBar';

type Props = {
	readonly tapCaption: string;
	readonly scrollCaption: string;
	readonly style?: React.CSSProperties;
};

const TAP = 52;
const SCROLL_START = 72;
const SCROLL_END = 140;

// "Book a Strategy Call" button in the screenshot (3x pixels)
const BTN = {x0: 60, x1: 684, y0: 1488, y1: 1650};

const scrollAt = (f: number) =>
	interpolate(f, [SCROLL_START, SCROLL_END], [0, FORM_SCROLL], {...clamp, easing: inOut});

const BrowseSceneInner: React.FC<Props> = ({tapCaption, scrollCaption, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const scrollY = scrollAt(frame);
	const velocity = scrollY - scrollAt(frame - 1);

	const btnY = (siteToScreenY(BTN.y0, 0) + siteToScreenY(BTN.y1, 0)) / 2;
	const push = progress(frame, 0, 48, inOut) * (1 - progress(frame, SCROLL_START - 6, SCROLL_START + 16, inOut));
	const scale = 1 + push * 0.16 - progress(frame, SCROLL_START, SCROLL_START + 20) * 0.05 * (1 - progress(frame, SCROLL_END - 20, SCROLL_END));
	const ty = push * focusY(btnY, 1.16, 1050);
	const glow = progress(frame, TAP, TAP + 20);
	const barHide = progress(frame, SCROLL_START, SCROLL_START + 10);

	return (
		<AbsoluteFill style={{fontFamily, ...style}}>
			<Background />
			<AbsoluteFill style={{scale: String(scale), translate: `0px ${ty}px`}}>
				<Phone>
					<SitePage scrollY={scrollY} velocity={velocity} />
					{/* Button press highlight */}
					<div
						style={{
							position: 'absolute',
							left: BTN.x0 * SITE_SCALE,
							top: siteToScreenY(BTN.y0, scrollY),
							width: (BTN.x1 - BTN.x0) * SITE_SCALE,
							height: (BTN.y1 - BTN.y0) * SITE_SCALE,
							borderRadius: 60,
							boxShadow: `0 0 0 ${glow * 26}px rgba(255,84,8,${0.45 * (1 - glow)}), inset 0 0 0 ${frame >= TAP - 2 && frame < TAP + 8 ? 4 : 0}px ${brand.orange}`,
							backgroundColor: frame >= TAP - 2 && frame < TAP + 8 ? 'rgba(255,84,8,0.12)' : 'transparent',
							scale: String(interpolate(frame, [TAP - 2, TAP, TAP + 6], [1, 0.95, 1], clamp)),
						}}
					/>
					<StatusBar />
					<div style={{opacity: 1 - barHide, translate: `0px ${barHide * 60}px`}}>
						<SafariBar top={SCREEN.height - 64 - 104} height={104} focused={false} loading={0} compact={1} text={DOMAIN} domain={DOMAIN} />
					</div>
					<Tap x={(BTN.x0 + BTN.x1) * 0.5 * SITE_SCALE} y={btnY} at={TAP} />
				</Phone>
			</AbsoluteFill>

			<Caption step="2" at={4} until={SCROLL_START + 4}>
				{tapCaption}
			</Caption>
			<Caption at={SCROLL_START + 6}>{scrollCaption}</Caption>

			<Audio name="Tap button" src={staticFile('tap.wav')} from={TAP - 1} premountFor={fps} />
			<Audio name="Scroll whoosh" src={staticFile('whoosh.wav')} from={SCROLL_START + 16} premountFor={fps} volume={0.7} />
		</AbsoluteFill>
	);
};

const schema = {
	tapCaption: {type: 'text-content', default: 'Tap “Book a Strategy Call”', description: 'Tap caption'},
	scrollCaption: {type: 'text-content', default: 'Straight to the form', description: 'Scroll caption'},
} as const satisfies InteractivitySchema;

export const BrowseScene = Interactive.withSchema({
	Component: BrowseSceneInner,
	componentName: '<BrowseScene>',
	schema,
	wrapInSequence: true,
});
