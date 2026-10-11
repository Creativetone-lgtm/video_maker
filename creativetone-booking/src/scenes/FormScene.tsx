import {Audio} from '@remotion/media';
import type React from 'react';
import {AbsoluteFill, Interactive, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig, type InteractivitySchema} from 'remotion';
import {backOut, brand, clamp, fontFamily, glass, inOut, masked, progress, typed} from '../theme';
import {Background, Caption, focusY, FORM_SCROLL, Keyboard, Phone, SitePage, StatusBar, Tap} from '../ui';
import {BUTTON, Card, CARD, Field, fieldCenterY, FIELD_TOPS, INPUT} from './FormCard';

type Props = {
	readonly industry: string;
	readonly buttonLabel: string;
	readonly style?: React.CSSProperties;
};

// Details are masked — the keys pressed are just decoration.
const NAME = masked(10);
const COMPANY = masked(8);
const EMAIL = masked(14);
const PHONE_NO = masked(11);
const KEYS = 'creativetonestrategycallgrowth';

const T = {
	name: 10,
	company: 42,
	email: 68,
	phone: 104,
	keyboardDown: 132,
	industry: 148,
	option: 178,
	send: 206,
};

export const INDUSTRIES = [
	'Healthcare & Doctors',
	'Restaurants & Cafes',
	'Beauty & Wellness',
	'Retail & E-commerce',
	'Real Estate',
	'Automotive',
	'Professional Services',
];

const MENU = {top: 300, itemH: 86, pad: 14};

const FormSceneInner: React.FC<Props> = ({industry, buttonLabel, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const focus =
		frame >= T.keyboardDown
			? frame >= T.industry && frame < T.option + 6
				? 'industry'
				: 'none'
			: frame >= T.phone
				? 'phone'
				: frame >= T.email
					? 'email'
					: frame >= T.company
						? 'company'
						: frame >= T.name
							? 'name'
							: 'none';

	const kb = progress(frame, T.name + 2, T.name + 14) * (1 - progress(frame, T.keyboardDown, T.keyboardDown + 12, inOut));
	const typingField =
		frame >= T.phone + 4 ? T.phone + 4 : frame >= T.email + 4 ? T.email + 4 : frame >= T.company + 4 ? T.company + 4 : T.name + 4;
	const keyIndex = Math.floor((frame - typingField) / 2);
	const keyDown = frame < T.keyboardDown && keyIndex >= 0 && keyIndex < 14 ? KEYS[(keyIndex + typingField) % KEYS.length] : null;

	const menu = interpolate(frame, [T.industry + 2, T.industry + 14], [0, 1], {...clamp, easing: backOut}) * (1 - progress(frame, T.option + 4, T.option + 12, inOut));
	const selected = frame >= T.option ? industry : '';
	const sending = frame >= T.send + 4;
	const sendPress = interpolate(frame, [T.send - 2, T.send, T.send + 6], [1, 0.93, 1], clamp);

	// Camera follows the active field
	const fy = interpolate(
		frame,
		[0, 12, T.company - 4, T.company + 6, T.email - 4, T.email + 6, T.phone - 4, T.phone + 6, T.keyboardDown, T.industry + 4, T.option + 10, T.send - 4],
		[fieldCenterY('name'), fieldCenterY('name'), fieldCenterY('name'), fieldCenterY('company'), fieldCenterY('company'), fieldCenterY('email'), fieldCenterY('email'), fieldCenterY('phone'), fieldCenterY('phone'), 640, 640, BUTTON.top + BUTTON.height / 2],
		{...clamp, easing: inOut},
	);
	const zoom = progress(frame, 0, 14, inOut);
	const scale = 1 + zoom * 0.15;
	const ty = zoom * focusY(fy, 1.15, 900);
	const cardIn = progress(frame, 0, 8);

	return (
		<AbsoluteFill style={{fontFamily, ...style}}>
			<Background />
			<AbsoluteFill style={{scale: String(scale), translate: `0px ${ty}px`}}>
				<Phone>
					<SitePage scrollY={FORM_SCROLL} />
					<Card style={{opacity: cardIn}}>
						<Field label="Name" top={FIELD_TOPS.name} value={typed(NAME, frame, T.name + 4)} focused={focus === 'name'} />
						<Field label="Company" top={FIELD_TOPS.company} value={typed(COMPANY, frame, T.company + 4)} focused={focus === 'company'} />
						<Field label="Email" top={FIELD_TOPS.email} value={typed(EMAIL, frame, T.email + 4)} focused={focus === 'email'} />
						<Field label="Phone" top={FIELD_TOPS.phone} value={typed(PHONE_NO, frame, T.phone + 4)} focused={focus === 'phone'} />
						<Field label="Industry" top={FIELD_TOPS.industry} height={89} value={selected} placeholder="Select" focused={focus === 'industry'} select />
						<div
							style={{
								position: 'absolute',
								left: BUTTON.left - CARD.left,
								top: BUTTON.top - CARD.top,
								width: BUTTON.width,
								height: BUTTON.height,
								borderRadius: 49,
								background: brand.button,
								color: 'white',
								fontSize: 34,
								fontWeight: 700,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 14,
								boxShadow: `0 16px 34px rgba(255,84,8,0.4), inset 0 2px 2px rgba(255,255,255,0.4), 0 0 0 ${progress(frame, T.send, T.send + 18) * 24}px rgba(255,84,8,${0.35 * (1 - progress(frame, T.send, T.send + 18))})`,
								scale: String(sendPress),
							}}
						>
							{sending ? (
								<>
									<div
										style={{
											width: 36,
											height: 36,
											borderRadius: 18,
											border: '5px solid rgba(255,255,255,0.35)',
											borderTopColor: 'white',
											rotate: `${frame * 15}deg`,
										}}
									/>
									Sending…
								</>
							) : (
								buttonLabel
							)}
						</div>
					</Card>

					{/* iOS 26-style glass menu for the industry select */}
					<div
						style={{
							...glass,
							background: 'linear-gradient(160deg, rgba(255,255,255,0.78) 0%, rgba(255,244,236,0.62) 100%)',
							position: 'absolute',
							left: CARD.left + INPUT.left,
							top: MENU.top,
							width: INPUT.width,
							padding: MENU.pad,
							borderRadius: 44,
							transformOrigin: '50% 100%',
							scale: String(0.6 + menu * 0.4),
							opacity: Math.min(1, menu),
							zIndex: 50,
							boxShadow: '0 40px 80px rgba(150,60,20,0.3), inset 0 2px 2px rgba(255,255,255,0.95)',
						}}
					>
						{INDUSTRIES.map((item, i) => {
							const isPick = item === industry;
							const hl = isPick && frame >= T.option - 6;
							return (
								<div
									key={item}
									style={{
										height: MENU.itemH,
										borderRadius: 30,
										display: 'flex',
										alignItems: 'center',
										padding: '0 28px',
										fontSize: 34,
										fontWeight: hl ? 700 : 500,
										color: hl ? brand.orange : brand.ink,
										backgroundColor: hl ? 'rgba(255,84,8,0.12)' : 'transparent',
										opacity: progress(frame, T.industry + 4 + i * 1.5, T.industry + 12 + i * 1.5),
									}}
								>
									{item}
									{frame >= T.option && isPick ? (
										<svg width="34" height="34" viewBox="0 0 24 24" style={{marginLeft: 'auto'}}>
											<path d="M5 12.5l4.5 4.5L19 7.5" stroke={brand.orange} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
									) : null}
								</div>
							);
						})}
					</div>

					<StatusBar />
					<Keyboard shown={kb} pressed={keyDown} returnLabel="next" />

					<Tap x={380} y={fieldCenterY('name')} at={T.name} />
					<Tap x={420} y={fieldCenterY('company')} at={T.company} />
					<Tap x={360} y={fieldCenterY('email')} at={T.email} />
					<Tap x={400} y={fieldCenterY('phone')} at={T.phone} />
					<Tap x={420} y={FIELD_TOPS.industry + 45} at={T.industry} />
					<Tap x={340} y={MENU.top + MENU.pad + (INDUSTRIES.indexOf(industry) + 0.5) * MENU.itemH} at={T.option} />
					<Tap x={BUTTON.left + BUTTON.width / 2} y={BUTTON.top + BUTTON.height / 2} at={T.send} />
				</Phone>
			</AbsoluteFill>

			<Caption step="3" at={2} until={T.keyboardDown + 8}>
				Add your details
			</Caption>
			<Caption step="4" at={T.keyboardDown + 10} until={T.send - 10}>
				Pick your industry
			</Caption>
			<Caption step="5" at={T.send - 8}>
				Send it
			</Caption>

			<Audio name="Tap name" src={staticFile('tap.wav')} from={T.name - 1} premountFor={fps} />
			<Sequence name="Typing" from={T.name + 4} durationInFrames={T.keyboardDown - T.name - 4} premountFor={fps}>
				<Audio name="Type name" src={staticFile('typing.wav')} durationInFrames={NAME.length * 2} />
				<Audio name="Tap company" src={staticFile('tap.wav')} from={T.company - T.name - 5} />
				<Audio name="Type company" src={staticFile('typing.wav')} from={T.company - T.name} durationInFrames={COMPANY.length * 2} />
				<Audio name="Tap email" src={staticFile('tap.wav')} from={T.email - T.name - 5} />
				<Audio name="Type email" src={staticFile('typing.wav')} from={T.email - T.name} durationInFrames={EMAIL.length * 2} />
				<Audio name="Tap phone" src={staticFile('tap.wav')} from={T.phone - T.name - 5} />
				<Audio name="Type phone" src={staticFile('typing.wav')} from={T.phone - T.name} durationInFrames={PHONE_NO.length * 2} />
			</Sequence>
			<Audio name="Tap industry" src={staticFile('tap.wav')} from={T.industry - 1} premountFor={fps} />
			<Audio name="Tap option" src={staticFile('tap.wav')} from={T.option - 1} premountFor={fps} />
			<Audio name="Tap send" src={staticFile('tap.wav')} from={T.send - 1} premountFor={fps} />
		</AbsoluteFill>
	);
};

const schema = {
	industry: {type: 'text-content', default: 'Healthcare & Doctors', description: 'Industry picked'},
	buttonLabel: {type: 'text-content', default: 'Start a Project', description: 'Send button label'},
} as const satisfies InteractivitySchema;

export const FormScene = Interactive.withSchema({
	Component: FormSceneInner,
	componentName: '<FormScene>',
	schema,
	wrapInSequence: true,
});
