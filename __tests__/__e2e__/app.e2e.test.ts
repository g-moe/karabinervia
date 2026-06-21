import { readFile, writeFile } from "node:fs/promises";
import { expect, type Page, test } from "@playwright/test";

const workspaceKey = "karabinervia.workspace.v1";

const assignment = async (page: Page, layerIndex: number, code: string) =>
  page.evaluate(
    ({ key, layerIndex, code }) =>
      JSON.parse(localStorage.getItem(key) ?? "{}").layers?.[layerIndex]?.assignments?.[code],
    { key: workspaceKey, layerIndex, code },
  );

const keycap = (page: Page, code: string) =>
  page.getByTestId("keyboard-route-configure").locator(`[data-testid="keycap-${code}"]`);

const testKeycap = (page: Page, code: string) =>
  page.getByTestId("keyboard-route-test").locator(`[data-testid="keycap-${code}"]`);

test("configures a shortcut tap action and restores it after reload", async ({ page }) => {
  await page.goto("/");
  await expect(keycap(page, "KC_A")).toBeVisible();
  await expect(page.getByText("Select a key")).toBeVisible();

  await keycap(page, "KC_CAPS").click();
  await expect(page.getByTestId("selected-key-label")).toHaveText("CAPS");
  await expect(page.getByText("Selected Key")).toBeVisible();
  await page.getByTestId("tap-type").selectOption("shortcut");
  await page.getByTestId("tap-main-key").selectOption("c");
  await page.getByTestId("tap-modifier-left_command").check();

  await expect
    .poll(() => assignment(page, 0, "KC_CAPS"))
    .toMatchObject({
      tap: {
        kind: "shortcut",
        keyCode: "c",
        modifiers: ["left_command"],
      },
    });

  await page.reload();
  await keycap(page, "KC_CAPS").click();
  await expect(page.getByTestId("tap-type")).toHaveValue("shortcut");
  await expect(page.getByTestId("tap-main-key")).toHaveValue("c");
  await expect(page.getByTestId("tap-modifier-left_command")).toBeChecked();
});

test("configures a hold layer without changing the tap action", async ({ page }) => {
  await page.goto("/");
  await keycap(page, "KC_SPC").click();
  await page.getByTestId("hold-type").selectOption("layer");
  await page.getByTestId("hold-layer").selectOption({ label: "Layer 1" });

  await expect
    .poll(() => assignment(page, 0, "KC_SPC"))
    .toMatchObject({
      tap: { kind: "key", keyCode: "spacebar" },
      hold: { kind: "layer", layerId: "layer_1" },
    });

  await page.goto("/test");
  await expect(page.getByText("Reset Keyboard")).toBeVisible();
  await page.goto("/");
  await keycap(page, "KC_SPC").click();
  await expect(page.getByTestId("hold-type")).toHaveValue("layer");
});

test("exports, resets, and imports a project workspace", async ({ page }) => {
  await page.goto("/");
  await keycap(page, "KC_CAPS").click();
  await page.getByTestId("tap-type").selectOption("shortcut");
  await page.getByTestId("tap-main-key").selectOption("c");
  await page.getByTestId("tap-modifier-left_command").check();

  await page.getByRole("button", { name: "Save + Load" }).click();
  const projectDownloadPromise = page.waitForEvent("download");
  await page.getByTestId("project-export").click();
  const projectDownload = await projectDownloadPromise;
  expect(projectDownload.suggestedFilename()).toBe("karabinervia-project.json");
  const projectPath = await projectDownload.path();
  expect(projectPath).toBeTruthy();

  const project = JSON.parse(await readFile(projectPath!, "utf8"));
  expect(project.version).toBe(1);
  expect(project.layers[0].assignments.KC_CAPS).toMatchObject({
    tap: {
      kind: "shortcut",
      keyCode: "c",
      modifiers: ["left_command"],
    },
  });

  await page.getByTestId("workspace-reset").click();
  await expect
    .poll(() => assignment(page, 0, "KC_CAPS"))
    .toMatchObject({
      tap: { kind: "key", keyCode: "caps_lock" },
    });

  const importPath = test.info().outputPath("project-import.json");
  await writeFile(
    importPath,
    JSON.stringify({
      version: 1,
      layers: [
        {
          id: "base",
          name: "Base",
          assignments: {
            KC_CAPS: {
              tap: {
                kind: "shortcut",
                keyCode: "c",
                modifiers: ["left_command"],
              },
              hold: { kind: "transparent" },
            },
          },
        },
      ],
    }),
  );
  await page.getByTestId("project-import-input").setInputFiles(importPath);
  await expect
    .poll(() => assignment(page, 0, "KC_CAPS"))
    .toMatchObject({
      tap: {
        kind: "shortcut",
        keyCode: "c",
        modifiers: ["left_command"],
      },
    });
  await page.getByRole("button", { name: "Keymap" }).click();
  await keycap(page, "KC_CAPS").click();
  await expect(page.getByTestId("tap-type")).toHaveValue("shortcut");
  await expect(page.getByTestId("tap-main-key")).toHaveValue("c");
  await expect(page.getByTestId("tap-modifier-left_command")).toBeChecked();
});

test("rejects invalid project import without replacing the workspace", async ({ page }) => {
  await page.goto("/");
  await keycap(page, "KC_CAPS").click();
  await page.getByTestId("tap-key").selectOption("escape");
  await expect
    .poll(() => assignment(page, 0, "KC_CAPS"))
    .toMatchObject({
      tap: { kind: "key", keyCode: "escape" },
    });

  await page.getByRole("button", { name: "Save + Load" }).click();
  const invalidPath = test.info().outputPath("invalid-project.json");
  await writeFile(invalidPath, JSON.stringify({ version: 1, layers: [] }));
  await page.getByTestId("project-import-input").setInputFiles(invalidPath);

  await expect(page.getByTestId("import-error-message")).toHaveText(
    "Could not load file: invalid data.",
  );
  await expect
    .poll(() => assignment(page, 0, "KC_CAPS"))
    .toMatchObject({
      tap: { kind: "key", keyCode: "escape" },
    });
});

test("exports Karabiner JSON for a layer-hold workflow", async ({ page }) => {
  await page.goto("/");
  await keycap(page, "KC_CAPS").click();
  await page.getByTestId("tap-key").selectOption("escape");
  await page.getByTestId("hold-type").selectOption("layer");
  await page.getByTestId("hold-layer").selectOption({ label: "Layer 1" });

  await page.getByRole("button", { name: "Layer 1" }).click();
  await keycap(page, "KC_H").click();
  await page.getByTestId("tap-type").selectOption("key");
  await page.getByTestId("tap-key").selectOption("left_arrow");

  await page.getByRole("button", { name: "Save + Load" }).click();
  const karabinerDownloadPromise = page.waitForEvent("download");
  await page.getByTestId("karabiner-export").click();
  const karabinerDownload = await karabinerDownloadPromise;
  expect(karabinerDownload.suggestedFilename()).toBe("karabinervia-karabiner.json");
  const karabinerPath = await karabinerDownload.path();
  expect(karabinerPath).toBeTruthy();

  const karabiner = JSON.parse(await readFile(karabinerPath!, "utf8"));
  const manipulators: any[] = karabiner.rules[0].manipulators;

  expect(karabiner.title).toBe("KarabinerVIA generated MacBook layers");
  expect(
    manipulators.some(
      (manipulator) =>
        manipulator.from.key_code === "caps_lock" &&
        manipulator.to_if_alone?.[0]?.key_code === "escape" &&
        manipulator.to_if_held_down?.[0]?.set_variable?.name === "karabinervia_layer_layer_1" &&
        manipulator.to_after_key_up?.[0]?.set_variable?.value === 0,
    ),
  ).toBe(true);
  expect(
    manipulators.some(
      (manipulator) =>
        manipulator.from.key_code === "h" &&
        manipulator.to?.[0]?.key_code === "left_arrow" &&
        manipulator.conditions?.[0]?.type === "variable_if" &&
        manipulator.conditions?.[0]?.name === "karabinervia_layer_layer_1",
    ),
  ).toBe(true);
});

test("key tester route renders its own MacBook keyboard surface", async ({ page }) => {
  await page.goto("/test");

  await expect(page).toHaveURL("/test");
  await expect(page.getByText("Reset Keyboard")).toBeVisible();
  await expect(testKeycap(page, "KC_A")).toBeVisible();

  await page.goto("/");
  await expect(page).toHaveURL("/");
  await expect(keycap(page, "KC_A")).toBeVisible();
});

test("404 back navigation remounts the keyboard", async ({ page }) => {
  await page.goto("/missing-route");

  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
  await page.getByRole("link", { name: "Back to keyboard" }).click();

  await expect(page).toHaveURL("/");
  await expect(keycap(page, "KC_A")).toBeVisible();
});
