import { Audio } from "@remotion/media";
import type React from "react";
import {
  AbsoluteFill,
  Img,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import {
  backOut,
  brand,
  clamp,
  expoOut,
  fontFamily,
  pop,
  progress,
} from "../theme";
import { Dish, KineticText, VWatermark } from "../ui";

type Props = {
  readonly deli: string;
  readonly tagline: string;
  readonly style?: React.CSSProperties;
};

const LogoSceneInner: React.FC<Props> = ({ deli, tagline, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = interpolate(frame, [2, 22], [0, 1], {
    ...clamp,
    easing: backOut,
  });
  const reveal = progress(frame, 2, 24, expoOut);
  const badge = pop(frame, 18, 16);
  const corner = progress(frame, 0, 30, expoOut);

  return (
    <AbsoluteFill
      style={{ fontFamily, backgroundColor: brand.greenBg, ...style }}
    >
      <VWatermark tone="white" y={980} width={1250} opacity={0.06} />
      {/* Dishes framing the corners */}
      <Dish
        name="hummus"
        x={-40 + (1 - corner) * -400}
        y={1760}
        size={560}
        style={{ rotate: `${frame * 0.3}deg` }}
      />
      <Dish
        name="grape-leaves"
        x={1120 + (1 - corner) * 400}
        y={180}
        size={560}
        style={{ rotate: `${-frame * 0.3}deg` }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 760,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            scale: String(logo),
            clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`,
          }}
        >
          <Img
            src={staticFile("logo/wordmark-white.png")}
            style={{ width: 900 }}
          />
        </div>
        <div
          style={{
            marginTop: 50,
            padding: "18px 70px",
            borderRadius: 999,
            backgroundColor: brand.orange,
            color: "white",
            fontSize: 110,
            fontWeight: 900,
            letterSpacing: 30,
            paddingLeft: 100,
            scale: String(badge),
          }}
        >
          {deli}
        </div>
        <div
          style={{
            position: "relative",
            marginTop: 60,
            width: 1080,
            height: 90,
          }}
        >
          <KineticText
            at={32}
            top={0}
            lines={[{ text: tagline, color: "white", size: 72 }]}
          />
        </div>
      </div>

      <Audio
        name="Logo ding"
        src={staticFile("sfx/ding.wav")}
        from={2}
        premountFor={fps}
        volume={0.7}
      />
      <Audio
        name="Badge pop"
        src={staticFile("sfx/pop.wav")}
        from={18}
        premountFor={fps}
      />
    </AbsoluteFill>
  );
};

const schema = {
  deli: { type: "text-content", default: "DELI", description: "Badge" },
  tagline: {
    type: "text-content",
    default: "Fresh. Healthy. On the Go.",
    description: "Tagline",
  },
} as const satisfies InteractivitySchema;

export const LogoScene = Interactive.withSchema({
  Component: LogoSceneInner,
  componentName: "<LogoScene>",
  schema,
  wrapInSequence: true,
});
