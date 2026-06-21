import type { VIAKey } from "@the-via/reader";
import { describe, expect, it } from "vitest";
import {
  calculateKeyboardFrameDimensions,
  getBoundingBox,
  getComboKeyProps,
} from "src/utils/keyboard-rendering";

const viaKey = (key: {
  x: number;
  y: number;
  w: number;
  h: number;
  x2?: number;
  y2?: number;
  w2?: number;
  h2?: number;
}) => ({
  ...key,
  col: 0,
  color: "alpha" as VIAKey["color"],
  d: false,
  r: 0,
  row: 0,
  rx: 0,
  ry: 0,
});

describe("keyboard rendering geometry", () => {
  it("calculates bounding boxes for split keys", () => {
    expect(getBoundingBox({ x: 1, y: 2, w: 1, h: 1, x2: -1, y2: 1, w2: 2, h2: 1 })).toEqual({
      xStart: 0,
      xEnd: 2,
      yStart: 2,
      yEnd: 4,
    });
  });

  it("accounts for rotated extents", () => {
    const box = getBoundingBox({ x: 1, y: 0, w: 2, h: 1, r: 90, rx: 1, ry: 0 });

    expect(box.xStart).toBeCloseTo(0);
    expect(box.xEnd).toBeCloseTo(1);
    expect(box.yStart).toBeCloseTo(0);
    expect(box.yEnd).toBeCloseTo(2);
  });

  it("calculates frame dimensions from all key extents", () => {
    expect(
      calculateKeyboardFrameDimensions([
        { x: 0, y: 0, w: 1, h: 1 },
        { x: 2, y: 1, w: 2, h: 1.5 },
      ]),
    ).toEqual({ width: 4, height: 2.5 });
  });

  it("normalizes combo-key rectangles for CSS clipping", () => {
    const combo = getComboKeyProps(
      viaKey({
        x: 1,
        y: 1,
        w: 1.25,
        h: 1,
        x2: 0.25,
        y2: 1,
        w2: 1,
        h2: 1,
      }),
    );

    expect(combo.clipPath).toBe(
      "polygon(0% 0%,20% 0%,20% 100%,100% 100%,100% 0%,100% 0%,100% 100%,100% 100%,100% 200%,20% 200%,20% 100%,0% 100%)",
    );
    expect(combo.normalizedRects).toEqual([
      [0.25, 1, 1, 1],
      [0, 0, 1.25, 1],
    ]);
  });
});
