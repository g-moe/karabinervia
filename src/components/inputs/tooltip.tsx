import { PropsWithChildren } from "react";
import styled, { css } from "styled-components";

type Direction = "top" | "bottom" | "left";

const tooltipTransition = css`
  transition:
    opacity var(--duration_control) var(--ease_control),
    transform var(--duration_control) var(--ease_control);
`;

const TooltipContainer = styled.div`
  position: absolute;
  z-index: 4;
  pointer-events: none;
  filter: var(--box-shadow-tooltip);
  ${tooltipTransition}
`;

const TooltipContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  padding: 5px 10px;
  border-radius: var(--radius_menu);
  background: var(--color_tooltip-bg);
  color: var(--color_tooltip-text);
  font-family: inherit;
  font-size: 18px;
  font-weight: 500;
  text-transform: uppercase;
  white-space: nowrap;
`;

const TooltipPointer = styled.div<{ $direction: Direction }>`
  position: absolute;
  width: 0;
  border-style: solid;
  border-color: transparent;

  ${(props) =>
    props.$direction === "top" &&
    css`
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 6px solid var(--color_tooltip-bg);
      margin-left: -6px;
    `}

  ${(props) =>
    props.$direction === "bottom" &&
    css`
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-bottom: 6px solid var(--color_tooltip-bg);
      margin-left: 15px;
      margin-top: -41px;
    `}

  ${(props) =>
    props.$direction === "left" &&
    css`
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
      border-right: 6px solid var(--color_tooltip-bg);
      margin-left: -9px;
      margin-top: -21px;
    `}
`;

const Keycap2DTooltipContainer = styled(TooltipContainer)`
  left: 50%;
  top: 0;
  margin-top: -40px;
  transform-origin: left;
`;

const Keycap2DTooltipContent = styled(TooltipContent)`
  padding: 5px 8px;
  font-size: 16px;
  transform: translateX(-50%);
`;

export const Keycap2DTooltip: React.FC<PropsWithChildren> = ({ children }) => (
  <Keycap2DTooltipContainer className="tooltip">
    <Keycap2DTooltipContent>{children}</Keycap2DTooltipContent>
    <TooltipPointer $direction="top" />
  </Keycap2DTooltipContainer>
);

const KeycapTooltipContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: -800px;
`;

const KeycapTooltipContent = styled(TooltipContent)`
  padding: 70px;
  border-radius: 100px;
  font-size: 200px;
  font-weight: 700;
  letter-spacing: 0;
`;

const KeycapTooltipPointer = styled.div`
  height: 150px;
  width: 150px;
  margin-top: -100px;
  transform: rotate(45deg);
  background: var(--color_tooltip-bg);
`;

export const KeycapTooltip: React.FC<PropsWithChildren> = ({ children }) => (
  <KeycapTooltipContainer className="tooltip">
    <KeycapTooltipContent>{children}</KeycapTooltipContent>
    <KeycapTooltipPointer />
  </KeycapTooltipContainer>
);

const FloatingTopTooltipContainer = styled(TooltipContainer)`
  top: 45px;
  left: 0;
  transform-origin: left;
`;

const FloatingTopTooltipContent = styled(TooltipContent)`
  transform: translateX(-50%);
  margin-left: 18px;
`;

export const CategoryMenuTooltip: React.FC<PropsWithChildren> = ({ children }) => (
  <FloatingTopTooltipContainer className="tooltip">
    <FloatingTopTooltipContent>{children}</FloatingTopTooltipContent>
    <TooltipPointer $direction="bottom" />
  </FloatingTopTooltipContainer>
);

const ProgressBarTooltipContainer = styled(TooltipContainer)`
  left: 50%;
  top: 0;
  margin-top: -40px;
  transform-origin: left;
`;

const ProgressBarTooltipContent = styled(TooltipContent)`
  transform: translateX(-50%);
`;

export const ProgressBarTooltip: React.FC<PropsWithChildren> = ({ children }) => (
  <ProgressBarTooltipContainer className="tooltip">
    <ProgressBarTooltipContent>{children}</ProgressBarTooltipContent>
    <TooltipPointer $direction="top" />
  </ProgressBarTooltipContainer>
);

const IconButtonTooltipContainer = styled(FloatingTopTooltipContainer)`
  top: 50px;
`;

export const IconButtonTooltip: React.FC<PropsWithChildren> = ({ children }) => (
  <IconButtonTooltipContainer className="tooltip">
    <FloatingTopTooltipContent>{children}</FloatingTopTooltipContent>
    <TooltipPointer $direction="bottom" />
  </IconButtonTooltipContainer>
);

const MenuTooltipContainer = styled(TooltipContainer)`
  top: 0;
  left: 45px;
  margin-top: -5px;
  transform-origin: left;
`;

const MenuTooltipContent = styled(TooltipContent)`
  padding: 5px;
  font-weight: 400;
  text-transform: none;
`;

export const MenuTooltip: React.FC<PropsWithChildren> = ({ children }) => (
  <MenuTooltipContainer className="tooltip">
    <MenuTooltipContent>{children}</MenuTooltipContent>
    <TooltipPointer $direction="left" />
  </MenuTooltipContainer>
);
