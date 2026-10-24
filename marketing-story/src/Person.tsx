import type React from 'react';
import {useCurrentFrame} from 'remotion';
import {c} from './theme';

export type Expression = 'happy' | 'proud' | 'neutral' | 'shock' | 'worried' | 'frustrated' | 'sad' | 'confused' | 'stern' | 'bored';

export type PersonProps = {
	/** Feet position in composition px. */
	readonly x: number;
	readonly y: number;
	readonly scale?: number;
	readonly expression?: Expression;
	readonly shirt?: string;
	readonly apron?: string | null;
	readonly pants?: string;
	readonly hair?: 'curly' | 'short' | 'bun' | 'toque';
	/** Arm raise angles in degrees (0 = hanging down, 90 = straight out, negative = across the body). */
	readonly armL?: number;
	readonly armR?: number;
	/** Walk cycle phase in radians; 0 with walking=false stands still. */
	readonly walking?: boolean;
	readonly walkPhase?: number;
	readonly headTilt?: number;
	readonly bob?: number;
	readonly blinkOffset?: number;
	readonly wallet?: boolean;
	readonly opacity?: number;
	readonly flip?: boolean;
};

const S = 6; // outline width

const Eyes: React.FC<{readonly expression: Expression; readonly blink: boolean}> = ({expression, blink}) => {
	const y = -405;
	const xs = [-32, 32];
	if (expression === 'happy' || expression === 'proud') {
		return (
			<>
				{xs.map((x) => (
					<path key={x} d={`M ${x - 15} ${y + 5} Q ${x} ${y - 13} ${x + 15} ${y + 5}`} stroke={c.line} strokeWidth={6} fill="none" strokeLinecap="round" />
				))}
			</>
		);
	}
	if (expression === 'stern') {
		return (
			<>
				{xs.map((x) => (
					<path key={x} d={`M ${x - 15} ${y} L ${x + 15} ${y}`} stroke={c.line} strokeWidth={6} strokeLinecap="round" />
				))}
			</>
		);
	}
	if (expression === 'shock') {
		return (
			<>
				{xs.map((x) => (
					<g key={x}>
						<circle cx={x} cy={y - 4} r={22} fill="white" stroke={c.line} strokeWidth={5} />
						<circle cx={x} cy={y - 2} r={6.5} fill={c.line} />
					</g>
				))}
			</>
		);
	}
	if (blink) {
		return (
			<>
				{xs.map((x) => (
					<path key={x} d={`M ${x - 10} ${y} L ${x + 10} ${y}`} stroke={c.line} strokeWidth={5} strokeLinecap="round" />
				))}
			</>
		);
	}
	const dy = expression === 'sad' ? 8 : expression === 'bored' ? 4 : 0;
	return (
		<>
			{xs.map((x) => (
				<g key={x}>
					<circle cx={x} cy={y + dy} r={8} fill={c.line} />
					{expression === 'bored' ? <path d={`M ${x - 14} ${y - 4} L ${x + 14} ${y - 4}`} stroke={c.line} strokeWidth={5} strokeLinecap="round" /> : null}
				</g>
			))}
		</>
	);
};

const Brows: React.FC<{readonly expression: Expression}> = ({expression}) => {
	const y = -440;
	const brow = (x1: number, y1: number, x2: number, y2: number, k: string) => (
		<path key={k} d={`M ${x1} ${y1} L ${x2} ${y2}`} stroke={c.line} strokeWidth={6} strokeLinecap="round" />
	);
	switch (expression) {
		case 'proud':
			return <>{[brow(-48, y - 4, -18, y - 10, 'l'), brow(18, y - 10, 48, y - 4, 'r')]}</>;
		case 'shock':
			return <>{[brow(-50, y - 20, -18, y - 26, 'l'), brow(18, y - 26, 50, y - 20, 'r')]}</>;
		case 'worried':
		case 'sad':
			return <>{[brow(-48, y + 2, -18, y - 10, 'l'), brow(18, y - 10, 48, y + 2, 'r')]}</>;
		case 'frustrated':
		case 'stern':
			return <>{[brow(-48, y - 10, -16, y + 4, 'l'), brow(16, y + 4, 48, y - 10, 'r')]}</>;
		case 'confused':
			return <>{[brow(-48, y - 14, -18, y - 20, 'l'), brow(18, y - 2, 48, y + 2, 'r')]}</>;
		default:
			return null;
	}
};

const Mouth: React.FC<{readonly expression: Expression; readonly talk: number}> = ({expression, talk}) => {
	const y = -362;
	switch (expression) {
		case 'happy':
		case 'proud':
			return (
				<g>
					<path d={`M -28 ${y - 6} Q 0 ${y + 30} 28 ${y - 6} Z`} fill="#7A2430" stroke={c.line} strokeWidth={5} strokeLinejoin="round" />
					<path d={`M -12 ${y + 10} Q 0 ${y + 2} 12 ${y + 10} Q 0 ${y + 18} -12 ${y + 10} Z`} fill="#E06A6A" />
				</g>
			);
		case 'shock':
			return <ellipse cx={0} cy={y + 4} rx={14} ry={18 + talk * 4} fill="#7A2430" stroke={c.line} strokeWidth={5} />;
		case 'worried':
			return <path d={`M -20 ${y + 2} Q -10 ${y - 6} 0 ${y + 2} Q 10 ${y + 10} 20 ${y + 2}`} stroke={c.line} strokeWidth={5} fill="none" strokeLinecap="round" />;
		case 'frustrated':
			return (
				<g>
					<rect x={-24} y={y - 8} width={48} height={18 + talk * 6} rx={6} fill="white" stroke={c.line} strokeWidth={5} />
					<path d={`M -24 ${y + 1} L 24 ${y + 1}`} stroke={c.line} strokeWidth={3} />
				</g>
			);
		case 'sad':
			return <path d={`M -22 ${y + 8} Q 0 ${y - 12} 22 ${y + 8}`} stroke={c.line} strokeWidth={6} fill="none" strokeLinecap="round" />;
		case 'confused':
			return <path d={`M -10 ${y + 2} L 22 ${y - 6}`} stroke={c.line} strokeWidth={6} strokeLinecap="round" />;
		case 'stern':
			return <path d={`M -20 ${y} L 20 ${y}`} stroke={c.line} strokeWidth={6} strokeLinecap="round" />;
		case 'bored':
			return <path d={`M -14 ${y + 2} L 14 ${y + 2}`} stroke={c.line} strokeWidth={5} strokeLinecap="round" />;
		default:
			return <path d={`M -18 ${y - 2} Q 0 ${y + 12} 18 ${y - 2}`} stroke={c.line} strokeWidth={6} fill="none" strokeLinecap="round" />;
	}
};

const Hair: React.FC<{readonly hair: PersonProps['hair']}> = ({hair}) => {
	if (hair === 'curly') {
		const curls: [number, number, number][] = [];
		for (let i = 0; i <= 8; i++) {
			const a = Math.PI * (1.08 + (i / 8) * 0.84);
			curls.push([Math.cos(a) * 78, -430 + Math.sin(a) * 78, 26]);
		}
		curls.push([-30, -500, 26], [10, -505, 26], [42, -492, 24], [-10, -478, 22]);
		return (
			<g>
				{curls.map(([x, y, r], i) => (
					<circle key={i} cx={x} cy={y} r={r} fill={c.hair} stroke={c.line} strokeWidth={4} />
				))}
			</g>
		);
	}
	if (hair === 'short' || hair === 'bun') {
		return (
			<g>
				<path d="M -86 -420 Q -84 -512 0 -514 Q 84 -512 86 -420 Q 60 -470 0 -466 Q -60 -470 -86 -420 Z" fill={c.hair} stroke={c.line} strokeWidth={5} strokeLinejoin="round" />
				{hair === 'bun' ? <circle cx={0} cy={-526} r={30} fill={c.hair} stroke={c.line} strokeWidth={5} /> : null}
			</g>
		);
	}
	// chef's toque
	return (
		<g>
			<rect x={-60} y={-500} width={120} height={46} rx={8} fill="white" stroke={c.line} strokeWidth={5} />
			<circle cx={-40} cy={-530} r={36} fill="white" stroke={c.line} strokeWidth={5} />
			<circle cx={40} cy={-530} r={36} fill="white" stroke={c.line} strokeWidth={5} />
			<circle cx={0} cy={-552} r={42} fill="white" stroke={c.line} strokeWidth={5} />
			<rect x={-56} y={-520} width={112} height={50} fill="white" />
		</g>
	);
};

/** A flat 2D cartoon person in the reference style. Origin is at the feet. */
export const Person: React.FC<PersonProps> = ({
	x,
	y,
	scale = 1,
	expression = 'neutral',
	shirt = c.shirt,
	apron = c.burgundy,
	pants = c.pants,
	hair = 'curly',
	armL = 6,
	armR = 6,
	walking = false,
	walkPhase = 0,
	headTilt = 0,
	bob = 0,
	blinkOffset = 0,
	wallet = false,
	opacity = 1,
	flip = false,
}) => {
	const frame = useCurrentFrame();
	const blink = (frame + blinkOffset) % 96 < 4;
	const legSwing = walking ? Math.sin(walkPhase) * 22 : 0;
	const walkBob = walking ? Math.abs(Math.sin(walkPhase)) * -10 : 0;
	const armSwing = walking ? Math.sin(walkPhase) * 18 : 0;
	const talk = Math.abs(Math.sin(frame / 3));

	return (
		<svg
			width={280 * scale}
			height={640 * scale}
			viewBox="-140 -610 280 640"
			style={{
				position: 'absolute',
				left: x - 140 * scale,
				top: y - 610 * scale,
				overflow: 'visible',
				opacity,
				transform: flip ? 'scaleX(-1)' : undefined,
			}}
		>
			<ellipse cx={0} cy={4} rx={86} ry={13} fill="rgba(0,0,0,0.18)" />
			<g transform={`translate(0 ${bob + walkBob})`}>
				{/* Legs */}
				<g transform={`rotate(${legSwing} -19 -150)`}>
					<rect x={-31} y={-152} width={24} height={140} rx={10} fill={pants} stroke={c.line} strokeWidth={S} />
					<ellipse cx={-26} cy={-10} rx={32} ry={15} fill="white" stroke={c.line} strokeWidth={S} />
				</g>
				<g transform={`rotate(${-legSwing} 19 -150)`}>
					<rect x={7} y={-152} width={24} height={140} rx={10} fill={pants} stroke={c.line} strokeWidth={S} />
					<ellipse cx={26} cy={-10} rx={32} ry={15} fill="white" stroke={c.line} strokeWidth={S} />
				</g>
				{/* Body */}
				<rect x={-64} y={-322} width={128} height={186} rx={44} fill={shirt} stroke={c.line} strokeWidth={S} />
				{apron ? (
					<g>
						<path d="M -46 -320 L -36 -298 M 46 -320 L 36 -298" stroke={c.line} strokeWidth={5} />
						<path d="M -36 -300 L 36 -300 L 44 -258 L 58 -152 Q 58 -140 46 -140 L -46 -140 Q -58 -140 -58 -152 L -44 -258 Z" fill={apron} stroke={c.line} strokeWidth={S} strokeLinejoin="round" />
						<rect x={-22} y={-236} width={44} height={30} rx={6} fill="none" stroke={c.line} strokeWidth={4} opacity={0.6} />
					</g>
				) : null}
				{/* Arms */}
				<g transform={`rotate(${armL + armSwing} -58 -300)`}>
					<rect x={-78} y={-300} width={40} height={128} rx={20} fill={shirt} stroke={c.line} strokeWidth={S} />
					<circle cx={-58} cy={-166} r={21} fill="white" stroke={c.line} strokeWidth={S} />
				</g>
				<g transform={`rotate(${-armR - armSwing} 58 -300)`}>
					<rect x={38} y={-300} width={40} height={128} rx={20} fill={shirt} stroke={c.line} strokeWidth={S} />
					<circle cx={58} cy={-166} r={21} fill="white" stroke={c.line} strokeWidth={S} />
				</g>
				{wallet ? (
					<g>
						<rect x={-34} y={-262} width={68} height={48} rx={8} fill="#5B3A26" stroke={c.line} strokeWidth={5} />
						<rect x={-34} y={-250} width={68} height={10} fill="#7A5236" />
						<circle cx={-30} cy={-238} r={20} fill="white" stroke={c.line} strokeWidth={5} />
						<circle cx={30} cy={-238} r={20} fill="white" stroke={c.line} strokeWidth={5} />
					</g>
				) : null}
				{/* Head */}
				<g transform={`rotate(${headTilt} 0 -330)`}>
					<circle cx={0} cy={-415} r={88} fill={c.skin} stroke={c.line} strokeWidth={S} />
					<path d="M -70 -380 Q 0 -310 70 -380 Q 0 -340 -70 -380 Z" fill="rgba(0,0,0,0.05)" />
					<Hair hair={hair} />
					<Brows expression={expression} />
					<Eyes expression={expression} blink={blink} />
					<Mouth expression={expression} talk={talk} />
				</g>
			</g>
		</svg>
	);
};
