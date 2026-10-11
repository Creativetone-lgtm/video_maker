import {Composition, Folder} from 'remotion';
import {BookingJourney} from './BookingJourney';
import {CallScene} from './scenes/CallScene';
import {DomainScene} from './scenes/DomainScene';
import {FormScene} from './scenes/FormScene';
import {HomeScene} from './scenes/HomeScene';
import {OutroScene} from './scenes/OutroScene';
import {SentScene} from './scenes/SentScene';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="BookingJourney"
				component={BookingJourney}
				durationInFrames={840}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Folder name="Scenes">
				<Composition
					id="DomainScene"
					component={DomainScene}
					durationInFrames={135}
					fps={30}
					width={1920}
					height={1080}
					defaultProps={{domain: 'creativetoneagency.com', stepLabel: 'Type our domain'}}
				/>
				<Composition
					id="HomeScene"
					component={HomeScene}
					durationInFrames={120}
					fps={30}
					width={1920}
					height={1080}
					defaultProps={{headline: 'Creative that\ngrows brands.', ctaLabel: 'Book Strategy', stepLabel: 'Click “Book Strategy”'}}
				/>
				<Composition
					id="FormScene"
					component={FormScene}
					durationInFrames={270}
					fps={30}
					width={1920}
					height={1080}
					defaultProps={{fullName: 'Alex Morgan', email: 'alex@brightstudio.co', phone: '+1 415 555 0142', industry: 'E-commerce'}}
				/>
				<Composition
					id="SentScene"
					component={SentScene}
					durationInFrames={90}
					fps={30}
					width={1920}
					height={1080}
					defaultProps={{title: 'Request sent!', subtitle: 'Sit tight, Alex — we’re getting ready for your call.'}}
				/>
				<Composition
					id="CallScene"
					component={CallScene}
					durationInFrames={150}
					fps={30}
					width={1920}
					height={1080}
					defaultProps={{callerName: 'Creativetone', headline: 'Creativetone\nis calling.'}}
				/>
				<Composition
					id="OutroScene"
					component={OutroScene}
					durationInFrames={150}
					fps={30}
					width={1920}
					height={1080}
					defaultProps={{
						oldWay: '“Hi, can you help me?”',
						line1: 'Just book.',
						line2: 'We’ll be ready for the call.',
						domain: 'creativetoneagency.com',
						ctaLabel: 'Book Strategy',
					}}
				/>
			</Folder>
		</>
	);
};
