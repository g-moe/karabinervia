import styled from 'styled-components';

export const KeycapContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 52px;
  height: 54px;
  &:hover {
    z-index: 1;
    & .tooltip {
      transform: scale(1) translateY(0px);
      opacity: 1;
    }
  }
  .tooltip {
    transform: translateY(5px) scale(0.6);
    opacity: 0;
  }
`;

export const TooltipContainer = styled.div<{$rotate: number}>`
  position: absolute;
  transform: rotate(${(p) => p.$rotate}rad);
  width: 100%;
  height: 100%;
  bottom: 0;
`;

export const TestOverlay = styled.div`
  transition:
    opacity var(--duration_control) var(--ease_control),
    transform var(--duration_control) var(--ease_control);
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
`;

export const CanvasContainerBG = styled.div<{}>``;
export const CanvasContainer = styled.div<{}>`
  box-shadow: var(--box-shadow-keycap);
`;
