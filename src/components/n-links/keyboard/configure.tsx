import type { VIAKey } from "@the-via/reader";
import { getSelectedDefinition, getSelectedKeyDefinitions } from "src/store/definitionsSlice";
import { useAppSelector } from "src/store/hooks";
import { getSelectedKeymap } from "src/store/keymapSlice";
import { DisplayMode, NDimension } from "src/types/keyboard-rendering";
import { KeyboardCanvas as StringKeyboardCanvas } from "../../two-string/keyboard-canvas";
import { KARABINER_VIA_VENDOR_PRODUCT_ID, macbookLayoutKeys } from "src/karabiner/virtual-device";

const EMPTY_KEYMAP = [] as number[];

export const getKeyboardCanvas = (_dimension: NDimension) => StringKeyboardCanvas;

export const ConfigureKeyboard = (props: {
  selectable?: boolean;
  dimensions?: DOMRect;
  nDimension: NDimension;
}) => {
  const { selectable, dimensions } = props;
  const matrixKeycodes = useAppSelector((state) => getSelectedKeymap(state) || EMPTY_KEYMAP);
  const keys: (VIAKey & { ei?: number })[] = useAppSelector(getSelectedKeyDefinitions);
  const definition = useAppSelector(getSelectedDefinition);

  if (!definition || !dimensions) {
    return null;
  }

  const isVirtualMacBook =
    typeof definition !== "string" &&
    definition.vendorProductId === KARABINER_VIA_VENDOR_PRODUCT_ID;
  const KeyboardCanvas = getKeyboardCanvas(props.nDimension);
  return (
    <KeyboardCanvas
      matrixKeycodes={matrixKeycodes}
      keys={keys}
      keyMetadata={isVirtualMacBook ? macbookLayoutKeys : undefined}
      selectable={!!selectable}
      definition={definition}
      containerDimensions={dimensions}
      mode={DisplayMode.Configure}
    />
  );
};
