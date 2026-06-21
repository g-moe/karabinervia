import type { VIADefinitionV2, VIADefinitionV3 } from "@the-via/reader";
import type { VIAKey } from "@the-via/reader";
import { useCallback, useContext, useEffect, useMemo } from "react";
import { TestKeyboardSounds } from "../../void/test-keyboard-sounds";
import { getSelectedDefinition, getSelectedKeyDefinitions } from "../../../store/definitionsSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { getSelectedKeymap, setLayer } from "../../../store/keymapSlice";
import { getTestKeyboardSoundsSettings } from "../../../store/settingsSlice";
import { DisplayMode, NDimension } from "../../../types/keyboard-rendering";
import { TestKeyState } from "../../../types/types";
import { matrixKeycodes } from "../../../utils/key-event";
import { getKeyboardRowPartitions } from "../../../utils/keyboard-rendering";
import { useGlobalKeys } from "../../../utils/use-global-keys";
import { useLocation } from "wouter";
import { TestContext } from "../../panes/test";
import { getKeyboardCanvas } from "./configure";
import {
  KARABINER_VIA_VENDOR_PRODUCT_ID,
  macbookEditableKeys,
  macbookLayoutKeys,
  macbookKeys,
} from "../../../karabiner/virtual-device";
import basicKeyToByte from "../../../utils/key-to-byte/default";
const EMPTY_ARR = [] as any[];
const EMPTY_KEYMAP = [] as number[];

export const Test = (props: { dimensions?: DOMRect; nDimension: NDimension }) => {
  const dispatch = useAppDispatch();
  const [path] = useLocation();
  const isShowingTest = path === "/test";
  const selectedDefinition = useAppSelector(getSelectedDefinition);
  const keyDefinitions = useAppSelector(getSelectedKeyDefinitions);
  const testKeyboardSoundsSettings = useAppSelector(getTestKeyboardSoundsSettings);
  const selectedMatrixKeycodes = useAppSelector(
    (state) => getSelectedKeymap(state) || EMPTY_KEYMAP,
  );
  const isVirtualMacBook =
    !!selectedDefinition &&
    typeof selectedDefinition !== "string" &&
    selectedDefinition.vendorProductId === KARABINER_VIA_VENDOR_PRODUCT_ID;
  const activeDefinition = isVirtualMacBook ? selectedDefinition : null;

  const [globalPressedKeys, setGlobalPressedKeys] = useGlobalKeys(isShowingTest);

  const clearTestKeys = useCallback(() => {
    setGlobalPressedKeys(EMPTY_ARR);
  }, [setGlobalPressedKeys]);

  const testDefinition = activeDefinition;
  const testKeys = keyDefinitions;
  const matrixCols = testDefinition?.matrix.cols ?? 0;

  const handleKeycapClick = useCallback(
    (_evt: unknown, idx: number) => {
      const clickedKey = (
        testKeys as Array<{ row: number; col: number; displayOnly?: boolean } | undefined>
      )[idx];
      if (!clickedKey || clickedKey.displayOnly) {
        return;
      }
      const byte =
        basicKeyToByte[
          macbookEditableKeys.find(
            (key) => key.row === clickedKey.row && key.col === clickedKey.col,
          )?.code as keyof typeof basicKeyToByte
        ];
      const globalIndex = matrixKeycodes.indexOf(byte);
      if (globalIndex < 0) {
        return;
      }

      setGlobalPressedKeys((pressedKeys) => ({
        ...pressedKeys,
        [globalIndex]: TestKeyState.KeyDown,
      }));
      window.setTimeout(() => {
        setGlobalPressedKeys((pressedKeys) => ({
          ...pressedKeys,
          [globalIndex]: TestKeyState.KeyUp,
        }));
      }, 160);
    },
    [setGlobalPressedKeys, testKeys],
  );

  const testContext = useContext(TestContext);
  //// Hack to share setting a local state to avoid causing cascade of rerender
  useEffect(() => {
    if (testContext[0].clearTestKeys !== clearTestKeys) {
      testContext[1]({ clearTestKeys });
    }
  }, [testContext, clearTestKeys]);

  useEffect(() => {
    // Remove event listeners on cleanup
    if (path !== "/test") {
      testContext[0].clearTestKeys();
    }
    if (path !== "/") {
      dispatch(setLayer(0));
    }
  }, [path]); // Empty array ensures that effect is only run on mount and unmount

  const virtualGlobalPressedKeys = testDefinition
    ? macbookKeys.reduce((pressedKeys, key) => {
        const byte = basicKeyToByte[key.code as keyof typeof basicKeyToByte];
        pressedKeys[key.row * matrixCols + key.col] =
          globalPressedKeys[matrixKeycodes.indexOf(byte)];
        return pressedKeys;
      }, [] as TestKeyState[])
    : [];

  const testPressedKeys = macbookLayoutKeys.map((key) =>
    key.displayOnly ? undefined : virtualGlobalPressedKeys[key.row * matrixCols + key.col],
  ) as TestKeyState[];

  const { partitionedKeys } = useMemo(
    () => getKeyboardRowPartitions(testKeys as VIAKey[]),
    [testKeys],
  );
  const partitionedPressedKeys: TestKeyState[][] = partitionedKeys.map((rowArray) => {
    return rowArray.map(
      ({ row, col }: { row: number; col: number }) =>
        virtualGlobalPressedKeys[row * matrixCols + col],
    ) as TestKeyState[];
  });

  if (!testDefinition) {
    return null;
  }

  return (
    <>
      <TestKeyboard
        definition={testDefinition as VIADefinitionV2}
        keys={testKeys as VIAKey[]}
        keyMetadata={macbookLayoutKeys}
        pressedKeys={testPressedKeys}
        selectable={true}
        onKeycapClick={handleKeycapClick}
        matrixKeycodes={selectedMatrixKeycodes}
        containerDimensions={props.dimensions}
        nDimension={props.nDimension}
      />
      {partitionedPressedKeys && testKeyboardSoundsSettings.isEnabled && (
        <TestKeyboardSounds pressedKeys={partitionedPressedKeys} />
      )}
    </>
  );
};

const TestKeyboard = (props: {
  selectable?: boolean;
  containerDimensions?: DOMRect;
  pressedKeys?: TestKeyState[];
  matrixKeycodes: number[];
  onKeycapClick?: (evt: unknown, idx: number) => void;
  keys: (VIAKey & { ei?: number })[];
  keyMetadata?: typeof macbookLayoutKeys;
  definition: VIADefinitionV2 | VIADefinitionV3;
  nDimension: NDimension;
}) => {
  const {
    selectable,
    containerDimensions,
    matrixKeycodes,
    onKeycapClick,
    keys,
    keyMetadata,
    pressedKeys,
    definition,
    nDimension,
  } = props;
  if (!containerDimensions) {
    return null;
  }

  const KeyboardCanvas = getKeyboardCanvas(nDimension);
  return (
    <KeyboardCanvas
      matrixKeycodes={matrixKeycodes}
      keys={keys}
      keyMetadata={keyMetadata}
      selectable={!!selectable}
      onKeycapClick={onKeycapClick as never}
      definition={definition}
      pressedKeys={pressedKeys}
      containerDimensions={containerDimensions}
      mode={DisplayMode.Test}
    />
  );
};
