import {Composition} from 'remotion';
import {Story} from './Story';
import {S} from './theme';

export const RemotionRoot: React.FC = () => (
	<Composition id="RestaurantStory" component={Story} durationInFrames={S.total} fps={30} width={1080} height={1920} />
);
