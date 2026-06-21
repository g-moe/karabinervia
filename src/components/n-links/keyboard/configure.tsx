import type {VIAKey} from '@the-via/reader';
import {
  getSelectedDefinition,
  getSelectedKeyDefinitions,
} from 'src/store/definitionsSlice';
import {useAppSelector} from 'src/store/hooks';
import {getSelectedKeymap} from 'src/store/keymapSlice';
import {DisplayMode, NDimension} from 'src/types/keyboard-rendering';
import {KeyboardCanvas as StringKeyboardCanvas} from '../../two-string/keyboard-canvas';

const EMPTY_KEYMAP = [] as number[];

export const getKeyboardCanvas = (_dimension: NDimension) =>
  StringKeyboardCanvas;

export const ConfigureKeyboard = (props: {
  selectable?: boolean;
  dimensions?: DOMRect;
  nDimension: NDimension;
}) => {
  const {selectable, dimensions} = props;
  const matrixKeycodes = useAppSelector(
    (state) => getSelectedKeymap(state) || EMPTY_KEYMAP,
  );
  const keys: (VIAKey & {ei?: number})[] = useAppSelector(
    getSelectedKeyDefinitions,
  );
  const definition = useAppSelector(getSelectedDefinition);

  if (!definition || !dimensions) {
    return null;
  }

  const KeyboardCanvas = getKeyboardCanvas(props.nDimension);
  return (
    <KeyboardCanvas
      matrixKeycodes={matrixKeycodes}
      keys={keys}
      selectable={!!selectable}
      definition={definition}
      containerDimensions={dimensions}
      mode={DisplayMode.Configure}
    />
  );
};
