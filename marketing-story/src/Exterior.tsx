import type React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {c, fontFamily} from './theme';

const L = 6;

const Window: React.FC<{readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly lit: number; readonly balcony?: boolean; readonly shutters?: boolean}> = ({
	x,
	y,
	w,
	h,
	lit,
	balcony = false,
	shutters = true,
}) => (
	<g>
		{shutters ? (
			<>
				<rect x={x - w * 0.32} y={y} width={w * 0.3} height={h} fill={c.shutter} stroke={c.line} strokeWidth={L} />
				{[0.2, 0.4, 0.6, 0.8].map((k) => (
					<line key={k} x1={x - w * 0.32} x2={x - w * 0.02} y1={y + h * k} y2={y + h * k} stroke={c.line} strokeWidth={3} opacity={0.5} />
				))}
			</>
		) : null}
		<rect x={x} y={y} width={w} height={h} fill={c.window} stroke={c.line} strokeWidth={L} />
		<rect x={x} y={y} width={w} height={h} fill={c.windowLit} opacity={lit} />
		<line x1={x + w / 2} x2={x + w / 2} y1={y} y2={y + h} stroke={c.line} strokeWidth={L} />
		{balcony ? (
			<g>
				<rect x={x - 30} y={y + h - 70} width={w + 60} height={12} fill={c.line} />
				{new Array(9).fill(true).map((_, i) => (
					<rect key={i} x={x - 24 + (i * (w + 48)) / 8} y={y + h - 70} width={6} height={70} fill={c.line} />
				))}
				<rect x={x - 40} y={y + h} width={w + 80} height={16} fill={c.facadeLight} stroke={c.line} strokeWidth={L} />
			</g>
		) : null}
	</g>
);

const Bricks: React.FC = () => (
	<g>
		{new Array(40).fill(true).map((_, i) => (
			<rect
				key={i}
				x={random(`bx${i}`) * 1040}
				y={random(`by${i}`) * 1180}
				width={40 + random(`bw${i}`) * 30}
				height={12}
				rx={6}
				fill={random(`bc${i}`) > 0.5 ? c.facadeLight : c.facadeDark}
				opacity={0.6}
			/>
		))}
	</g>
);

const Flag: React.FC<{readonly wave: number}> = ({wave}) => (
	<g>
		<line x1={770} y1={350} x2={770} y2={640} stroke={c.line} strokeWidth={8} />
		<g transform={`skewY(${Math.sin(wave) * 2})`}>
			<rect x={774} y={350} width={150} height={100} fill="white" stroke={c.line} strokeWidth={L} />
			<rect x={774} y={350} width={150} height={26} fill={c.red} stroke={c.line} strokeWidth={L} />
			<rect x={774} y={424} width={150} height={26} fill={c.red} stroke={c.line} strokeWidth={L} />
			<path d="M 849 382 L 832 412 L 842 412 L 830 428 L 868 428 L 856 412 L 866 412 Z" fill={c.green} />
		</g>
	</g>
);

export type ExteriorProps = {
	readonly signText: string;
	/** 0 = day, 1 = night */
	readonly night?: number;
	readonly signLit?: number;
	readonly shopLit?: number;
	readonly upstairsLit?: readonly number[];
	readonly interior?: 'empty' | 'furnished';
	readonly doorSign?: 'none' | 'open' | 'closed';
	/** 0..1 flip progress from OPEN to CLOSED */
	readonly doorFlip?: number;
	readonly forRent?: number;
	readonly nowOpen?: number;
	readonly frame: number;
	readonly children?: React.ReactNode;
};

/** The Lebanese street with the restaurant storefront (1080×1920). Characters go in `children`, drawn on the sidewalk. */
export const Exterior: React.FC<ExteriorProps> = ({
	signText,
	night = 0,
	signLit = 1,
	shopLit = 0,
	upstairsLit = [0, 0, 0],
	interior = 'empty',
	doorSign = 'none',
	doorFlip = 0,
	forRent = 0,
	nowOpen = 0,
	frame,
	children,
}) => {
	const signGlow = signLit * (1 - night * 0.2);
	return (
		<AbsoluteFill style={{backgroundColor: c.road, overflow: 'hidden'}}>
			<svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
				{/* Facades */}
				<rect x={0} y={0} width={760} height={1260} fill={c.facade} />
				<rect x={760} y={0} width={320} height={1260} fill={c.facade2} />
				<line x1={760} y1={0} x2={760} y2={1260} stroke={c.line} strokeWidth={L} />
				<Bricks />
				{/* Upper floor */}
				<Window x={90} y={130} w={190} h={240} lit={upstairsLit[0]} balcony />
				<Window x={460} y={130} w={190} h={240} lit={upstairsLit[1]} balcony />
				<Window x={870} y={130} w={170} h={230} lit={upstairsLit[2]} balcony shutters={false} />
				<rect x={600} y={470} width={110} height={80} rx={6} fill="#E8E8E2" stroke={c.line} strokeWidth={L} />
				<circle cx={655} cy={510} r={24} fill="none" stroke={c.line} strokeWidth={5} />
				<Flag wave={frame / 8} />

				{/* Restaurant sign */}
				<rect x={-10} y={640} width={760} height={140} fill={c.burgundy} stroke={c.line} strokeWidth={L} />
				<rect x={-10} y={640} width={760} height={140} fill="url(#signGlow)" opacity={signGlow} />
				<defs>
					<radialGradient id="signGlow" cx="0.5" cy="0.5" r="0.6">
						<stop offset="0" stopColor="#F7B267" stopOpacity="0.55" />
						<stop offset="1" stopColor="#F7B267" stopOpacity="0" />
					</radialGradient>
				</defs>
				<text
					x={375}
					y={732}
					textAnchor="middle"
					fontFamily={fontFamily}
					fontWeight={900}
					fontSize={60}
					textLength={680}
					lengthAdjust="spacingAndGlyphs"
					fill={signLit > 0.5 ? c.cream : '#BFA990'}
					style={{filter: signLit > 0.5 ? 'drop-shadow(0 0 12px rgba(255,190,110,0.8))' : undefined}}
				>
					{signText}
				</text>

				{/* Awning */}
				<rect x={-10} y={780} width={760} height={26} fill={c.burgundyDark} stroke={c.line} strokeWidth={L} />
				{new Array(12).fill(true).map((_, i) => (
					<path
						key={i}
						d={`M ${i * 64 - 10} 806 L ${i * 64 + 54} 806 L ${i * 64 + 54} 880 Q ${i * 64 + 22} 920 ${i * 64 - 10} 880 Z`}
						fill={i % 2 ? c.cream : c.burgundy}
						stroke={c.line}
						strokeWidth={L}
						strokeLinejoin="round"
					/>
				))}

				{/* Shop window */}
				<rect x={0} y={900} width={540} height={350} fill={c.glass} stroke={c.line} strokeWidth={L} />
				<rect x={0} y={900} width={540} height={350} fill="#FFD98A" opacity={shopLit * 0.55} />
				{interior === 'furnished' ? (
					<g opacity={0.9}>
						{[110, 330].map((x) => (
							<g key={x}>
								<line x1={x} y1={900} x2={x} y2={960} stroke={c.line} strokeWidth={4} />
								<path d={`M ${x - 34} 990 L ${x + 34} 990 L ${x + 22} 960 L ${x - 22} 960 Z`} fill={c.burgundy} stroke={c.line} strokeWidth={4} />
							</g>
						))}
						<rect x={60} y={1080} width={160} height={16} fill={c.woodDark} stroke={c.line} strokeWidth={4} />
						<rect x={280} y={1080} width={160} height={16} fill={c.woodDark} stroke={c.line} strokeWidth={4} />
						<circle cx={470} cy={1150} r={36} fill="#5E8C4A" stroke={c.line} strokeWidth={4} />
					</g>
				) : null}
				{/* simple empty tables, like the reference */}
				{[40, 230].map((x) => (
					<g key={x}>
						<rect x={x} y={1110} width={150} height={14} fill={c.woodDark} stroke={c.line} strokeWidth={4} />
						<rect x={x + 10} y={1124} width={12} height={90} fill={c.woodDark} stroke={c.line} strokeWidth={4} />
						<rect x={x + 128} y={1124} width={12} height={90} fill={c.woodDark} stroke={c.line} strokeWidth={4} />
					</g>
				))}
				<path d="M 60 900 L 200 900 L 40 1250 L 0 1250 L 0 1030 Z" fill="white" opacity={0.12} />
				<rect x={0} y={1210} width={540} height={40} fill={c.woodDark} stroke={c.line} strokeWidth={L} />

				{/* Door */}
				<rect x={560} y={900} width={170} height={350} fill={c.door} stroke={c.line} strokeWidth={L} />
				<circle cx={600} cy={1080} r={10} fill={c.yellow} stroke={c.line} strokeWidth={3} />
				<rect x={730} y={780} width={30} height={480} fill={c.facadeDark} stroke={c.line} strokeWidth={L} />

				{/* Bakery next door */}
				<rect x={780} y={690} width={320} height={90} fill={c.yellow} stroke={c.line} strokeWidth={L} />
				<text x={1000} y={752} textAnchor="end" fontFamily={fontFamily} fontWeight={800} fontSize={52} fill={c.line}>
					فرن
				</text>
				<rect x={790} y={800} width={300} height={450} fill={c.shutterGrey} stroke={c.line} strokeWidth={L} />
				{new Array(10).fill(true).map((_, i) => (
					<line key={i} x1={790} x2={1080} y1={830 + i * 42} y2={830 + i * 42} stroke="#5A6B80" strokeWidth={6} />
				))}

				{/* Sidewalk, curb, road */}
				<rect x={0} y={1250} width={1080} height={100} fill={c.sidewalk} stroke={c.line} strokeWidth={L} />
				{new Array(8).fill(true).map((_, i) => (
					<line key={i} x1={i * 150 + 40} y1={1250} x2={i * 150 + 10} y2={1350} stroke={c.sidewalkLine} strokeWidth={4} />
				))}
				<rect x={0} y={1350} width={1080} height={22} fill={c.curb} />
				{new Array(5).fill(true).map((_, i) => (
					<rect key={i} x={i * 250 - 40} y={1760} width={150} height={20} fill={c.roadLine} />
				))}
			</svg>

			{/* Night tint over everything but the lights */}
			<AbsoluteFill style={{backgroundColor: c.night, opacity: night * 0.62}} />
			{/* Lights stay bright above the tint */}
			{night > 0 ? (
				<svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
					{[
						[90, 130, 190, 240],
						[460, 130, 190, 240],
						[870, 130, 170, 230],
					].map(([x, y, w, h], i) => (
						<rect key={i} x={x} y={y} width={w} height={h} fill={c.windowLit} opacity={upstairsLit[i] * night} />
					))}
					<rect x={0} y={900} width={540} height={350} fill="#FFD98A" opacity={shopLit * night * 0.6} />
					<text x={375} y={732} textAnchor="middle" fontFamily={fontFamily} fontWeight={900} fontSize={60} textLength={680} lengthAdjust="spacingAndGlyphs" fill={c.cream} opacity={signLit * night} style={{filter: 'drop-shadow(0 0 14px rgba(255,190,110,0.9))'}}>
						{signText}
					</text>
				</svg>
			) : null}

			{/* NOW OPEN neon */}
			{nowOpen > 0 ? (
				<div
					style={{
						position: 'absolute',
						left: 120,
						top: 960,
						padding: '18px 34px',
						borderRadius: 24,
						border: `6px solid ${c.line}`,
						backgroundColor: '#2B2420',
						color: '#FFE08A',
						fontFamily,
						fontWeight: 900,
						fontSize: 64,
						letterSpacing: 4,
						textShadow: `0 0 ${18 * nowOpen}px #FFC94D, 0 0 ${40 * nowOpen}px #FF9F1C`,
						scale: String(Math.min(1, nowOpen * 1.2)),
						opacity: Math.min(1, nowOpen * 2),
					}}
				>
					NOW OPEN
				</div>
			) : null}

			{/* Door sign: OPEN / CLOSED, flips around its hook */}
			{doorSign !== 'none' ? (
				<div style={{position: 'absolute', left: 585, top: 960, width: 120, perspective: 600}}>
					<div style={{position: 'absolute', left: 58, top: -26, width: 4, height: 30, backgroundColor: c.line}} />
					<div
						style={{
							width: 120,
							height: 60,
							borderRadius: 10,
							border: `5px solid ${c.line}`,
							backgroundColor: doorFlip < 0.5 && doorSign === 'closed' ? c.green : doorSign === 'open' ? c.green : c.red,
							color: 'white',
							fontFamily,
							fontWeight: 900,
							fontSize: doorFlip < 0.5 && doorSign === 'closed' ? 32 : doorSign === 'open' ? 32 : 26,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							transform: `rotateY(${doorFlip * 180}deg)`,
						}}
					>
						<span style={{transform: doorFlip >= 0.5 ? 'scaleX(-1)' : undefined}}>{doorSign === 'open' || doorFlip < 0.5 ? 'OPEN' : 'CLOSED'}</span>
					</div>
				</div>
			) : null}

			{/* FOR RENT paper */}
			{forRent > 0 ? (
				<div
					style={{
						position: 'absolute',
						left: 150,
						top: 990,
						width: 240,
						padding: '16px 0',
						backgroundColor: 'white',
						border: `6px solid ${c.line}`,
						textAlign: 'center',
						fontFamily,
						fontWeight: 900,
						fontSize: 50,
						color: c.red,
						rotate: '-6deg',
						scale: String(forRent),
						boxShadow: '0 8px 0 rgba(0,0,0,0.25)',
					}}
				>
					FOR RENT
					<div style={{fontSize: 24, color: c.line, fontWeight: 600}}>للإيجار</div>
				</div>
			) : null}

			{children}
		</AbsoluteFill>
	);
};
