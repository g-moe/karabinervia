import { describe, expect, it } from "vitest";
import { getKarabinerLabels } from "../../src/karabiner/labels";
import {
  createDefaultWorkspace,
  keyAction,
  layerAction,
  saveWorkspace,
  setAssignment,
} from "../../src/karabiner/workspace";
import { assignment } from "../fixtures";
import { macbookLayoutKeys } from "../../src/karabiner/virtual-device";

const labelFor = (labels: any[], code: string) => {
  const index = macbookLayoutKeys.findIndex((key) => key.code === code);
  if (index < 0) {
    throw new Error(`Missing MacBook key ${code}`);
  }
  return labels[index];
};

describe("Karabiner labels", () => {
  it("renders Apple function-row legends as two-line labels", () => {
    const labels = getKarabinerLabels(0);

    expect(labelFor(labels, "KC_F1")).toMatchObject({
      topLabel: "☀︎−",
      bottomLabel: "F1",
    });
  });

  it("renders base number keys as shifted pairs and shifted letters uppercase", () => {
    expect(labelFor(getKarabinerLabels(0), "KC_1")).toMatchObject({
      topLabel: "!",
      bottomLabel: "1",
    });
    expect(labelFor(getKarabinerLabels(0, true), "KC_A")).toMatchObject({
      label: "A",
    });
  });

  it("shows hold layer names above custom tap labels", () => {
    let workspace = setAssignment(
      createDefaultWorkspace(),
      0,
      "KC_CAPS",
      assignment(keyAction("escape"), layerAction("layer_1")),
    );
    workspace = {
      ...workspace,
      layers: workspace.layers.map((layer) =>
        layer.id === "layer_1" ? { ...layer, name: "Nav" } : layer,
      ),
    };
    saveWorkspace(workspace);

    expect(labelFor(getKarabinerLabels(0), "KC_CAPS")).toMatchObject({
      topLabel: "Nav",
      bottomLabel: "esc",
    });
  });
});
