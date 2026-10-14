import {Audio} from '@remotion/media';
import {linearTiming, springTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {AbsoluteFill, interpolate, staticFile, useVideoConfig} from 'remotion';
import {FavoritesScene} from './scenes/FavoritesScene';
import {HungryScene} from './scenes/HungryScene';
import {LogoScene} from './scenes/LogoScene';
import {OrganicScene} from './scenes/OrganicScene';
import {PackScene} from './scenes/PackScene';
import {brand, clamp} from './theme';

// Music is 120 BPM (15 frames per beat). Scenes start on beats; the logo lands on the final hit at 16s.
export const DeliReel: React.FC = () => {
	const {fps, durationInFrames} = useVideoConfig();
	return (
		<AbsoluteFill style={{backgroundColor: brand.cream}}>
			<TransitionSeries>
				<TransitionSeries.Sequence name="Hungry? In a hurry?" durationInFrames={105} premountFor={fps}>
					<HungryScene line1="Hungry?" line2="In a hurry?" />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={slide({direction: 'from-bottom'})} timing={springTiming({config: {damping: 200}, durationInFrames: 15})} />
				<TransitionSeries.Sequence name="Mediterranean Favorites" durationInFrames={135} premountFor={fps}>
					<FavoritesScene line1="Mediterranean" line2="Favorites!" />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
				<TransitionSeries.Sequence name="Organic & olive oil" durationInFrames={135} premountFor={fps}>
					<OrganicScene line1="Organic Ingredients." line2="Olive Oil Goodness." />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={slide({direction: 'from-right'})} timing={springTiming({config: {damping: 200}, durationInFrames: 15})} />
				<TransitionSeries.Sequence name="Pick it. Pack it. Go!" durationInFrames={165} premountFor={fps}>
					<PackScene word1="Pick it." word2="Pack it." word3="Go!" />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={wipe({direction: 'from-left'})} timing={linearTiming({durationInFrames: 15})} />
				<TransitionSeries.Sequence name="Logo" durationInFrames={120} premountFor={fps}>
					<LogoScene deli="DELI" tagline="Fresh. Healthy. On the Go." />
				</TransitionSeries.Sequence>
			</TransitionSeries>
			<Audio
				name="Music"
				src={staticFile('music.wav')}
				premountFor={fps}
				volume={(f) => interpolate(f, [0, 6, durationInFrames - 20, durationInFrames - 1], [0, 0.55, 0.55, 0], clamp)}
			/>
		</AbsoluteFill>
	);
};
