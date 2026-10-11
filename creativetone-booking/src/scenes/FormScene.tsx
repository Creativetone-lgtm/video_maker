import {Audio} from '@remotion/media';
import type React from 'react';
import {
	AbsoluteFill,
	Interactive,
	interpolate,
	Sequence,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
	type InteractivitySchema,
} from 'remotion';
import {Background, BrowserFrame, Caret, Cursor, StepPill} from '../components';
import {clamp, DOMAIN, ease, fontFamily, theme, typed, typingDuration} from '../theme';

type Props = {
	readonly fullName: string;
	readonly email: string;
	readonly phone: string;
	readonly industry: string;
	readonly style?: React.CSSProperties;
};

// Timeline (frames) of the form interaction
const NAME_CLICK = 16;
const NAME_TYPE = 20;
const EMAIL_CLICK = 56;
const EMAIL_TYPE = 60;
const PHONE_CLICK = 112;
const PHONE_TYPE = 116;
const INDUSTRY_CLICK = 160;
const OPTION_CLICK = 194;
const SEND_CLICK = 222;

const INDUSTRIES = ['Real Estate', 'E-commerce', 'Healthcare', 'Hospitality'];

const Field: React.FC<{
	readonly label: string;
	readonly value: string;
	readonly focused: boolean;
	readonly top: number;
	readonly trailing?: React.ReactNode;
}> = ({label, value, focused, top, trailing}) => {
	const filled = value.length > 0;
	return (
		<div
			style={{
				position: 'absolute',
				left: 56,
				right: 56,
				top,
				height: 70,
				borderRadius: 16,
				border: focused ? `2.5px solid ${theme.accent}` : `1.5px solid ${theme.line}`,
				boxShadow: focused ? '0 0 0 6px rgba(255,77,46,0.14)' : 'none',
				backgroundColor: filled || focused ? 'white' : '#FAFAFC',
				display: 'flex',
				alignItems: 'center',
				padding: '0 24px',
			}}
		>
			<div
				style={{
					position: 'absolute',
					left: 24,
					top: filled ? 8 : 22,
					fontSize: filled ? 16 : 24,
					fontWeight: filled ? 700 : 500,
					letterSpacing: filled ? 0.5 : 0,
					textTransform: filled ? 'uppercase' : 'none',
					color: focused ? theme.accent : theme.inkMuted,
				}}
			>
				{label}
			</div>
			<div style={{marginTop: 22, fontSize: 26, fontWeight: 600, color: theme.ink}}>
				{value}
				{focused ? <Caret height={26} /> : null}
			</div>
			<div style={{marginLeft: 'auto'}}>{trailing}</div>
		</div>
	);
};

const FormSceneInner: React.FC<Props> = ({fullName, email, phone, industry, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const focus =
		frame >= SEND_CLICK - 4
			? 'none'
			: frame >= INDUSTRY_CLICK
				? 'industry'
				: frame >= PHONE_CLICK
					? 'phone'
					: frame >= EMAIL_CLICK
						? 'email'
						: frame >= NAME_CLICK
							? 'name'
							: 'none';

	const dropdown = interpolate(
		frame,
		[INDUSTRY_CLICK, INDUSTRY_CLICK + 10, OPTION_CLICK + 2, OPTION_CLICK + 10],
		[0, 1, 1, 0],
		{...clamp, easing: ease},
	);
	const hoverIndex = frame < 177 ? 0 : frame < 186 ? 2 : 1;
	const selected = frame >= OPTION_CLICK ? industry : '';
	const sending = frame >= SEND_CLICK + 4;
	const sendPress = interpolate(frame, [SEND_CLICK - 3, SEND_CLICK, SEND_CLICK + 6], [1, 0.94, 1], clamp);

	return (
		<AbsoluteFill style={{fontFamily, ...style}}>
			<Background />
			<AbsoluteFill
				style={{
					scale: interpolate(frame, [0, 16], [1, 1.15], {...clamp, easing: ease}),
					translate: interpolate(
						frame,
						[0, 16, 44, 56, 102, 112, 148, 160, 202, 218],
						['0px 0px', '0px 171px', '0px 171px', '0px 70px', '0px 70px', '0px -31px', '0px -31px', '0px -132px', '0px -132px', '0px -271px'],
						{...clamp, easing: ease},
					),
				}}
			>
				<BrowserFrame url={<span>{DOMAIN}/book-strategy</span>}>
					<AbsoluteFill style={{background: 'linear-gradient(180deg,#F7F6FB 0%,#FFFFFF 100%)'}}>
						<div
							style={{
								position: 'absolute',
								left: 350,
								top: 30,
								width: 900,
								height: 676,
								borderRadius: 32,
								backgroundColor: 'white',
								boxShadow: '0 30px 80px rgba(20,20,50,0.12), 0 0 0 1px #EEEEF5',
							}}
						>
							<div style={{position: 'absolute', left: 56, top: 44, fontSize: 44, fontWeight: 800, color: theme.ink, letterSpacing: -1.2}}>
								Book your strategy call
							</div>
							<div style={{position: 'absolute', left: 56, top: 104, fontSize: 22, color: theme.inkMuted}}>
								Takes 30 seconds. We&apos;ll call you — no back-and-forth.
							</div>
							<Field label="Full name" value={typed(fullName, frame, NAME_TYPE)} focused={focus === 'name'} top={160} />
							<Field label="Work email" value={typed(email, frame, EMAIL_TYPE)} focused={focus === 'email'} top={248} />
							<Field label="Phone" value={typed(phone, frame, PHONE_TYPE)} focused={focus === 'phone'} top={336} />
							<Field
								label="Industry"
								value={selected}
								focused={focus === 'industry'}
								top={424}
								trailing={
									<div style={{fontSize: 22, color: theme.inkMuted, rotate: `${dropdown * 180}deg`}}>▼</div>
								}
							/>
							<div
								style={{
									position: 'absolute',
									left: 56,
									right: 56,
									top: 540,
									height: 80,
									borderRadius: 18,
									background: theme.gradient,
									color: 'white',
									fontSize: 30,
									fontWeight: 800,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									gap: 16,
									boxShadow: '0 18px 36px rgba(255,46,147,0.3)',
									scale: String(sendPress),
								}}
							>
								{sending ? (
									<>
										<div
											style={{
												width: 30,
												height: 30,
												borderRadius: 15,
												border: '4px solid rgba(255,255,255,0.35)',
												borderTopColor: 'white',
												rotate: `${frame * 14}deg`,
											}}
										/>
										Sending…
									</>
								) : (
									'Send request  ➜'
								)}
							</div>
							{/* Industry dropdown */}
							<div
								style={{
									position: 'absolute',
									left: 56,
									right: 56,
									top: 502,
									padding: 8,
									borderRadius: 18,
									backgroundColor: 'white',
									boxShadow: '0 30px 60px rgba(20,20,50,0.22), 0 0 0 1px #EEEEF5',
									opacity: dropdown,
									translate: `0px ${(1 - dropdown) * -16}px`,
									transformOrigin: 'top center',
									scale: String(0.96 + dropdown * 0.04),
								}}
							>
								{INDUSTRIES.map((item, i) => {
									const hovered = dropdown > 0.5 && i === hoverIndex;
									return (
										<div
											key={item}
											style={{
												height: 58,
												borderRadius: 12,
												display: 'flex',
												alignItems: 'center',
												padding: '0 20px',
												fontSize: 25,
												fontWeight: hovered ? 700 : 500,
												color: hovered ? theme.accent : theme.ink,
												backgroundColor: hovered ? '#FFF1EE' : 'transparent',
											}}
										>
											{item}
										</div>
									);
								})}
							</div>
						</div>
					</AbsoluteFill>
				</BrowserFrame>
				<Cursor
					points={[
						{f: 0, x: 1300, y: 700},
						{f: 14, x: 720, y: 395},
						{f: 44, x: 720, y: 395},
						{f: 54, x: 760, y: 483},
						{f: 102, x: 760, y: 483},
						{f: 110, x: 700, y: 571},
						{f: 148, x: 700, y: 571},
						{f: 158, x: 1250, y: 659},
						{f: 172, x: 800, y: 735},
						{f: 182, x: 810, y: 851},
						{f: 190, x: 800, y: 793},
						{f: 204, x: 800, y: 793},
						{f: 218, x: 960, y: 780},
					]}
					clicks={[NAME_CLICK, EMAIL_CLICK, PHONE_CLICK, INDUSTRY_CLICK, OPTION_CLICK, SEND_CLICK]}
				/>
			</AbsoluteFill>

			<Sequence name="Step 03" durationInFrames={150} premountFor={fps}>
				<StepPill step="STEP 03" label="Tell us who you are" />
			</Sequence>
			<Sequence name="Step 04" from={150} durationInFrames={56} premountFor={fps}>
				<StepPill step="STEP 04" label="Choose your industry" />
			</Sequence>
			<Sequence name="Step 05" from={206} premountFor={fps}>
				<StepPill step="STEP 05" label="Hit send" />
			</Sequence>

			<Audio name="Click name" src={staticFile('click.wav')} from={NAME_CLICK - 1} premountFor={fps} />
			<Audio name="Type name" src={staticFile('typing.wav')} from={NAME_TYPE} durationInFrames={typingDuration(fullName)} premountFor={fps} volume={0.8} />
			<Audio name="Click email" src={staticFile('click.wav')} from={EMAIL_CLICK - 1} premountFor={fps} />
			<Audio name="Type email" src={staticFile('typing.wav')} from={EMAIL_TYPE} durationInFrames={typingDuration(email)} premountFor={fps} volume={0.8} />
			<Audio name="Click phone" src={staticFile('click.wav')} from={PHONE_CLICK - 1} premountFor={fps} />
			<Audio name="Type phone" src={staticFile('typing.wav')} from={PHONE_TYPE} durationInFrames={typingDuration(phone)} premountFor={fps} volume={0.8} />
			<Audio name="Click industry" src={staticFile('click.wav')} from={INDUSTRY_CLICK - 1} premountFor={fps} />
			<Audio name="Click option" src={staticFile('click.wav')} from={OPTION_CLICK - 1} premountFor={fps} />
			<Audio name="Click send" src={staticFile('click.wav')} from={SEND_CLICK - 1} premountFor={fps} />
		</AbsoluteFill>
	);
};

const schema = {
	fullName: {type: 'text-content', default: 'Alex Morgan', description: 'Name typed'},
	email: {type: 'text-content', default: 'alex@brightstudio.co', description: 'Email typed'},
	phone: {type: 'text-content', default: '+1 415 555 0142', description: 'Phone typed'},
	industry: {type: 'text-content', default: 'E-commerce', description: 'Industry selected'},
} as const satisfies InteractivitySchema;

export const FormScene = Interactive.withSchema({
	Component: FormSceneInner,
	componentName: '<FormScene>',
	schema,
	wrapInSequence: true,
});
