import {Audio} from '@remotion/media';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {AbsoluteFill, interpolate, staticFile, useVideoConfig} from 'remotion';
import {BrowseScene} from './scenes/BrowseScene';
import {CallScene} from './scenes/CallScene';
import {FormScene} from './scenes/FormScene';
import {HookScene} from './scenes/HookScene';
import {OutroScene} from './scenes/OutroScene';
import {SafariScene} from './scenes/SafariScene';
import {SentScene} from './scenes/SentScene';
import {brand, clamp} from './theme';

// Music is 120 BPM: 15 frames per beat, 60 per bar. Scene cuts land on beats.
const CALL_START = 720;
const RING_END = CALL_START + 108;

export const BookingReel: React.FC = () => {
	const {fps, durationInFrames} = useVideoConfig();

	return (
		<AbsoluteFill style={{backgroundColor: brand.peach}}>
			<TransitionSeries>
				<TransitionSeries.Sequence name="Hook" durationInFrames={105} premountFor={fps}>
					<HookScene message1="Hi, can you help me?" message2="Hello??" headline="There’s a faster way." highlight="faster" />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
				<TransitionSeries.Sequence name="Type domain" durationInFrames={150} premountFor={fps}>
					<SafariScene domain="creativetoneagency.com" caption="Type our website" />
				</TransitionSeries.Sequence>
				<TransitionSeries.Sequence name="Book a Strategy Call" durationInFrames={150} premountFor={fps}>
					<BrowseScene tapCaption="Tap “Book a Strategy Call”" scrollCaption="Straight to the form" />
				</TransitionSeries.Sequence>
				<TransitionSeries.Sequence name="Fill the form" durationInFrames={240} premountFor={fps}>
					<FormScene industry="Healthcare & Doctors" buttonLabel="Start a Project" />
				</TransitionSeries.Sequence>
				<TransitionSeries.Sequence name="Sent" durationInFrames={90} premountFor={fps}>
					<SentScene title="Request sent!" subtitle="We’ll be ready for your call." industry="Healthcare & Doctors" caption="Sent. That’s it." />
				</TransitionSeries.Sequence>
				<TransitionSeries.Sequence name="Incoming call" durationInFrames={150} premountFor={fps}>
					<CallScene callerName="CreativeTone" subtitle="Strategy call" caption="Then… we call you." />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
				<TransitionSeries.Sequence name="Outro" durationInFrames={165} premountFor={fps}>
					<OutroScene
						oldWay="Hi, can you help me?"
						line1="Just book."
						line2="We’ll be ready"
						line3="for the call."
						domain="creativetoneagency.com"
						ctaLabel="Book a Strategy Call"
					/>
				</TransitionSeries.Sequence>
			</TransitionSeries>

			<Audio
				name="Music"
				src={staticFile('music.wav')}
				premountFor={fps}
				volume={(f) =>
					interpolate(
						f,
						[0, 10, CALL_START, CALL_START + 8, RING_END, RING_END + 10, durationInFrames - 24, durationInFrames - 1],
						[0, 0.55, 0.55, 0.2, 0.2, 0.55, 0.55, 0],
						clamp,
					)
				}
			/>
		</AbsoluteFill>
	);
};
