import type React from 'react';

// Flat ingredient / food icons, drawn on a 100×100 grid.
type IconProps = {readonly size?: number; readonly style?: React.CSSProperties};

const Svg: React.FC<IconProps & {readonly children: React.ReactNode}> = ({size = 120, style, children}) => (
	<svg width={size} height={size} viewBox="0 0 100 100" style={style}>
		{children}
	</svg>
);

export const Tomato: React.FC<IconProps> = (p) => (
	<Svg {...p}>
		<circle cx="50" cy="56" r="38" fill="#E5322D" />
		<ellipse cx="38" cy="44" rx="10" ry="6" fill="#FF7B6B" opacity="0.7" />
		<path d="M50 20 L58 30 L70 26 L62 36 L50 32 L38 36 L30 26 L42 30 Z" fill="#3F8A2E" />
		<rect x="47" y="10" width="6" height="14" rx="3" fill="#3F8A2E" />
	</Svg>
);

export const Lemon: React.FC<IconProps> = (p) => (
	<Svg {...p}>
		<circle cx="50" cy="50" r="42" fill="#F2C318" />
		<circle cx="50" cy="50" r="35" fill="#FFF3B0" />
		{[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
			<path key={a} d="M50 50 L46 20 Q50 17 54 20 Z" fill="#FFE066" transform={`rotate(${a} 50 50)`} />
		))}
		<circle cx="50" cy="50" r="4" fill="#FFF3B0" />
	</Svg>
);

export const Olive: React.FC<IconProps> = (p) => (
	<Svg {...p}>
		<path d="M50 8 Q60 20 52 30" stroke="#5B4A2A" strokeWidth="3" fill="none" />
		<path d="M54 18 Q76 8 84 22 Q66 28 54 18 Z" fill="#6E9A3A" />
		<ellipse cx="44" cy="60" rx="22" ry="30" fill="#4D5B1E" transform="rotate(-18 44 60)" />
		<ellipse cx="38" cy="50" rx="6" ry="10" fill="#7C8C3C" transform="rotate(-18 38 50)" />
	</Svg>
);

export const Leaf: React.FC<IconProps> = (p) => (
	<Svg {...p}>
		<path d="M18 82 Q14 30 82 16 Q88 76 18 82 Z" fill="#5D8939" />
		<path d="M18 82 Q46 52 74 26" stroke="#A9D17A" strokeWidth="3" fill="none" strokeLinecap="round" />
	</Svg>
);

export const Parsley: React.FC<IconProps> = (p) => (
	<Svg {...p}>
		<path d="M50 95 L50 50 M50 60 L30 38 M50 60 L70 36" stroke="#4E8A2C" strokeWidth="4" strokeLinecap="round" fill="none" />
		{[
			[50, 32],
			[28, 30],
			[72, 28],
			[40, 20],
			[60, 18],
		].map(([x, y]) => (
			<circle key={`${x}-${y}`} cx={x} cy={y} r="13" fill="#5FA83A" />
		))}
		<circle cx="45" cy="26" r="6" fill="#8FD05F" />
	</Svg>
);

export const Garlic: React.FC<IconProps> = (p) => (
	<Svg {...p}>
		<path d="M50 12 Q56 26 70 36 Q90 56 72 82 Q50 96 28 82 Q10 56 30 36 Q44 26 50 12 Z" fill="#F7F1E3" />
		<path d="M50 30 Q42 56 46 88 M50 30 Q60 56 56 88" stroke="#E2D6BC" strokeWidth="3" fill="none" />
		<path d="M46 12 L54 12 L52 20 L48 20 Z" fill="#D8C9A6" />
	</Svg>
);

export const Chickpea: React.FC<IconProps> = (p) => (
	<Svg {...p}>
		<circle cx="50" cy="52" r="36" fill="#E9B86B" />
		<path d="M50 18 Q40 34 50 52" stroke="#C99448" strokeWidth="4" fill="none" strokeLinecap="round" />
		<circle cx="38" cy="42" r="8" fill="#F6D396" />
	</Svg>
);

export const Cucumber: React.FC<IconProps> = (p) => (
	<Svg {...p}>
		<circle cx="50" cy="50" r="42" fill="#3E7A2A" />
		<circle cx="50" cy="50" r="36" fill="#CDE6A8" />
		{[0, 60, 120, 180, 240, 300].map((a) => (
			<ellipse key={a} cx="50" cy="34" rx="3" ry="6" fill="#F4FBE6" transform={`rotate(${a} 50 50)`} />
		))}
	</Svg>
);

export const Mint: React.FC<IconProps> = (p) => (
	<Svg {...p}>
		<path d="M50 90 L50 40" stroke="#3E7A2A" strokeWidth="4" strokeLinecap="round" />
		<path d="M50 44 Q22 40 20 18 Q44 16 50 44 Z" fill="#4CA64C" />
		<path d="M50 44 Q78 40 80 18 Q56 16 50 44 Z" fill="#5CBF5C" />
		<path d="M50 64 Q28 62 24 44 Q46 44 50 64 Z" fill="#4CA64C" />
	</Svg>
);

export const Pomegranate: React.FC<IconProps> = (p) => (
	<Svg {...p}>
		<circle cx="50" cy="56" r="36" fill="#C2183B" />
		<path d="M40 22 L44 12 L50 20 L56 12 L60 22 Z" fill="#9E1030" />
		<ellipse cx="38" cy="46" rx="9" ry="6" fill="#E85A76" opacity="0.7" />
	</Svg>
);

export const Chili: React.FC<IconProps> = (p) => (
	<Svg {...p}>
		<path d="M30 30 Q70 24 80 70 Q82 90 66 84 Q58 50 30 42 Z" fill="#E5322D" />
		<path d="M30 30 Q22 22 24 12" stroke="#3F8A2E" strokeWidth="5" fill="none" strokeLinecap="round" />
		<path d="M24 28 Q30 40 36 36 Q34 26 24 28 Z" fill="#3F8A2E" />
	</Svg>
);

export const Cutlery: React.FC<IconProps> = (p) => (
	<Svg {...p}>
		<rect x="28" y="40" width="7" height="52" rx="3.5" fill="#FFFFFF" />
		<path d="M22 10 L22 34 Q22 44 31.5 44 Q41 44 41 34 L41 10" stroke="#FFFFFF" strokeWidth="5" fill="none" strokeLinecap="round" />
		<path d="M31.5 10 L31.5 32" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
		<path d="M64 92 L64 10 Q80 22 78 54 L64 56" fill="#FFFFFF" />
	</Svg>
);
