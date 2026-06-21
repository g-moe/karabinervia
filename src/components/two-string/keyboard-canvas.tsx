import React, { useMemo } from "react";
import { shallowEqual } from "react-redux";
import { calculateKeyboardFrameDimensions, CSSVarObject } from "../../utils/keyboard-rendering";
import styled from "styled-components";
import { KeyboardCanvasProps, KeyboardCanvasContentProps } from "../../types/keyboard-rendering";
import { Case } from "./case";
import { KeyGroup } from "./key-group";
import { MatrixLines } from "./matrix-lines";
export const KeyboardCanvas: React.FC<KeyboardCanvasProps<React.MouseEvent>> = (props) => {
  const { containerDimensions, shouldHide, ...otherProps } = props;
  const { width, height } = useMemo(
    () => calculateKeyboardFrameDimensions(otherProps.keys),
    [otherProps.keys],
  );
  const containerHeight = containerDimensions.height;
  const minPadding = 35;
  const ratio =
    Math.min(
      Math.min(
        1,
        containerDimensions &&
          containerDimensions.width /
            ((CSSVarObject.keyWidth + CSSVarObject.keyXSpacing) * width -
              CSSVarObject.keyXSpacing +
              minPadding * 2),
      ),
      containerHeight /
        ((CSSVarObject.keyHeight + CSSVarObject.keyYSpacing) * height -
          CSSVarObject.keyYSpacing +
          minPadding * 2),
    ) || 1;

  return (
    <KeyboardCanvasFrame data-testid="keyboard-stage" $ratio={ratio} $hidden={shouldHide}>
      <KeyboardCanvasContent {...otherProps} width={width} height={height} />
    </KeyboardCanvasFrame>
  );
};
const KeyboardCanvasFrame = styled.div<{ $ratio: number; $hidden?: boolean }>`
  transform: scale(${(props) => props.$ratio}, ${(props) => props.$ratio});
  opacity: ${(props) => (props.$hidden ? 0 : 1)};
  position: absolute;
  pointer-events: ${(props) => (props.$hidden ? "none" : "all")};
`;
const KeyboardGroup = styled.div`
  position: relative;
`;

const KeyboardCanvasContent: React.FC<KeyboardCanvasContentProps<React.MouseEvent>> = React.memo(
  (props) => {
    const {
      matrixKeycodes,
      keys,
      definition,
      pressedKeys,
      mode,
      showMatrix,
      selectable,
      width,
      height,
    } = props;

    return (
      <KeyboardGroup>
        <Case width={width} height={height} />
        <KeyGroup
          {...props}
          keys={keys}
          mode={mode}
          matrixKeycodes={matrixKeycodes}
          selectable={selectable}
          definition={definition}
          pressedKeys={pressedKeys}
        />
        {showMatrix && (
          <MatrixLines
            keys={keys}
            rows={definition.matrix.rows}
            cols={definition.matrix.cols}
            width={width}
            height={height}
          />
        )}
      </KeyboardGroup>
    );
  },
  shallowEqual,
);
