import { Audio } from "@remotion/media";
import type React from "react";
import {
  AbsoluteFill,
  Interactive,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { backOut, brand, clamp, fontFamily, pop } from "../theme";
import { Dish, type DishName, KineticText, Pill, VWatermark } from "../ui";

type Props = {
  readonly line1: string;
  readonly line2: string;
  readonly more: string;
  readonly style?: React.CSSProperties;
};

// All dishes sit below the title (title ends at y ≈ 440).
const DISHES: {
  name: DishName;
  label: string;
  x: number;
  y: number;
  size: number;
  delay: number;
}[] = [
  {
    name: "grape-leaves",
    label: "Grape Leaves",
    x: 270,
    y: 700,
    size: 340,
    delay: 16,
  },
  { name: "mtabal", label: "Mtabal", x: 810, y: 700, size: 340, delay: 24 },
  { name: "hummus", label: "Hummus", x: 540, y: 1000, size: 430, delay: 32 },
  { name: "hindbeh", label: "Hindbeh", x: 270, y: 1300, size: 340, delay: 40 },
  {
    name: "green-beans",
    label: "Loubieh",
    x: 810,
    y: 1300,
    size: 340,
    delay: 48,
  },
];
const MORE_AT = 72;

const FavoritesSceneInner: React.FC<Props> = ({
  line1,
  line2,
  more,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{ fontFamily, backgroundColor: brand.cream, ...style }}
    >
      <VWatermark tone="color" y={1000} width={1150} opacity={0.07} />
      <KineticText
        at={2}
        top={130}
        lines={[
          { text: line1, color: brand.green, size: 116 },
          { text: line2, color: "white", size: 140, block: brand.orange },
        ]}
      />

      {DISHES.map((d) => {
        const p = interpolate(frame, [d.delay, d.delay + 18], [0, 1], {
          ...clamp,
          easing: backOut,
        });
        return (
          <Dish
            key={d.name}
            name={d.name}
            x={d.x}
            y={d.y}
            size={d.size}
            style={{
              rotate: `${(1 - p) * -120 + frame * 0.2}deg`,
              scale: String(p),
            }}
          />
        );
      })}
      {DISHES.map((d) => (
        <Pill
          key={d.label}
          at={d.delay + 12}
          x={d.x}
          y={d.y + d.size / 2 - 6}
          color={d.name === "hummus" ? brand.orange : brand.green}
        >
          {d.label}
        </Pill>
      ))}

      {/* "and more..." */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1540,
          display: "flex",
          justifyContent: "center",
          alignItems: "baseline",
          gap: 4,
        }}
      >
        <div style={{ overflow: "hidden", paddingBottom: 8 }}>
          <div
            style={{
              fontSize: 84,
              fontWeight: 900,
              fontStyle: "italic",
              letterSpacing: -2,
              color: brand.green,
              translate: `0px ${(1 - interpolate(frame, [MORE_AT, MORE_AT + 14], [0, 1], { ...clamp, easing: backOut })) * 110}%`,
            }}
          >
            {more}
          </div>
        </div>
        {[0, 1, 2].map((k) => (
          <div
            key={k}
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: brand.orange,
              marginLeft: k === 0 ? 10 : 6,
              scale: String(pop(frame, MORE_AT + 10 + k * 4, 10)),
              translate: `0px ${Math.max(0, Math.sin((frame - MORE_AT - k * 5) / 4)) * -16}px`,
            }}
          />
        ))}
      </div>

      {DISHES.map((d) => (
        <Sequence
          key={d.name}
          name={`Land ${d.label}`}
          from={d.delay + 10}
          durationInFrames={10}
          premountFor={fps}
        >
          <Audio src={staticFile("sfx/pop.wav")} volume={0.7} />
        </Sequence>
      ))}
      <Audio
        name="And more"
        src={staticFile("sfx/whoosh.wav")}
        from={MORE_AT - 2}
        premountFor={fps}
        volume={0.5}
      />
    </AbsoluteFill>
  );
};

const schema = {
  line1: {
    type: "text-content",
    default: "Mediterranean",
    description: "Line 1",
  },
  line2: { type: "text-content", default: "Favorites!", description: "Line 2" },
  more: {
    type: "text-content",
    default: "and more",
    description: '"and more" text',
  },
} as const satisfies InteractivitySchema;

export const FavoritesScene = Interactive.withSchema({
  Component: FavoritesSceneInner,
  componentName: "<FavoritesScene>",
  schema,
  wrapInSequence: true,
});
