import {Audio} from '@remotion/media';
import type React from 'react';
import {AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Exterior} from './Exterior';
import {Interior} from './Interior';
import {Bubble, Dip, Hud, MoneyPop, RedX} from './overlays';
import {Person} from './Person';
import {backOut, c, clamp, expoOut, fontFamily, inOut, pop, progress, S} from './theme';

const SIGN = 'MY DREAM RESTAURANT';
const FLOOR = 1250;

// ---------------------------------------------------------------------------
// Global HUD values
// ---------------------------------------------------------------------------
const PURCHASES = [
	{at: S.spend + 26, from: 50000, to: 35000},
	{at: S.spend + 96, from: 35000, to: 15000},
	{at: S.spend + 172, from: 15000, to: 5000},
];

const cashAt = (f: number) => {
	if (f < S.spend) return interpolate(f, [15, 45], [0, 50000], {...clamp, easing: inOut});
	for (let i = PURCHASES.length - 1; i >= 0; i--) {
		const p = PURCHASES[i];
		if (f >= p.at) {
			const v = interpolate(f, [p.at, p.at + 14], [p.from, p.to], {...clamp, easing: expoOut});
			if (f < S.opening + 85) return v;
			// rent + salaries keep draining with no income
			return interpolate(f, [S.opening + 85, S.opening + 205, S.excuses + 20, S.excuses + 140], [5000, 2400, 2400, 0], clamp);
		}
	}
	return 50000;
};
const dayAt = (f: number) => (f >= S.opening + 165 ? 30 : f >= S.opening + 125 ? 7 : f >= S.opening + 85 ? 1 : 0);
const customersAt = (f: number) => (f >= S.opening + 125 && f < S.opening + 165 ? 2 : 0);

// ---------------------------------------------------------------------------
// Scene 1: the big dream
// ---------------------------------------------------------------------------
const Thought: React.FC<{readonly at: number}> = ({at}) => {
	const frame = useCurrentFrame();
	const p = pop(frame, at, 16);
	if (p <= 0) return null;
	return (
		<div style={{position: 'absolute', left: 520, top: 250, width: 500, height: 360, scale: String(p), transformOrigin: '0% 100%'}}>
			{[
				[10, 330, 22],
				[50, 290, 32],
			].map(([x, y, r]) => (
				<div key={x} style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', backgroundColor: 'white', border: `6px solid ${c.line}`}} />
			))}
			<svg width={500} height={300} viewBox="0 0 500 300" style={{position: 'absolute', left: 30, top: -20}}>
				<path
					d="M 90 250 Q 30 250 40 190 Q 0 140 60 110 Q 60 40 140 50 Q 180 0 250 30 Q 320 0 360 50 Q 440 40 440 110 Q 490 150 450 200 Q 460 260 390 255 Q 340 290 260 265 Q 170 290 90 250 Z"
					fill="white"
					stroke={c.line}
					strokeWidth={6}
				/>
				{/* mini full restaurant */}
				<rect x={110} y={90} width={280} height={140} rx={10} fill={c.facade} stroke={c.line} strokeWidth={5} />
				<rect x={110} y={90} width={280} height={30} fill={c.burgundy} stroke={c.line} strokeWidth={5} />
				{[150, 200, 250, 300, 350].map((x, i) => (
					<g key={x} transform={`translate(0 ${Math.sin(frame / 4 + i) * 4})`}>
						<circle cx={x} cy={175} r={20} fill="white" stroke={c.line} strokeWidth={4} />
						<path d={`M ${x - 18} 168 Q ${x} 140 ${x + 18} 168`} fill={i % 2 ? c.hair : '#8A5A3A'} stroke={c.line} strokeWidth={3} />
						<path d={`M ${x - 7} 182 Q ${x} 189 ${x + 7} 182`} stroke={c.line} strokeWidth={3} fill="none" />
						<rect x={x - 18} y={196} width={36} height={30} rx={10} fill={[c.red, c.shutter, c.yellow, c.window, c.burgundy][i]} stroke={c.line} strokeWidth={3} />
					</g>
				))}
				{[
					[130, 70],
					[380, 75],
					[250, 60],
				].map(([x, y], i) => (
					<text key={x} x={x} y={y} fontSize={34} textAnchor="middle" fill={c.yellow} stroke={c.line} strokeWidth={2} opacity={0.6 + 0.4 * Math.sin(frame / 5 + i)}>
						★
					</text>
				))}
			</svg>
		</div>
	);
};

const DreamScene: React.FC = () => {
	const frame = useCurrentFrame();
	const walkX = interpolate(frame, [0, 40], [-220, 380], {...clamp, easing: (t) => 1 - (1 - t) ** 2});
	const walking = frame < 40;
	const proud = frame >= 46;
	return (
		<Exterior signText={SIGN} frame={frame} signLit={1}>
			<Person
				x={walkX}
				y={1300}
				scale={1.05}
				expression={proud ? 'proud' : 'happy'}
				walking={walking}
				walkPhase={frame * 0.55}
				armL={proud ? 30 : 6}
				armR={proud ? 30 : 6}
				bob={proud ? Math.sin(frame / 5) * 4 : 0}
			/>
			<Thought at={58} />
		</Exterior>
	);
};

// ---------------------------------------------------------------------------
// Scene 2: spending money
// ---------------------------------------------------------------------------
const Sparkles: React.FC<{readonly at: number}> = ({at}) => {
	const frame = useCurrentFrame();
	if (frame < at) return null;
	const pts = [
		[180, 420],
		[420, 300],
		[700, 360],
		[960, 600],
		[600, 820],
		[320, 900],
		[860, 960],
	];
	return (
		<>
			{pts.map(([x, y], i) => {
				const t = ((frame - at + i * 5) % 30) / 30;
				return (
					<svg key={i} width={70} height={70} viewBox="-10 -10 20 20" style={{position: 'absolute', left: x - 35, top: y - 35, scale: String(Math.sin(t * Math.PI)), zIndex: 30}}>
						<path d="M 0 -10 Q 1.5 -1.5 10 0 Q 1.5 1.5 0 10 Q -1.5 1.5 -10 0 Q -1.5 -1.5 0 -10 Z" fill="#FFE27A" stroke={c.line} strokeWidth={1.2} />
					</svg>
				);
			})}
		</>
	);
};

const STAFF = [
	{hair: 'toque' as const, shirt: 'white', apron: null, targetX: 800, delay: 0, blink: 20},
	{hair: 'short' as const, shirt: c.shirt, apron: c.line, targetX: 520, delay: 8, blink: 50},
	{hair: 'bun' as const, shirt: c.shutter, apron: c.burgundy, targetX: 660, delay: 16, blink: 70},
];

const Staff: React.FC<{readonly enterAt: number | null; readonly expression?: 'happy' | 'bored'; readonly scale?: number}> = ({enterAt, expression = 'happy', scale = 0.82}) => {
	const frame = useCurrentFrame();
	return (
		<>
			{STAFF.map((s, i) => {
				const start = enterAt === null ? -1000 : enterAt + s.delay;
				const x = enterAt === null ? s.targetX : interpolate(frame, [start, start + 34], [1250 + i * 60, s.targetX], {...clamp, easing: (t) => 1 - (1 - t) ** 2});
				const walking = enterAt !== null && frame >= start && frame < start + 34;
				if (enterAt !== null && frame < start) return null;
				return (
					<Person
						key={i}
						x={x}
						y={FLOOR}
						scale={scale}
						hair={s.hair}
						shirt={s.shirt}
						apron={s.apron}
						expression={expression}
						walking={walking}
						walkPhase={frame * 0.6 + i}
						blinkOffset={s.blink}
						headTilt={expression === 'bored' ? Math.sin(frame / 20 + i) * 6 : 0}
						bob={expression === 'happy' ? Math.sin(frame / 6 + i) * 3 : 0}
					/>
				);
			})}
		</>
	);
};

const SpendScene: React.FC = () => {
	const frame = useCurrentFrame();
	const decor = [progress(frame, 10, 24), pop(frame, 16), pop(frame, 20), pop(frame, 24), pop(frame, 28)];
	const kitchen = [pop(frame, 80), pop(frame, 88), pop(frame, 96)];
	const purchaseBounce = [26, 96, 172].reduce((acc, t) => acc + interpolate(frame, [t, t + 6, t + 14], [0, -40, 0], clamp), 0);
	const ready = frame >= 200;
	return (
		<Interior decor={decor} kitchen={kitchen} frame={frame} steam={ready ? 1 : 0}>
			<Person
				x={230}
				y={FLOOR}
				scale={0.85}
				expression={ready ? 'proud' : 'happy'}
				armL={ready ? 30 : 10}
				armR={ready ? 160 : 10 + Math.max(0, -purchaseBounce) * 2}
				bob={purchaseBounce}
			/>
			<Staff enterAt={140} />
			<MoneyPop at={26} amount="-$15,000" label="DECOR" x={560} y={620} />
			<MoneyPop at={96} amount="-$20,000" label="EQUIPMENT" x={700} y={560} />
			<MoneyPop at={172} amount="-$10,000" label="STAFF & SETUP" x={600} y={560} />
			<Sparkles at={200} />
		</Interior>
	);
};

// ---------------------------------------------------------------------------
// Scene 3: marketing? no thanks!
// ---------------------------------------------------------------------------
const FULL_DECOR = [1, 1, 1, 1, 1];
const FULL_KITCHEN = [1, 1, 1];

const MarketingGuy: React.FC<{readonly at: number; readonly pushAt: number; readonly xAt: number}> = ({at, pushAt, xAt}) => {
	const frame = useCurrentFrame();
	const p = pop(frame, at, 16);
	if (p <= 0) return null;
	const fly = progress(frame, pushAt, pushAt + 22, (t) => t * t);
	const signY = 600;
	return (
		<div style={{position: 'absolute', inset: 0, scale: String(p), transformOrigin: `${xAt}px ${FLOOR}px`, rotate: `${fly * 200}deg`, translate: `${fly * 900}px ${-Math.sin(fly * Math.PI) * 260}px`}}>
			{/* sign */}
			<div
				style={{
					position: 'absolute',
					left: xAt - 190,
					top: signY,
					width: 380,
					padding: '18px 0',
					borderRadius: 20,
					backgroundColor: '#2F8F5B',
					border: `7px solid ${c.line}`,
					textAlign: 'center',
					fontFamily,
					color: 'white',
					zIndex: 20,
				}}
			>
				<div style={{fontSize: 40, fontWeight: 900, letterSpacing: 2}}>MARKETING</div>
				<div style={{fontSize: 70, fontWeight: 900, lineHeight: 1}}>$1,000</div>
			</div>
			<div style={{position: 'absolute', left: xAt - 8, top: signY + 160, width: 16, height: 130, backgroundColor: c.woodDark, border: `4px solid ${c.line}`}} />
			<Person x={xAt} y={FLOOR} scale={0.72} hair="short" shirt="#F08A24" apron={null} pants="#6B6F78" expression={frame >= pushAt ? 'shock' : 'happy'} armL={150} armR={150} blinkOffset={33} />
		</div>
	);
};

const MarketingScene: React.FC = () => {
	const frame = useCurrentFrame();
	const SCRATCH = 26;
	const WALLET = 46;
	const PUSH = 132;
	const shocked = frame >= SCRATCH + 2 && frame < WALLET;
	const jump = interpolate(frame, [SCRATCH + 2, SCRATCH + 8, SCRATCH + 16], [0, -70, 0], clamp);
	const shake = frame >= WALLET + 4 && frame < WALLET + 44 ? Math.sin((frame - WALLET) * 0.9) * 14 : 0;
	const pushing = frame >= PUSH - 4 && frame < PUSH + 20;
	return (
		<Interior decor={FULL_DECOR} kitchen={FULL_KITCHEN} frame={frame} steam={1}>
			<MarketingGuy at={6} pushAt={PUSH} xAt={560} />
			<Person
				x={pushing ? 290 : 230}
				y={FLOOR}
				scale={0.85}
				expression={shocked ? 'shock' : frame >= WALLET ? (pushing ? 'frustrated' : 'stern') : 'happy'}
				wallet={frame >= WALLET && !pushing}
				armL={frame >= WALLET && !pushing ? -38 : 8}
				armR={pushing ? 95 : frame >= WALLET ? -38 : 8}
				headTilt={shake}
				bob={jump}
			/>
			<RedX at={72} until={PUSH} x={560} y={680} size={360} />
			<Bubble at={86} until={150} x={330} y={500} tail="left" size={64} shake={1.5}>
				هلّق مش وقتها!
			</Bubble>
		</Interior>
	);
};

// ---------------------------------------------------------------------------
// Scene 4: grand opening
// ---------------------------------------------------------------------------
const DayCard: React.FC<{readonly at: number; readonly until: number; readonly day: number; readonly customers: number}> = ({at, until, day, customers}) => {
	const frame = useCurrentFrame();
	if (frame < at || frame > until) return null;
	const p = interpolate(frame, [at, at + 10], [0, 1], {...clamp, easing: backOut});
	const out = interpolate(frame, [until - 6, until], [0, 1], clamp);
	return (
		<div
			style={{
				position: 'absolute',
				left: 540,
				top: 330,
				translate: '-50% 0',
				scale: String(p * (1 - out)),
				padding: '20px 40px',
				borderRadius: 26,
				backgroundColor: c.hud,
				border: `5px solid ${c.line}`,
				fontFamily,
				textAlign: 'center',
				color: 'white',
				zIndex: 40,
				whiteSpace: 'nowrap',
			}}
		>
			<div style={{fontSize: 46, fontWeight: 900, letterSpacing: 4}}>DAY {day}</div>
			<div style={{fontSize: 64, fontWeight: 900, color: customers === 0 ? '#FF6B5E' : c.yellow}}>
				{customers} {customers === 1 ? 'CUSTOMER' : 'CUSTOMERS'}
			</div>
		</div>
	);
};

const Passersby: React.FC<{readonly at: number}> = ({at}) => {
	const frame = useCurrentFrame();
	const t = (frame - at) / 34;
	if (t < 0 || t > 1) return null;
	return (
		<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
			<defs>
				<clipPath id="win">
					<rect x={60} y={330} width={320} height={380} />
				</clipPath>
			</defs>
			<g clipPath="url(#win)">
				{[0, 70].map((dx) => (
					<g key={dx} transform={`translate(${-40 + t * 460 - dx} ${600 + Math.abs(Math.sin(frame / 2)) * -6})`}>
						<circle r={26} fill="white" stroke={c.line} strokeWidth={4} />
						<rect x={-22} y={24} width={44} height={60} rx={14} fill={dx ? c.window : c.red} stroke={c.line} strokeWidth={4} />
					</g>
				))}
			</g>
		</svg>
	);
};

const OpeningScene: React.FC = () => {
	const frame = useCurrentFrame();
	const CUT = 70;
	if (frame < CUT) {
		const wave = Math.sin(frame / 3) * 25;
		return (
			<Exterior signText={SIGN} frame={frame} interior="furnished" shopLit={1} nowOpen={pop(frame, 8, 18)} doorSign="open">
				<Person x={880} y={1300} scale={1.05} expression="happy" armL={140 + wave} armR={10} bob={Math.sin(frame / 4) * 5} />
			</Exterior>
		);
	}
	const f = frame - CUT;
	const clockAngle = f < 10 ? 0 : (f - 10) ** 1.35 * 9;
	const expr = f < 25 ? 'happy' : f < 55 ? 'neutral' : f < 95 ? 'worried' : 'confused';
	return (
		<Interior decor={FULL_DECOR} kitchen={FULL_KITCHEN} counter={1} clock={pop(frame, CUT + 4)} clockAngle={clockAngle} frame={frame} tumbleweed={f >= 100 ? Math.min(1.1, (f - 100) / 40) : -1}>
			<Person x={200} y={FLOOR} scale={0.85} expression={expr} armL={8} armR={8} bob={f < 25 ? Math.sin(frame / 3) * 6 : 0} headTilt={expr === 'confused' ? 8 : 0} />
			<Staff enterAt={null} expression="bored" />
			<Passersby at={CUT + 58} />
			<DayCard at={CUT + 15} until={CUT + 52} day={1} customers={0} />
			<DayCard at={CUT + 55} until={CUT + 92} day={7} customers={2} />
			<DayCard at={CUT + 95} until={CUT + 140} day={30} customers={0} />
			{f >= 105 ? (
				<div style={{position: 'absolute', left: 300, top: 760, fontFamily, fontWeight: 900, fontSize: 120, color: c.yellow, WebkitTextStroke: `6px ${c.line}`, paintOrder: 'stroke fill', scale: String(pop(frame, CUT + 105)), rotate: `${Math.sin(frame / 6) * 8}deg`}}>
					?
				</div>
			) : null}
			{f >= 60
				? [520, 660, 800].map((x, i) => (
						<div
							key={x}
							style={{
								position: 'absolute',
								left: x + 50,
								top: 820 - ((frame + i * 12) % 40) * 2,
								fontFamily,
								fontWeight: 900,
								fontSize: 44,
								color: 'white',
								WebkitTextStroke: `4px ${c.line}`,
								paintOrder: 'stroke fill',
								opacity: 1 - ((frame + i * 12) % 40) / 40,
							}}
						>
							z
						</div>
					))
				: null}
		</Interior>
	);
};

// ---------------------------------------------------------------------------
// Scene 5: the excuses
// ---------------------------------------------------------------------------
const ExcusesScene: React.FC = () => {
	const frame = useCurrentFrame();
	const expr = frame < 46 ? 'confused' : frame < 88 ? 'worried' : 'frustrated';
	const shake = frame >= 88 ? Math.sin(frame * 1.4) * 4 : 0;
	return (
		<Interior decor={FULL_DECOR} kitchen={FULL_KITCHEN} frame={frame} lampsOn={0.6}>
			<Person x={540} y={FLOOR} scale={0.95} expression={expr} armL={frame >= 88 ? 40 : 10} armR={frame >= 88 ? 40 : 10} headTilt={shake + (frame < 46 ? 6 : 0)} />
			<Bubble at={8} until={150} x={330} y={700} tail="right" size={48}>
				ليش ما حدا عم يجي؟
			</Bubble>
			<Bubble at={46} until={150} x={700} y={520} tail="left" size={48}>
				يمكن العالم ما معها مصاري!
			</Bubble>
			<Bubble at={88} until={150} x={430} y={360} tail="down" size={48} shake={2}>
				يمكن المشكلة بالسوق!
			</Bubble>
		</Interior>
	);
};

// ---------------------------------------------------------------------------
// Scene 6: the end
// ---------------------------------------------------------------------------
const EndScene: React.FC = () => {
	const frame = useCurrentFrame();
	const night = progress(frame, 0, 20, inOut);
	const off = (t: number) => (frame >= t ? 0 : 1);
	const zoom = interpolate(frame, [0, 150], [1.22, 1], {...clamp, easing: inOut});
	const flip = progress(frame, 72, 86, inOut);
	return (
		<AbsoluteFill style={{scale: String(zoom), transformOrigin: '540px 1050px'}}>
			<Exterior
				signText={SIGN}
				frame={frame}
				night={night}
				signLit={off(26)}
				shopLit={off(40)}
				upstairsLit={[off(52), off(60), off(68)]}
				interior="furnished"
				doorSign="closed"
				doorFlip={flip}
				forRent={pop(frame, 100, 14)}
			>
				<Person x={470} y={1300} scale={1.05} expression="sad" armR={frame >= 66 && frame < 92 ? 115 : 4} armL={4} headTilt={10} blinkOffset={10} />
			</Exterior>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------------------
// Final frame
// ---------------------------------------------------------------------------
const FinalFrame: React.FC = () => {
	const frame = useCurrentFrame();
	const words = 'A GREAT RESTAURANT NOBODY KNOWS ABOUT IS STILL AN EMPTY RESTAURANT.'.split(' ');
	return (
		<AbsoluteFill style={{backgroundColor: 'black', alignItems: 'center', justifyContent: 'center', fontFamily, padding: '0 80px'}}>
			<div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: 26, rowGap: 4}}>
				{words.map((w, i) => {
					const p = progress(frame, 6 + i * 3, 20 + i * 3);
					return (
						<div key={`${w}-${i}`} style={{overflow: 'hidden', padding: '6px 0 14px'}}>
							<div
								style={{
									fontSize: 104,
									fontWeight: 900,
									lineHeight: 1,
									letterSpacing: -2,
									color: w.startsWith('EMPTY') || w.startsWith('RESTAURANT.') ? '#FF6B5E' : 'white',
									translate: `0px ${(1 - p) * 140}%`,
									opacity: p > 0 ? 1 : 0,
								}}
							>
								{w}
							</div>
						</div>
					);
				})}
			</div>
			<div style={{marginTop: 70, fontSize: 44, fontWeight: 500, color: 'rgba(255,255,255,0.8)', textAlign: 'center', opacity: progress(frame, 60, 80), translate: `0px ${(1 - progress(frame, 60, 80)) * 30}px`}}>
				Marketing isn’t an extra expense.
				<br />
				It’s part of the business.
			</div>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------------------
// The whole story
// ---------------------------------------------------------------------------
export const Story: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const purchaseFlash = PURCHASES.reduce((a, p) => a + interpolate(frame, [p.at, p.at + 4, p.at + 16], [0, 1, 0], clamp), 0);
	const brokeFlash = frame > S.excuses + 120 && frame < S.final ? (Math.floor(frame / 8) % 2) * 0.8 : 0;

	return (
		<AbsoluteFill style={{backgroundColor: 'black'}}>
			<Sequence name="1 · The big dream" durationInFrames={S.spend} premountFor={fps}>
				<DreamScene />
			</Sequence>
			<Sequence name="2 · Spending money" from={S.spend} durationInFrames={S.marketing - S.spend} premountFor={fps}>
				<SpendScene />
			</Sequence>
			<Sequence name="3 · Marketing? No thanks" from={S.marketing} durationInFrames={S.opening - S.marketing} premountFor={fps}>
				<MarketingScene />
			</Sequence>
			<Sequence name="4 · Grand opening" from={S.opening} durationInFrames={S.excuses - S.opening} premountFor={fps}>
				<OpeningScene />
			</Sequence>
			<Sequence name="5 · The excuses" from={S.excuses} durationInFrames={S.end - S.excuses} premountFor={fps}>
				<ExcusesScene />
			</Sequence>
			<Sequence name="6 · The end" from={S.end} durationInFrames={S.final - S.end} premountFor={fps}>
				<EndScene />
			</Sequence>
			<Sequence name="Final message" from={S.final} durationInFrames={S.total - S.final} premountFor={fps}>
				<FinalFrame />
			</Sequence>

			<Hud cash={cashAt(frame)} customers={customersAt(frame)} day={dayAt(frame)} cashFlash={Math.max(purchaseFlash, brokeFlash)} opacity={interpolate(frame, [S.final - 12, S.final - 2], [1, 0], clamp)} />


			<Dip at={S.spend} />
			<Dip at={S.opening} />
			<Dip at={S.opening + 70} len={6} />
			<Dip at={S.excuses} />
			<Dip at={S.end} />
			<Dip at={S.final} len={10} />

			{/* ---------------- Sound ---------------- */}
			<Audio name="Playful music" src={staticFile('music-happy.wav')} durationInFrames={S.marketing + 26} premountFor={fps} volume={(f) => interpolate(f, [0, 8], [0, 0.5], clamp)} />
			<Audio name="Sad ending" src={staticFile('music-sad.wav')} from={S.end} premountFor={fps} volume={0.7} />

			<Audio name="Footsteps" src={staticFile('sfx/steps.wav')} premountFor={fps} volume={0.5} />
			<Audio name="Budget" src={staticFile('sfx/kaching.wav')} from={42} premountFor={fps} volume={0.6} />
			<Audio name="Dream" src={staticFile('sfx/sparkle.wav')} from={58} premountFor={fps} volume={0.6} />

			<Audio name="Decor pops" src={staticFile('sfx/sparkle.wav')} from={S.spend + 14} premountFor={fps} volume={0.5} />
			{PURCHASES.map((p) => (
				<Sequence key={p.at} name={`Cash register ${p.to}`} from={p.at} durationInFrames={30} premountFor={fps}>
					<Audio src={staticFile('sfx/kaching.wav')} volume={0.85} />
				</Sequence>
			))}
			<Audio name="Kitchen pops" src={staticFile('sfx/pop.wav')} from={S.spend + 82} premountFor={fps} />
			<Audio name="Staff steps" src={staticFile('sfx/steps.wav')} from={S.spend + 140} premountFor={fps} volume={0.5} />
			<Audio name="All ready" src={staticFile('sfx/sparkle.wav')} from={S.spend + 200} premountFor={fps} volume={0.6} />

			<Audio name="Marketing pops in" src={staticFile('sfx/pop.wav')} from={S.marketing + 6} premountFor={fps} />
			<Audio name="Record scratch" src={staticFile('sfx/scratch.wav')} from={S.marketing + 26} premountFor={fps} volume={0.9} />
			<Audio name="Red X" src={staticFile('sfx/stamp.wav')} from={S.marketing + 72} premountFor={fps} />
			<Audio name="Bubble" src={staticFile('sfx/pop.wav')} from={S.marketing + 86} premountFor={fps} />
			<Audio name="Push" src={staticFile('sfx/boing.wav')} from={S.marketing + 132} premountFor={fps} />

			<Audio name="Now open" src={staticFile('sfx/sparkle.wav')} from={S.opening + 8} premountFor={fps} volume={0.7} />
			<Audio name="Clock racing" src={staticFile('sfx/fasttick.wav')} from={S.opening + 80} durationInFrames={90} premountFor={fps} volume={0.6} />
			<Audio name="Day cards" src={staticFile('sfx/pop.wav')} from={S.opening + 85} premountFor={fps} volume={0.5} />
			<Audio name="Crickets" src={staticFile('sfx/crickets.wav')} from={S.opening + 165} premountFor={fps} volume={0.8} />

			<Audio name="Slow tick" src={staticFile('sfx/tick.wav')} from={S.excuses} durationInFrames={S.end - S.excuses} premountFor={fps} volume={0.6} />
			{[8, 46, 88].map((t) => (
				<Sequence key={t} name={`Excuse ${t}`} from={S.excuses + t} durationInFrames={10} premountFor={fps}>
					<Audio src={staticFile('sfx/pop.wav')} volume={0.6} />
				</Sequence>
			))}

			{[26, 40, 52, 60, 68].map((t) => (
				<Sequence key={t} name={`Light off ${t}`} from={S.end + t} durationInFrames={8} premountFor={fps}>
					<Audio src={staticFile('sfx/click.wav')} volume={0.7} />
				</Sequence>
			))}
			<Audio name="Sign flip" src={staticFile('sfx/flip.wav')} from={S.end + 72} premountFor={fps} />
			<Audio name="For rent" src={staticFile('sfx/stamp.wav')} from={S.end + 100} premountFor={fps} volume={0.7} />
		</AbsoluteFill>
	);
};

