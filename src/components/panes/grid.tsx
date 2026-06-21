import getIconColor from "../icons/get-icon-color";
import styled from "styled-components";
import { iconNavButtonSurface } from "../inputs/control-styles";

export const Grid = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: min-content min-content minmax(0, 1fr);
  > div {
    pointer-events: all;
  }
`;

export const Cell = styled.div`
  border-right: 1px solid var(--color_separator);
`;

export const MenuCell = styled(Cell)`
  background: var(--color_surface-menu);
  border-top: 1px solid var(--color_separator);
  width: 125px;
  box-sizing: border-box;
`;

export const OverflowCell = styled(Cell)`
  border-top: 1px solid var(--color_separator);
  overflow: auto;
`;

export const SpanOverflowCell = styled(Cell)`
  border-top: 1px solid var(--color_separator);
  overflow: auto;
  grid-column: span 2;
`;

export const SubmenuCell = styled(Cell)`
  border-top: 1px solid var(--color_separator);
  background: var(--color_control-background);
`;

export const SubmenuOverflowCell = styled(SubmenuCell)`
  min-width: 80px;
  overflow: auto;
  overflow-x: hidden; /* Override just the horizontal part */
`;

export const SinglePaneFlexCell = styled(Cell)`
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const ConfigureFlexCell = styled(SinglePaneFlexCell)`
  pointer-events: none;
  height: 500px;
`;

export const CategoryIconContainer = styled.span<{ $selected?: boolean }>`
  ${iconNavButtonSurface}
`;

export const IconContainer = styled.span`
  display: inline-block;
  text-align: center;
  width: 35px;
  position: relative;
  &:hover > span > div {
    background-color: var(--color_control-background-hover);
  }
`;

export const ControlRow = styled.div`
  position: relative;
  width: 100%;
  border-bottom: 1px solid var(--color_separator);
  font-size: 20px;
  justify-content: space-between;
  display: flex;
  line-height: 50px;
  min-height: 50px;
  box-sizing: border-box;
  padding-left: 5px;
  padding-right: 5px;
`;

export const IndentedControlRow = styled(ControlRow)`
  padding-left: 17px;
`;

export const Label = styled.label`
  color: var(--color_text-secondary);
  font-weight: 400;
`;

export const SubLabel = styled(Label)`
  font-size: 18px;
  font-style: italic;
  font-weight: 400;
`;

export const Detail = styled.span`
  color: var(--color_text-secondary);
  display: flex;
  align-items: center;
`;

export const Row = styled.div<{ $selected: boolean }>`
  cursor: pointer;
  white-space: nowrap;
  margin-bottom: 15px;
  font-size: 20px;
  line-height: 20px;
  text-transform: uppercase;
  color: ${(props) => getIconColor(props.$selected).style.color};
  border-left: 2px solid transparent;

  svg {
    height: 20px;
    vertical-align: middle;
  }

  &:hover {
    color: var(--color_text-primary);
    & .tooltip {
      transform: scale(1) translateX(0px);
      opacity: 1;
    }
  }
  .tooltip {
    transform: translateX(-5px) scale(0.6);
    opacity: 0;
  }
`;

export const SubmenuRow = styled(Row)`
  background: ${(props) => (props.$selected ? "var(--color_control-background)" : "inherit")};
  padding: 4px 8px;
  font-weight: 400;
  min-width: min-content;
  border-color: transparent;
  margin-bottom: 11px;
  color: ${(props) =>
    props.$selected ? "var(--color_text-primary)" : "var(--color_text-secondary)"};
  border-radius: 12px;
`;
