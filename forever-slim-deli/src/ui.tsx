import type React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { brand, clamp, expoOut, fontFamily, pop } from "./theme";

export type DishName =
  | "hummus"
  | "mtabal"
  | "hindbeh"
  | "grape-leaves"
  | "green-beans";

/** A top-down kraft bowl of food, centred on (x, y). */
export const Dish: React.FC<{
  readonly name: DishName;
  readonly x: number;
  readonly y: number;
  readonly size: number;
  readonly style?: React.CSSProperties;
}> = ({ name, x, y, size, style }) => (
  <Img
    src={staticFile(`dishes/${name}.png`)}
    style={{
      position: "absolute",
      left: x - size / 2,
      top: y - size / 2,
      width: size,
      height: size,
      objectFit: "contain",
      filter: "drop-shadow(0 24px 30px rgba(40,30,10,0.22))",
      ...style,
    }}
  />
);

export type Line = {
  readonly text: string;
  readonly color: string;
  readonly size: number;
  /** Solid highlight block behind the line (text turns `color` on top of it). */
  readonly block?: string;
  readonly italic?: boolean;
  /** Overrides the line's start frame. */
  readonly at?: number;
};

/**
 * Kinetic headline: each word slides up from behind a mask, lines set tight.
 * A line with `block` gets a solid colour bar that wipes in first.
 */
export const KineticText: React.FC<{
  readonly lines: readonly Line[];
  readonly at: number;
  readonly top: number;
  readonly lineDelay?: number;
  readonly exitAt?: number;
}> = ({ lines, at, top, lineDelay = 7, exitAt }) => {
  const frame = useCurrentFrame();
  let wordIndex = 0;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily,
      }}
    >
      {lines.map((line, li) => {
        const lineAt = line.at ?? at + li * lineDelay;
        const block = interpolate(frame, [lineAt - 2, lineAt + 10], [0, 1], {
          ...clamp,
          easing: expoOut,
        });
        const out =
          exitAt === undefined
            ? 0
            : interpolate(
                frame,
                [exitAt + li * 2, exitAt + 10 + li * 2],
                [0, 1],
                { ...clamp, easing: expoOut },
              );
        return (
          <div
            key={`${line.text}-${li}`}
            style={{
              position: "relative",
              marginTop:
                li === 0
                  ? 0
                  : line.block
                    ? line.size * 0.12
                    : -line.size * 0.06,
              padding: line.block
                ? `${line.size * 0.04}px ${line.size * 0.26}px ${line.size * 0.1}px`
                : `${line.size * 0.06}px 0 ${line.size * 0.24}px`,
              marginBottom: line.block ? 0 : -line.size * 0.18,
              overflow: "hidden",
            }}
          >
            {line.block ? (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: line.block,
                  borderRadius: line.size * 0.16,
                  transformOrigin: "0% 50%",
                  scale: `${block * (1 - out)} 1`,
                }}
              />
            ) : null}
            <div
              style={{
                position: "relative",
                display: "flex",
                gap: line.size * 0.24,
                justifyContent: "center",
              }}
            >
              {line.text.split(" ").map((w) => {
                const i = wordIndex++;
                const p = interpolate(
                  frame,
                  [lineAt + i * 2, lineAt + i * 2 + 14],
                  [0, 1],
                  { ...clamp, easing: expoOut },
                );
                return (
                  <span
                    key={`${w}-${i}`}
                    style={{
                      display: "inline-block",
                      fontSize: line.size,
                      fontWeight: 900,
                      fontStyle: line.italic ? "italic" : "normal",
                      letterSpacing: -line.size * 0.035,
                      lineHeight: 1,
                      color: line.color,
                      translate: `0px ${(1 - p) * 170 - out * 170}%`,
                      opacity: p > 0 ? 1 : 0,
                      rotate: `${(1 - p) * 6}deg`,
                    }}
                  >
                    {w}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const Pill: React.FC<{
  readonly children: React.ReactNode;
  readonly at: number;
  readonly x: number;
  readonly y: number;
  readonly color?: string;
}> = ({ children, at, x, y, color = brand.green }) => {
  const frame = useCurrentFrame();
  const p = pop(frame, at, 14);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: "-50% -50%",
        scale: String(p),
        opacity: Math.min(1, p * 1.5),
        padding: "14px 30px",
        borderRadius: 999,
        backgroundColor: color,
        color: "white",
        fontFamily,
        fontSize: 36,
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
};

/** The logo's "V" mark as a large, barely visible background watermark that drifts slowly. */
export const VWatermark: React.FC<{
  readonly tone: "white" | "color";
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly opacity?: number;
}> = ({ tone, x = 540, y = 1000, width = 1000, opacity = 0.07 }) => {
  const frame = useCurrentFrame();
  const height = (width * 836) / 960;
  return (
    <Img
      src={staticFile(`logo/v-mark-${tone}.png`)}
      style={{
        position: "absolute",
        left: x - width / 2 + Math.sin(frame / 45) * 20,
        top: y - height / 2 + Math.cos(frame / 50) * 16,
        width,
        height,
        opacity,
        rotate: `${Math.sin(frame / 60) * 3}deg`,
        scale: String(1 + frame * 0.0006),
      }}
    />
  );
};
