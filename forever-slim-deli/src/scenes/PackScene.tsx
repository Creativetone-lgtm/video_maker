import {Audio} from '@remotion/media';
import type React from 'react';
import {AbsoluteFill, Img, Interactive, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig, type InteractivitySchema} from 'remotion';
import {backOut, brand, clamp, expoOut, fontFamily, inOut, pop, progress} from '../theme';
import {Blob, Dish, type DishName} from '../ui';

type Props = {
	readonly word1: string;
	readonly word2: string;
	readonly word3: string;
	readonly style?: React.CSSProperties;
};

const easeIn = (t: number) => t * t * t;

const T = {pick: 4, pack: 46, go: 104, leave: 128};
const ROW_Y = 900;
const BOWL = 300;
const BAG = {x: 540, top: 1150, w: 580, h: 620};

const BOWLS: {name: DishName; x: number; pick: number; lid: number; fly: number}[] = [
	{name: 'hummus', x: 215, pick: 14, lid: 50, fly: 76},
	{name: 'grape-leaves', x: 540, pick: 22, lid: 56, fly: 84},
	{name: 'mtabal', x: 865, pick: 30, lid: 62, fly: 92},
];

const Lid: React.FC<{readonly size: number}> = ({size}) => (
	<div
		style={{
			width: size,
			height: size,
			borderRadius: '50%',
			background: `radial-gradient(circle at 40% 35%, #E3C08F 0%, ${brand.kraft} 60%, ${brand.kraftDark} 100%)`,
			boxShadow: `inset 0 0 0 ${size * 0.05}px rgba(120,80,40,0.35), 0 20px 30px rgba(60,30,0,0.3)`,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		}}
	>
		<div
			style={{
				width: size * 0.62,
				height: size * 0.62,
				borderRadius: '50%',
				backgroundColor: 'white',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: size * 0.02,
			}}
		>
			<Img src={staticFile('logo/wordmark-color.png')} style={{width: size * 0.5}} />
			<div style={{fontFamily, fontWeight: 900, fontSize: size * 0.08, letterSpacing: size * 0.012, color: brand.green}}>DELI</div>
		</div>
	</div>
);

const PackSceneInner: React.FC<Props> = ({word1, word2, word3, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const active = frame >= T.go ? 2 : frame >= T.pack ? 1 : 0;
	const bagIn = interpolate(frame, [64, 82], [0, 1], {...clamp, easing: backOut});
	const squash = BOWLS.reduce((acc, b) => acc + interpolate(frame, [b.fly + 14, b.fly + 17, b.fly + 24], [0, 1, 0], clamp), 0);
	const hop = interpolate(frame, [T.go + 4, T.go + 12, T.go + 20], [0, -90, 0], {...clamp, easing: inOut});
	const leave = progress(frame, T.leave, T.leave + 20, easeIn);
	const bagX = BAG.x + leave * 1300;
	const bagY = BAG.top + (1 - bagIn) * 900 + hop;
	const speed = interpolate(frame, [T.leave - 4, T.leave + 4, T.leave + 22], [0, 1, 0], clamp);

	const words = [word1, word2, word3];

	return (
		<AbsoluteFill style={{fontFamily, background: `linear-gradient(180deg, ${brand.orangeLight} 0%, ${brand.orange} 100%)`, overflow: 'hidden', ...style}}>
			<Blob x={900} y={400} size={900} color="rgba(255,255,255,0.22)" />

			{/* Pick it. Pack it. Go! */}
			<div style={{position: 'absolute', left: 0, right: 0, top: 170, textAlign: 'center'}}>
				{words.map((w, i) => {
					const at = [T.pick, T.pack, T.go][i];
					const p = pop(frame, at, 14);
					return (
						<div
							key={w}
							style={{
								fontSize: i === 2 ? 190 : 150,
								fontWeight: 900,
								fontStyle: 'italic',
								letterSpacing: -5,
								lineHeight: 1.02,
								color: i === active ? 'white' : 'rgba(255,255,255,0.4)',
								opacity: Math.min(1, p * 1.5),
								scale: String(p * (i === active ? 1 : 0.86)),
							}}
						>
							{w}
						</div>
					);
				})}
			</div>

			{/* Speed lines when the bag leaves */}
			{[0, 1, 2, 3, 4].map((k) => (
				<div
					key={k}
					style={{
						position: 'absolute',
						left: bagX - 900 + k * 40,
						top: bagY + 120 + k * 100,
						width: 600 - k * 60,
						height: 14,
						borderRadius: 7,
						backgroundColor: 'rgba(255,255,255,0.75)',
						opacity: speed,
					}}
				/>
			))}

			{/* Bag back (opening) */}
			<div
				style={{
					position: 'absolute',
					left: bagX - BAG.w / 2 + 20,
					top: bagY - 20,
					width: BAG.w - 40,
					height: 80,
					borderRadius: 12,
					backgroundColor: '#8A6034',
					opacity: bagIn,
				}}
			/>

			{/* Bowls: picked, lidded, then dropped into the bag */}
			{BOWLS.map((b) => {
				const picked = interpolate(frame, [b.pick, b.pick + 6, b.pick + 14], [0, -70, 0], {...clamp, easing: inOut});
				const appear = pop(frame, 0 + (b.x / 540) * 3, 16);
				const lid = progress(frame, b.lid, b.lid + 10, expoOut);
				const fly = progress(frame, b.fly, b.fly + 16, inOut);
				const x = interpolate(fly, [0, 1], [b.x, BAG.x]);
				const y = interpolate(fly, [0, 0.5, 1], [ROW_Y, ROW_Y - 180, BAG.top + 260]) + picked;
				const s = interpolate(fly, [0, 1], [1, 0.62]);
				const check = pop(frame, b.pick + 4, 12) * (1 - lid);
				return (
					<div key={b.name} style={{position: 'absolute', left: 0, top: 0, scale: String(appear), opacity: frame > b.fly + 18 ? 0 : 1}}>
						<div style={{position: 'absolute', left: x - BOWL / 2, top: y - BOWL / 2, width: BOWL, height: BOWL, scale: String(s), rotate: `${fly * 25}deg`}}>
							<Dish name={b.name} x={BOWL / 2} y={BOWL / 2} size={BOWL} style={{opacity: lid < 1 ? 1 : 0}} />
							<div style={{position: 'absolute', left: -5, top: -5 - (1 - lid) * 500, opacity: lid > 0 ? 1 : 0, scale: String(1.25 - lid * 0.25)}}>
								<Lid size={BOWL + 10} />
							</div>
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
					</div>
				);
			})}

			{/* Bag front */}
			<div
				style={{
					position: 'absolute',
					left: bagX - BAG.w / 2,
					top: bagY,
					width: BAG.w,
					height: BAG.h,
					transformOrigin: '50% 100%',
					scale: `${1 + squash * 0.04} ${1 - squash * 0.05}`,
					transform: `skewX(${-speed * 12}deg)`,
					opacity: bagIn,
				}}
			>
				{/* handles */}
				<div style={{position: 'absolute', left: 120, top: -150, width: 140, height: 200, border: `16px solid ${brand.kraftDark}`, borderBottom: 'none', borderRadius: '70px 70px 0 0'}} />
				<div style={{position: 'absolute', right: 120, top: -150, width: 140, height: 200, border: `16px solid ${brand.kraftDark}`, borderBottom: 'none', borderRadius: '70px 70px 0 0'}} />
				<div
					style={{
						position: 'absolute',
						inset: 0,
						borderRadius: '10px 10px 24px 24px',
						background: `linear-gradient(90deg, ${brand.kraftDark} 0%, ${brand.kraft} 12%, #D7AC78 50%, ${brand.kraft} 88%, ${brand.kraftDark} 100%)`,
						boxShadow: '0 40px 60px rgba(90,40,0,0.35)',
					}}
				/>
				<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 60, background: 'rgba(120,80,40,0.25)', borderRadius: '10px 10px 0 0'}} />
				<div
					style={{
						position: 'absolute',
						left: 70,
						right: 70,
						top: 150,
						height: 300,
						borderRadius: 28,
						backgroundColor: 'white',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 18,
					}}
				>
					<Img src={staticFile('logo/wordmark-color.png')} style={{width: 360}} />
					<div style={{padding: '8px 34px', borderRadius: 999, backgroundColor: brand.green, color: 'white', fontWeight: 900, fontSize: 48, letterSpacing: 10}}>DELI</div>
				</div>
			</div>

			{BOWLS.map((b) => (
				<Sequence key={b.name} name={`${b.name} sfx`} from={b.pick} premountFor={fps}>
					<Audio name="Pick" src={staticFile('sfx/pop.wav')} volume={0.6} />
					<Audio name="Lid" src={staticFile('sfx/lid.wav')} from={b.lid - b.pick + 6} />
					<Audio name="Into bag" src={staticFile('sfx/bag.wav')} from={b.fly - b.pick + 12} volume={0.8} />
				</Sequence>
			))}
			<Audio name="Bag up" src={staticFile('sfx/whoosh.wav')} from={62} premountFor={fps} volume={0.5} />
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
