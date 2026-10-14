import { Audio } from "@remotion/media";
import type React from "react";
import {
  AbsoluteFill,
  Interactive,
  interpolate,
  random,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { backOut, brand, clamp, fontFamily, inOut, progress } from "../theme";
import { Dish, KineticText, VWatermark } from "../ui";

type Props = {
  readonly line1: string;
  readonly line2: string;
  readonly style?: React.CSSProperties;
};

const BOWL = { x: 540, y: 1250, size: 760 };
const SPOUT = { x: 630, y: 880 };

const T = { pourStart: 78, pourEnd: 112, oilTitle: 64 };

/** Olive oil bottle, drawn with its spout at the local origin so it can tilt around it. */
const Bottle: React.FC = () => (
  <svg width="200" height="480" viewBox="-100 -20 200 480">
    <rect x="-16" y="-20" width="32" height="26" rx="6" fill="#7A5230" />
    <path
      d="M-20 4 L20 4 L22 70 Q80 100 80 150 L80 420 Q80 450 50 450 L-50 450 Q-80 450 -80 420 L-80 150 Q-80 100 -22 70 Z"
      fill="#9CBF5A"
      opacity="0.95"
    />
    <path
      d="M-74 210 L74 210 L74 420 Q74 444 50 444 L-50 444 Q-74 444 -74 420 Z"
      fill={brand.oil}
      opacity="0.9"
    />
    <rect x="-62" y="240" width="124" height="120" rx="16" fill={brand.cream} />
    <text
      x="0"
      y="292"
      textAnchor="middle"
      fontFamily="Neue Haas Display"
      fontWeight="900"
      fontSize="30"
      fill={brand.green}
    >
      OLIVE
    </text>
    <text
      x="0"
      y="330"
      textAnchor="middle"
      fontFamily="Neue Haas Display"
      fontWeight="700"
      fontSize="26"
      fill={brand.orange}
    >
      OIL
    </text>
    <path
      d="M-60 130 Q-64 200 -60 400"
      stroke="rgba(255,255,255,0.5)"
      strokeWidth="10"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

// Olive oil drops: one every 3 frames while pouring, each landing on the hummus and leaving a glossy pool.
const DROPS = new Array(11).fill(true).map((_, i) => {
  const a = random(`a${i}`) * Math.PI * 2;
  const r = 30 + random(`r${i}`) * 150;
  return {
    at: T.pourStart + i * 3,
    x: BOWL.x + Math.cos(a) * r,
    y: BOWL.y + Math.sin(a) * r * 0.9,
    size: 26 + random(`s${i}`) * 16,
  };
});
const FALL = 11;

const Drop: React.FC<{ readonly size: number }> = ({ size }) => (
  <svg width={size} height={size * 1.4} viewBox="0 0 20 28">
    <path
      d="M10 0 Q19 13 19 18 A9 9 0 0 1 1 18 Q1 13 10 0 Z"
      fill={brand.oil}
    />
    <ellipse cx="6.5" cy="17" rx="2.2" ry="3.4" fill="rgba(255,250,210,0.85)" />
  </svg>
);

const OrganicSceneInner: React.FC<Props> = ({ line1, line2, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bowlIn = interpolate(frame, [0, 18], [0, 1], {
    ...clamp,
    easing: backOut,
  });
  const bottleIn = progress(frame, 56, 72);
  const tilt = interpolate(
    frame,
    [58, 76, T.pourEnd + 4, T.pourEnd + 16],
    [-20, -140, -140, -60],
    { ...clamp, easing: inOut },
  );

  return (
    <AbsoluteFill
      style={{ fontFamily, backgroundColor: brand.greenLight, ...style }}
    >
      <VWatermark tone="color" y={1200} width={1150} opacity={0.07} />
      <KineticText
        at={2}
        top={150}
        lines={[
          { text: line1, color: brand.green, size: 100 },
          {
            text: line2,
            color: "white",
            size: 100,
            block: brand.orange,
            at: T.oilTitle,
          },
        ]}
      />

      <Dish
        name="hindbeh"
        x={BOWL.x}
        y={BOWL.y}
        size={BOWL.size}
        style={{ scale: String(bowlIn), rotate: `${frame * 0.2}deg` }}
      />

      {/* Olive oil pools left by the drops (turn with the bowl) */}
      <AbsoluteFill
        style={{
          transformOrigin: `${BOWL.x}px ${BOWL.y}px`,
          rotate: `${frame * 0.2}deg`,
        }}
      >
        {DROPS.map((d, i) => {
          const land = d.at + FALL;
          const pool = interpolate(frame, [land, land + 8], [0, 1], {
            ...clamp,
            easing: backOut,
          });
          const ring = progress(frame, land, land + 12);
          if (frame < land) return null;
          return (
            <div
              key={`pool-${i}`}
              style={{ position: "absolute", left: d.x, top: d.y }}
            >
              <div
                style={{
                  position: "absolute",
                  left: -d.size * 1.4,
                  top: -d.size * 1.4,
                  width: d.size * 2.8,
                  height: d.size * 2.8,
                  borderRadius: "50%",
                  border: `3px solid ${brand.oil}`,
                  scale: String(0.3 + ring),
                  opacity: 1 - ring,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: -d.size * 0.8,
                  top: -d.size * 0.55,
                  width: d.size * 1.6,
                  height: d.size * 1.1,
                  borderRadius: "50%",
                  backgroundColor: brand.oil,
                  opacity: 0.92,
                  scale: String(pool),
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: -d.size * 0.45,
                  top: -d.size * 0.35,
                  width: d.size * 0.45,
                  height: d.size * 0.28,
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,250,210,0.9)",
                  scale: String(pool),
                }}
              />
            </div>
          );
        })}
      </AbsoluteFill>

      {/* Falling drops */}
      {DROPS.map((d, i) => {
        const t = interpolate(frame, [d.at, d.at + FALL], [0, 1], clamp);
        if (frame < d.at || frame >= d.at + FALL) return null;
        const x = interpolate(t, [0, 1], [SPOUT.x, d.x]);
        const y = SPOUT.y + (d.y - SPOUT.y) * t * t;
        return (
          <div
            key={`drop-${i}`}
            style={{
              position: "absolute",
              left: x - d.size / 2,
              top: y - d.size * 1.2,
              scale: `${1 - t * 0.15} ${1 + t * 0.35}`,
            }}
          >
            <Drop size={d.size} />
          </div>
        );
      })}

      {/* Bottle tilting around its spout */}
      <div
        style={{
          position: "absolute",
          left: SPOUT.x - 100,
          top: SPOUT.y - 20,
          transformOrigin: "100px 20px",
          rotate: `${tilt}deg`,
          translate: `${(1 - bottleIn) * 700}px ${(1 - bottleIn) * -500}px`,
          opacity: bottleIn,
          filter: "drop-shadow(0 20px 30px rgba(40,60,20,0.25))",
        }}
      >
        <Bottle />
      </div>

      <Audio
        name="Bottle in"
        src={staticFile("sfx/whoosh.wav")}
        from={54}
        premountFor={fps}
        volume={0.5}
      />
      {DROPS.map((d, i) => (
        <Sequence
          key={`drip-${i}`}
          name={`Drip ${i + 1}`}
          from={d.at + FALL}
          durationInFrames={8}
          premountFor={fps}
        >
          <Audio
            src={staticFile("sfx/drip.wav")}
            volume={0.55 + (i % 3) * 0.1}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const schema = {
  line1: {
    type: "text-content",
    default: "Organic Ingredients.",
    description: "Line 1",
  },
  line2: {
    type: "text-content",
    default: "Olive Oil Goodness.",
    description: "Line 2",
  },
} as const satisfies InteractivitySchema;

export const OrganicScene = Interactive.withSchema({
  Component: OrganicSceneInner,
  componentName: "<OrganicScene>",
  schema,
  wrapInSequence: true,
});
