import {Composition, Folder, Still} from 'remotion';
import {BookingReel} from './BookingReel';
import {ReelCover} from './ReelCover';
import {BrowseScene} from './scenes/BrowseScene';
import {CallScene} from './scenes/CallScene';
import {FormScene} from './scenes/FormScene';
import {HookScene} from './scenes/HookScene';
import {OutroScene} from './scenes/OutroScene';
import {SafariScene} from './scenes/SafariScene';
import {SentScene} from './scenes/SentScene';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition id="BookingReel" component={BookingReel} durationInFrames={1020} fps={30} width={1080} height={1920} />
			<Folder name="Covers">
				<Still id="CoverPhone" component={ReelCover} width={1080} height={1920} defaultProps={{variant: 'phone' as const, line1: 'Just book.', line2: 'We’ll call you.'}} />
				<Still id="CoverOrange" component={ReelCover} width={1080} height={1920} defaultProps={{variant: 'orange' as const, line1: 'Just book.', line2: 'We’ll call you.'}} />
				<Still id="CoverDark" component={ReelCover} width={1080} height={1920} defaultProps={{variant: 'dark' as const, line1: 'Just book.', line2: 'We’ll call you.'}} />
			</Folder>
			<Folder name="Scenes">
				<Composition
					id="HookScene"
					component={HookScene}
					durationInFrames={105}
					fps={30}
					width={1080}
					height={1920}
					defaultProps={{message1: 'Hi, can you help me?', message2: 'Hello??', headline: 'There’s a faster way.', highlight: 'faster'}}
				/>
				<Composition
					id="SafariScene"
					component={SafariScene}
					durationInFrames={150}
					fps={30}
					width={1080}
					height={1920}
					defaultProps={{domain: 'creativetoneagency.com', caption: 'Type our website'}}
				/>
				<Composition
					id="BrowseScene"
					component={BrowseScene}
					durationInFrames={150}
					fps={30}
					width={1080}
					height={1920}
					defaultProps={{tapCaption: 'Tap “Book a Strategy Call”', scrollCaption: 'Straight to the form'}}
				/>
				<Composition
					id="FormScene"
					component={FormScene}
					durationInFrames={240}
					fps={30}
					width={1080}
					height={1920}
					defaultProps={{industry: 'Healthcare & Doctors', buttonLabel: 'Start a Project'}}
				/>
				<Composition
					id="SentScene"
					component={SentScene}
					durationInFrames={90}
					fps={30}
					width={1080}
					height={1920}
					defaultProps={{title: 'Request sent!', subtitle: 'We’ll be ready for your call.', industry: 'Healthcare & Doctors', caption: 'Sent. That’s it.'}}
				/>
				<Composition
					id="CallScene"
					component={CallScene}
					durationInFrames={150}
					fps={30}
					width={1080}
					height={1920}
					defaultProps={{callerName: 'CreativeTone', subtitle: 'Strategy call', caption: 'Then… we call you.'}}
				/>
				<Composition
					id="OutroScene"
					component={OutroScene}
					durationInFrames={165}
					fps={30}
					width={1080}
					height={1920}
					defaultProps={{
						oldWay: 'Hi, can you help me?',
						line1: 'Just book.',
						line2: 'We’ll be ready',
						line3: 'for the call.',
						ctaLabel: 'Book a Strategy Call',
					}}
				/>
			</Folder>
		</>
	);
};
