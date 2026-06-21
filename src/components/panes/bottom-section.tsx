import { PropsWithChildren, ReactNode } from "react";
import styled from "styled-components";
import { iconNavButtonSurface } from "../inputs/control-styles";
import { CategoryMenuTooltip } from "../inputs/tooltip";

export const BottomSection: React.FC<PropsWithChildren> = ({ children }) => (
  <BottomSectionOuter>
    <BottomSectionInner>{children}</BottomSectionInner>
  </BottomSectionOuter>
);

export const BottomSectionOuter = styled.div`
  pointer-events: none;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  border-top: 1px solid var(--color_separator);
`;

export const BottomSectionInner = styled.div`
  pointer-events: all;
  width: min(100%, 1280px);
  height: 100%;
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--color_separator);
  border-right: 1px solid var(--color_separator);
  background: var(--color_panel-background);
`;

export const BottomSectionTopBar = styled.div`
  background: var(--color_surface-menu);
  border-bottom: 1px solid var(--color_separator);
`;

export const BottomSectionNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 48px;
  padding: 8px 12px;
`;

export const BottomSectionContent = styled.div`
  flex: 1;
  min-height: 0;
  width: 100%;
  overflow: auto;

  > div {
    border-top: none;
    border-right: none;
  }
`;

const NavButton = styled.button<{ $selected: boolean }>`
  ${iconNavButtonSurface}
`;

export const BottomSectionNavItem = ({
  children,
  onClick,
  selected,
  tooltip,
}: PropsWithChildren<{
  onClick?: () => void;
  selected: boolean;
  tooltip: ReactNode;
}>) => (
  <NavButton
    type="button"
    aria-label={typeof tooltip === "string" ? tooltip : undefined}
    aria-pressed={selected}
    onClick={onClick}
    $selected={selected}
  >
    {children}
    <CategoryMenuTooltip>{tooltip}</CategoryMenuTooltip>
  </NavButton>
);
