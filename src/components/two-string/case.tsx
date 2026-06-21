import React from 'react';
import {shallowEqual} from 'react-redux';
import {CSSVarObject} from 'src/utils/keyboard-rendering';
import styled from 'styled-components';

const CaseGroup = styled.div<{}>``;
const OuterCase = styled.div<{
  background: string;
  height: number;
  width: number;
}>`
  background: ${(props) => props.background};
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  border-radius: 8px;
  box-shadow: var(--box-shadow-keyboard);
`;
const InnerCase = styled.div<{
  background: string;
  height: number;
  width: number;
  $translateX: number;
  $translateY: number;
}>`
  background: ${(props) => props.background};
  top: 0;
  left: 0;
  position: absolute;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  transform: translate(
    ${(props) => props.$translateX}px,
    ${(props) => props.$translateY}px
  );
  box-shadow: var(--box-shadow-keyboard);
  border-radius: 8px;
`;

export const CaseInsideBorder = 10;

export const Case = React.memo((props: {width: number; height: number}) => {
  const properWidth =
    props.width * CSSVarObject.keyXPos - CSSVarObject.keyXSpacing;
  const properHeight =
    CSSVarObject.keyYPos * props.height - CSSVarObject.keyYSpacing;
  const insideBorder = CSSVarObject.insideBorder;
  const insideWidth = properWidth + insideBorder * 1;
  const outsideWidth = properWidth + insideBorder * 3;
  const [insideHeight, outsideHeight] = [
    properHeight + insideBorder,
    properHeight + insideBorder * 3,
  ];
  return (
    <CaseGroup>
      <OuterCase
        background="var(--color_keyboard-case)"
        width={outsideWidth}
        height={outsideHeight}
      ></OuterCase>
      <InnerCase
        background="linear-gradient(200deg, var(--color_keyboard-case) 40%, var(--color_app-background), var(--color_keyboard-case) 80%)"
        width={insideWidth}
        height={insideHeight}
        $translateX={insideWidth - properWidth}
        $translateY={insideHeight - properHeight}
      ></InnerCase>
    </CaseGroup>
  );
}, shallowEqual);
