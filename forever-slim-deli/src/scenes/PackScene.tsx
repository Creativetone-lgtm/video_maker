import {Audio} from '@remotion/media';
import type React from 'react';
import {AbsoluteFill, Img, Interactive, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig, type InteractivitySchema} from 'remotion';
import {backOut, brand, clamp, fontFamily, inOut, pop, progress} from '../theme';
import {Dish, type DishName, KineticText} from '../ui';

type Props = {
	readonly word1: string;
	readonly word2: string;
	readonly word3: string;
	readonly style?: React.CSSProperties;
};

const easeIn = (t: number) => t * t * t;

const T = {pick: 4, pack: 44, go: 104, leave: 128};
const ROW_Y = 830;
const BOWL = 300;

// The bag photo is 879×1151; its front rim dips from ~5% (edges) to ~12% (centre) of its height.
const BAG = {x: 540, top: 1060, w: 580, h: (580 * 1151) / 879};
const FRONT_CLIP = 'polygon(0% 5.5%, 25% 9.5%, 50% 12.5%, 75% 9.5%, 100% 5%, 100% 100%, 0% 100%)';

const BOWLS: {name: DishName; x: number; pick: number; fly: number}[] = [
	{name: 'hummus', x: 215, pick: 12, fly: 70},
	{name: 'grape-leaves', x: 540, pick: 20, fly: 80},
	{name: 'mtabal', x: 865, pick: 28, fly: 90},
];

const PackSceneInner: React.FC<Props> = ({word1, word2, word3, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const bagIn = interpolate(frame, [T.pack, T.pack + 18], [0, 1], {...clamp, easing: backOut});
	const squash = BOWLS.reduce((acc, b) => acc + interpolate(frame, [b.fly + 13, b.fly + 16, b.fly + 24], [0, 1, 0], clamp), 0);
	const hop = interpolate(frame, [T.go + 4, T.go + 12, T.go + 20], [0, -90, 0], {...clamp, easing: inOut});
	const leave = progress(frame, T.leave, T.leave + 20, easeIn);
	const bagX = BAG.x + leave * 1300;
	const bagY = BAG.top + (1 - bagIn) * 1000 + hop;
	const speed = interpolate(frame, [T.leave - 4, T.leave + 4, T.leave + 22], [0, 1, 0], clamp);

	const bagStyle = (clip?: string): React.CSSProperties => ({
		position: 'absolute',
		left: bagX - BAG.w / 2,
		top: bagY,
		width: BAG.w,
		height: BAG.h,
		transformOrigin: '50% 100%',
		scale: `${1 + squash * 0.04} ${1 - squash * 0.05}`,
		transform: `skewX(${-speed * 12}deg)`,
		clipPath: clip,
	});

	return (
		<AbsoluteFill style={{fontFamily, backgroundColor: brand.orange, overflow: 'hidden', ...style}}>
			<KineticText
				at={T.pick}
				top={150}
				lines={[
					{text: word1, color: 'white', size: 140, italic: true},
					{text: word2, color: 'white', size: 140, italic: true, at: T.pack},
					{text: word3, color: brand.orange, size: 180, italic: true, block: 'white', at: T.go},
				]}
			/>

			{/* Speed lines when the bag leaves */}
			{[0, 1, 2, 3, 4].map((k) => (
				<div
					key={k}
					style={{
						position: 'absolute',
						left: bagX - 900 + k * 40,
						top: bagY + 200 + k * 110,
						width: 600 - k * 60,
						height: 14,
						borderRadius: 7,
						backgroundColor: 'white',
						opacity: speed,
					}}
				/>
			))}

			{/* Bag (whole photo shows the inside back wall) */}
			<Img src={staticFile('bag.png')} style={{...bagStyle(), filter: 'drop-shadow(0 40px 40px rgba(90,30,0,0.35))'}} />

			{/* The real bowls: picked, then dropped into the bag */}
			{BOWLS.map((b) => {
				const appear = pop(frame, b.pick - 10, 14);
				const picked = interpolate(frame, [b.pick, b.pick + 6, b.pick + 14], [0, -70, 0], {...clamp, easing: inOut});
				const fly = progress(frame, b.fly, b.fly + 16, inOut);
				const x = interpolate(fly, [0, 1], [b.x, BAG.x]);
				const y = interpolate(fly, [0, 0.5, 1], [ROW_Y, ROW_Y - 160, BAG.top + 230]) + picked;
				const s = interpolate(fly, [0, 1], [1, 0.62]) * appear;
				const check = pop(frame, b.pick + 4, 12) * (1 - fly);
				if (frame > b.fly + 18) return null;
				return (
					<div key={b.name} style={{position: 'absolute', left: x - BOWL / 2, top: y - BOWL / 2, width: BOWL, height: BOWL, scale: String(s), rotate: `${fly * 25}deg`}}>
						<Dish name={b.name} x={BOWL / 2} y={BOWL / 2} size={BOWL} />
						<div
							style={{
								position: 'absolute',
								right: 0,
								top: 0,
								width: 90,
								height: 90,
								borderRadius: 45,
								backgroundColor: brand.green,
								border: '6px solid white',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								scale: String(check),
							}}
						>
							<svg width="46" height="46" viewBox="0 0 24 24">
								<path d="M5 12.5l4.5 4.5L19 7.5" stroke="white" strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</div>
					</div>
				);
			})}

			{/* Bag front panel, drawn over the bowls so they drop inside */}
			<Img src={staticFile('bag.png')} style={bagStyle(FRONT_CLIP)} />

			{BOWLS.map((b) => (
				<Sequence key={b.name} name={`${b.name} sfx`} from={b.pick} premountFor={fps}>
					<Audio name="Pick" src={staticFile('sfx/pop.wav')} volume={0.6} />
					<Audio name="Into bag" src={staticFile('sfx/bag.wav')} from={b.fly - b.pick + 12} volume={0.8} />
				</Sequence>
			))}
			<Audio name="Bag up" src={staticFile('sfx/whoosh.wav')} from={T.pack - 2} premountFor={fps} volume={0.5} />
			<Audio name="Go!" src={staticFile('sfx/pop.wav')} from={T.go} premountFor={fps} />
			<Audio name="Bag leaves" src={staticFile('sfx/whoosh.wav')} from={T.leave - 2} premountFor={fps} volume={0.9} />
		</AbsoluteFill>
	);
};

const schema = {
	word1: {type: 'text-content', default: 'Pick it.', description: 'Word 1'},
	word2: {type: 'text-content', default: 'Pack it.', description: 'Word 2'},
	word3: {type: 'text-content', default: 'Go!', description: 'Word 3'},
} as const satisfies InteractivitySchema;

export const PackScene = Interactive.withSchema({Component: PackSceneInner, componentName: '<PackScene>', schema, wrapInSequence: true});
