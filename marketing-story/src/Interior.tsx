import type React from 'react';
import {AbsoluteFill} from 'remotion';
import {c, fontFamily} from './theme';

const L = 6;

/** Scale-in wrapper for an item that "magically" appears (0..1). */
const Appear: React.FC<{readonly p: number; readonly ox: number; readonly oy: number; readonly children: React.ReactNode}> = ({p, ox, oy, children}) =>
	p <= 0 ? null : (
		<g transform={`translate(${ox} ${oy}) scale(${p}) translate(${-ox} ${-oy})`} opacity={Math.min(1, p * 2)}>
			{children}
		</g>
	);

export type InteriorProps = {
	/** 0..1 progress for each decor item: [wall, lamps, picture, table, plants] */
	readonly decor?: readonly number[];
	/** 0..1 progress for each kitchen item: [hood, stove, fridge] */
	readonly kitchen?: readonly number[];
	readonly counter?: number;
	readonly clock?: number;
	/** Clock hand angle (degrees) */
	readonly clockAngle?: number;
	readonly lampsOn?: number;
	readonly tumbleweed?: number;
	readonly steam?: number;
	readonly frame: number;
	readonly children?: React.ReactNode;
	/** Elements drawn in front of the characters (counter front). */
	readonly front?: React.ReactNode;
};

const Lamp: React.FC<{readonly x: number; readonly on: number}> = ({x, on}) => (
	<g>
		<line x1={x} y1={60} x2={x} y2={210} stroke={c.line} strokeWidth={5} />
		<path d={`M ${x - 60} 270 L ${x + 60} 270 L ${x + 32} 210 L ${x - 32} 210 Z`} fill={c.burgundy} stroke={c.line} strokeWidth={L} strokeLinejoin="round" />
		<ellipse cx={x} cy={270} rx={60} ry={10} fill={c.line} />
		<ellipse cx={x} cy={290} rx={110} ry={50} fill="#FFD98A" opacity={on * 0.35} />
	</g>
);

/** Inside the restaurant, side view like a management sim (1080×1920). */
export const Interior: React.FC<InteriorProps> = ({
	decor = [0, 0, 0, 0, 0],
	kitchen = [0, 0, 0],
	counter = 0,
	clock = 0,
	clockAngle = 0,
	lampsOn = 1,
	tumbleweed = -1,
	steam = 0,
	frame,
	children,
	front,
}) => {
	const [wall, lamps, picture, table, plants] = decor;
	const [hood, stove, fridge] = kitchen;
	return (
		<AbsoluteFill style={{backgroundColor: '#4A3A33', overflow: 'hidden'}}>
			<svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
				{/* Bare wall → decorated wall */}
				<rect x={0} y={0} width={1080} height={1250} fill="#CFC6B8" />
				<rect x={0} y={0} width={1080} height={1250} fill={c.facade} opacity={wall} />
				<g opacity={wall}>
					<rect x={0} y={900} width={1080} height={350} fill={c.burgundy} />
					<rect x={0} y={890} width={1080} height={22} fill={c.woodDark} stroke={c.line} strokeWidth={L} />
					{new Array(12).fill(true).map((_, i) => (
						<path key={i} d={`M ${i * 96} 960 l 48 -30 l 48 30 l -48 30 Z`} fill="none" stroke={c.cream} strokeWidth={4} opacity={0.5} />
					))}
				</g>
				<g opacity={1 - wall}>
					<path d="M 820 200 l 30 60 l -20 40 l 40 70" stroke="#A89F92" strokeWidth={5} fill="none" />
					<line x1={540} y1={60} x2={540} y2={240} stroke={c.line} strokeWidth={4} />
					<circle cx={540} cy={258} r={20} fill="#FFF3C4" stroke={c.line} strokeWidth={4} />
				</g>

				{/* Window to the street */}
				<rect x={60} y={330} width={320} height={380} fill="#BFD7E6" stroke={c.line} strokeWidth={L} />
				<rect x={60} y={560} width={320} height={150} fill={c.facade2} />
				<rect x={60} y={660} width={320} height={50} fill={c.sidewalk} />
				{tumbleweed >= 0 ? (
					<g transform={`translate(${60 + tumbleweed * 380} 650) rotate(${tumbleweed * 720})`}>
						<circle r={26} fill="none" stroke="#B08A5A" strokeWidth={5} />
						<path d="M -20 -10 Q 0 20 20 -12 M -18 12 Q 0 -20 22 10" stroke="#B08A5A" strokeWidth={4} fill="none" />
					</g>
				) : null}
				<rect x={60} y={330} width={320} height={380} fill="none" stroke={c.line} strokeWidth={L} />
				<line x1={220} y1={330} x2={220} y2={710} stroke={c.line} strokeWidth={L} />
				<rect x={40} y={710} width={360} height={22} fill={c.woodDark} stroke={c.line} strokeWidth={L} />

				{/* Ceiling beam */}
				<rect x={0} y={0} width={1080} height={60} fill={c.woodDark} stroke={c.line} strokeWidth={L} />

				{/* Decor */}
				<Appear p={lamps} ox={420} oy={60}>
					<Lamp x={300} on={lampsOn} />
					<Lamp x={540} on={lampsOn} />
				</Appear>
				<Appear p={picture} ox={545} oy={450}>
					<rect x={450} y={350} width={190} height={200} fill={c.cream} stroke={c.line} strokeWidth={L} />
					<rect x={468} y={368} width={154} height={164} fill="#9CC3D9" stroke={c.line} strokeWidth={4} />
					<path d="M 545 390 L 505 460 L 525 460 L 495 510 L 595 510 L 565 460 L 585 460 Z" fill={c.green} stroke={c.line} strokeWidth={4} />
				</Appear>
				<Appear p={plants} ox={60} oy={1250}>
					<rect x={20} y={1150} width={80} height={100} rx={10} fill="#B5643C" stroke={c.line} strokeWidth={L} />
					{[
						[40, 1110],
						[80, 1100],
						[60, 1070],
					].map(([x, y]) => (
						<ellipse key={`${x}-${y}`} cx={x} cy={y} rx={30} ry={46} fill="#5E8C4A" stroke={c.line} strokeWidth={5} />
					))}
				</Appear>
				<Appear p={table} ox={480} oy={1250}>
					<rect x={360} y={1090} width={240} height={22} rx={6} fill={c.cream} stroke={c.line} strokeWidth={L} />
					<rect x={380} y={1112} width={16} height={130} fill={c.woodDark} stroke={c.line} strokeWidth={4} />
					<rect x={564} y={1112} width={16} height={130} fill={c.woodDark} stroke={c.line} strokeWidth={4} />
					<rect x={462} y={1040} width={36} height={50} rx={10} fill="#7FB3D5" stroke={c.line} strokeWidth={4} />
					<circle cx={480} cy={1030} r={16} fill={c.red} stroke={c.line} strokeWidth={4} />
					{[320, 640].map((x) => (
						<g key={x}>
							<rect x={x - 20} y={1040} width={14} height={200} fill={c.woodDark} stroke={c.line} strokeWidth={4} transform={x > 400 ? `translate(26 0)` : undefined} />
							<rect x={x - 26} y={1160} width={66} height={14} fill={c.woodDark} stroke={c.line} strokeWidth={4} />
							<rect x={x - 26} y={1174} width={12} height={70} fill={c.woodDark} />
							<rect x={x + 28} y={1174} width={12} height={70} fill={c.woodDark} />
						</g>
					))}
				</Appear>

				{/* Kitchen */}
				<Appear p={hood} ox={790} oy={700}>
					<path d="M 700 800 L 880 800 L 850 720 L 730 720 Z" fill="#C9CDD1" stroke={c.line} strokeWidth={L} strokeLinejoin="round" />
					<rect x={770} y={640} width={40} height={80} fill="#C9CDD1" stroke={c.line} strokeWidth={L} />
				</Appear>
				<Appear p={stove} ox={790} oy={1250}>
					<rect x={690} y={1010} width={200} height={240} rx={8} fill="#4E5660" stroke={c.line} strokeWidth={L} />
					<rect x={710} y={1080} width={160} height={110} rx={10} fill="#2B3036" stroke={c.line} strokeWidth={4} />
					<rect x={730} y={1095} width={120} height={60} rx={8} fill="#E88B3A" opacity={0.5} />
					{[725, 765, 805, 845].map((x) => (
						<circle key={x} cx={x} cy={1045} r={9} fill={c.cream} stroke={c.line} strokeWidth={3} />
					))}
					<rect x={710} y={960} width={70} height={50} rx={8} fill="#9AA3AD" stroke={c.line} strokeWidth={L} />
					<rect x={800} y={975} width={70} height={35} rx={8} fill="#9AA3AD" stroke={c.line} strokeWidth={L} />
					{steam > 0
						? [0, 1, 2].map((k) => (
								<path
									key={k}
									d={`M ${730 + k * 16} ${950 - ((frame * 2 + k * 20) % 60)} q 10 -15 0 -30 q -10 -15 0 -30`}
									stroke="white"
									strokeWidth={6}
									fill="none"
									strokeLinecap="round"
									opacity={steam * 0.7}
								/>
							))
						: null}
				</Appear>
				<Appear p={fridge} ox={980} oy={1250}>
					<rect x={905} y={700} width={160} height={550} rx={14} fill="#DDE2E6" stroke={c.line} strokeWidth={L} />
					<line x1={905} y1={900} x2={1065} y2={900} stroke={c.line} strokeWidth={L} />
					<rect x={925} y={780} width={14} height={90} rx={7} fill={c.line} />
					<rect x={925} y={930} width={14} height={120} rx={7} fill={c.line} />
				</Appear>

				{/* Wall clock */}
				{clock > 0 ? (
					<g transform={`translate(925 470) scale(${clock})`}>
						<circle r={86} fill="white" stroke={c.line} strokeWidth={8} />
						{new Array(12).fill(true).map((_, i) => (
							<rect key={i} x={-3} y={-76} width={6} height={i % 3 === 0 ? 16 : 9} fill={c.line} transform={`rotate(${i * 30})`} />
						))}
						<rect x={-4} y={-64} width={8} height={68} rx={4} fill={c.burgundy} transform={`rotate(${clockAngle})`} />
						<rect x={-5} y={-44} width={10} height={48} rx={5} fill={c.line} transform={`rotate(${clockAngle / 12})`} />
						<circle r={9} fill={c.line} />
					</g>
				) : null}

				{/* Floor */}
				<rect x={0} y={1250} width={1080} height={110} fill={c.wood} stroke={c.line} strokeWidth={L} />
				{new Array(9).fill(true).map((_, i) => (
					<line key={i} x1={i * 130 + 60} y1={1250} x2={i * 130 + 60} y2={1360} stroke={c.woodDark} strokeWidth={4} />
				))}
				<rect x={0} y={1360} width={1080} height={20} fill={c.woodDark} />
			</svg>
			{children}
			{/* Counter (in front of the characters) */}
			{counter > 0 ? (
				<svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
					<g transform={`translate(0 ${(1 - counter) * 400})`} opacity={counter}>
						<rect x={30} y={1040} width={360} height={210} rx={10} fill={c.burgundy} stroke={c.line} strokeWidth={L} />
						<rect x={20} y={1020} width={380} height={30} rx={8} fill={c.woodDark} stroke={c.line} strokeWidth={L} />
						<rect x={60} y={1080} width={300} height={10} fill={c.cream} opacity={0.6} />
						<rect x={260} y={950} width={110} height={70} rx={10} fill="#4E5660" stroke={c.line} strokeWidth={L} />
						<rect x={275} y={962} width={80} height={26} rx={4} fill={c.money} stroke={c.line} strokeWidth={3} />
						<text x={315} y={983} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={20} fill={c.line}>
							0
						</text>
					</g>
				</svg>
			) : null}
			{front}
		</AbsoluteFill>
	);
};
