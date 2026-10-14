import {Audio} from '@remotion/media';
import type React from 'react';
import {AbsoluteFill, Img, Interactive, interpolate, staticFile, useCurrentFrame, useVideoConfig, type InteractivitySchema} from 'remotion';
import {Leaf} from '../icons';
import {backOut, brand, clamp, expoOut, fontFamily, pop, progress} from '../theme';
import {Blob, Dish} from '../ui';

type Props = {
	readonly deli: string;
	readonly tagline: string;
	readonly style?: React.CSSProperties;
};

const LogoSceneInner: React.FC<Props> = ({deli, tagline, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const logo = interpolate(frame, [2, 22], [0, 1], {...clamp, easing: backOut});
	const reveal = progress(frame, 2, 24, expoOut);
	const badge = pop(frame, 18, 16);
	const words = tagline.split(' ');
	const corner = progress(frame, 0, 30, expoOut);

	return (
		<AbsoluteFill style={{fontFamily, background: `radial-gradient(circle at 50% 45%, ${brand.green} 0%, ${brand.greenDark} 70%, ${brand.greenDeep} 100%)`, ...style}}>
			<Blob x={540} y={900} size={1200} color="rgba(255,255,255,0.14)" />

			{/* Dishes framing the corners */}
			<Dish name="hummus" x={-40 + (1 - corner) * -400} y={1760} size={560} style={{rotate: `${frame * 0.3}deg`}} />
			<Dish name="grape-leaves" x={1120 + (1 - corner) * 400} y={180} size={560} style={{rotate: `${-frame * 0.3}deg`}} />

			<div style={{position: 'absolute', left: 0, right: 0, top: 700, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<div style={{scale: String(logo), clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`}}>
					<Img src={staticFile('logo/wordmark-white.png')} style={{width: 900}} />
				</div>
				<div
					style={{
						marginTop: 50,
						padding: '18px 70px',
						borderRadius: 999,
						backgroundColor: brand.orange,
						color: 'white',
						fontSize: 110,
						fontWeight: 900,
						letterSpacing: 30,
						paddingLeft: 100,
						scale: String(badge),
						boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
					}}
				>
					{deli}
				</div>
				<div style={{marginTop: 70, display: 'flex', gap: 22, fontSize: 64, fontWeight: 500, color: 'white'}}>
					{words.map((w, i) => {
						const p = progress(frame, 34 + i * 4, 50 + i * 4, expoOut);
						return (
							<span key={`${w}-${i}`} style={{opacity: p, translate: `0px ${(1 - p) * 40}px`}}>
								{w}
							</span>
						);
					})}
				</div>
				<div style={{marginTop: 40, display: 'flex', gap: 30, opacity: progress(frame, 56, 70)}}>
					{[0, 1, 2].map((k) => (
						<Leaf key={k} size={56} style={{rotate: `${k * 40 - 40 + Math.sin((frame + k * 10) / 10) * 8}deg`}} />
					))}
				</div>
			</div>

			<Audio name="Logo ding" src={staticFile('sfx/ding.wav')} from={2} premountFor={fps} volume={0.7} />
			<Audio name="Badge pop" src={staticFile('sfx/pop.wav')} from={18} premountFor={fps} />
		</AbsoluteFill>
	);
};

const schema = {
	deli: {type: 'text-content', default: 'DELI', description: 'Badge'},
	tagline: {type: 'text-content', default: 'Fresh. Healthy. On the Go.', description: 'Tagline'},
} as const satisfies InteractivitySchema;

export const LogoScene = Interactive.withSchema({Component: LogoSceneInner, componentName: '<LogoScene>', schema, wrapInSequence: true});
