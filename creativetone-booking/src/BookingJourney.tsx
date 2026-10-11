import {Audio} from '@remotion/media';
import {linearTiming, springTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {AbsoluteFill, staticFile, useVideoConfig} from 'remotion';
import {CallScene} from './scenes/CallScene';
import {DomainScene} from './scenes/DomainScene';
import {FormScene} from './scenes/FormScene';
import {HomeScene} from './scenes/HomeScene';
import {OutroScene} from './scenes/OutroScene';
import {SentScene} from './scenes/SentScene';
import {theme} from './theme';

export const BookingJourney: React.FC = () => {
	const {fps} = useVideoConfig();

	return (
		<AbsoluteFill style={{backgroundColor: theme.bg}}>
			<TransitionSeries>
				<TransitionSeries.Sequence name="Type domain" durationInFrames={135} premountFor={fps}>
					<DomainScene domain="creativetoneagency.com" stepLabel="Type our domain" />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
				<TransitionSeries.Sequence name="Homepage" durationInFrames={120} premountFor={fps}>
					<HomeScene headline={'Creative that\ngrows brands.'} ctaLabel="Book Strategy" stepLabel="Click “Book Strategy”" />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition
					presentation={slide({direction: 'from-right'})}
					timing={springTiming({config: {damping: 200}, durationInFrames: 15})}
				/>
				<TransitionSeries.Sequence name="Booking form" durationInFrames={270} premountFor={fps}>
					<FormScene fullName="Alex Morgan" email="alex@brightstudio.co" phone="+1 415 555 0142" industry="E-commerce" />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
				<TransitionSeries.Sequence name="Sent" durationInFrames={90} premountFor={fps}>
					<SentScene title="Request sent!" subtitle="Sit tight, Alex — we’re getting ready for your call." />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition
					presentation={slide({direction: 'from-bottom'})}
					timing={springTiming({config: {damping: 200}, durationInFrames: 15})}
				/>
				<TransitionSeries.Sequence name="Incoming call" durationInFrames={150} premountFor={fps}>
					<CallScene callerName="Creativetone" headline={'Creativetone\nis calling.'} />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
				<TransitionSeries.Sequence name="Outro" durationInFrames={150} premountFor={fps}>
					<OutroScene
						oldWay="“Hi, can you help me?”"
						line1="Just book."
						line2="We’ll be ready for the call."
						domain="creativetoneagency.com"
						ctaLabel="Book Strategy"
					/>
				</TransitionSeries.Sequence>
			</TransitionSeries>

			<Audio name="Whoosh → Homepage" src={staticFile('whoosh.wav')} from={116} premountFor={fps} volume={0.6} />
			<Audio name="Whoosh → Form" src={staticFile('whoosh.wav')} from={221} premountFor={fps} volume={0.6} />
			<Audio name="Whoosh → Call" src={staticFile('whoosh.wav')} from={551} premountFor={fps} volume={0.6} />
			<Audio name="Whoosh → Outro" src={staticFile('whoosh.wav')} from={686} premountFor={fps} volume={0.6} />
		</AbsoluteFill>
	);
};
