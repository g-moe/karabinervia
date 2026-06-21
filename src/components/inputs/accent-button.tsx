import styled from "styled-components";
import { buttonSurface, selectedButtonSurface } from "./control-styles";

type AccentButtonProps = {
  disabled?: boolean;
  onClick?: (...a: any[]) => void;
};

const AccentButtonBase = styled.button<AccentButtonProps>`
  ${buttonSurface}
  height: 40px;
  padding: 0 15px;
  line-height: 40px;
  min-width: 100px;
  text-align: center;
  font-size: 20px;
  display: inline-block;
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;
export const AccentButton = styled(AccentButtonBase)`
  background-color: ${(props) =>
    props.disabled ? "var(--color_control-background-disabled)" : "var(--color_panel-background)"};
  color: ${(props) =>
    props.disabled ? "var(--color_control-text-disabled)" : "var(--color_control-text)"};
  border-color: ${(props) =>
    props.disabled ? "var(--color_control-border-disabled)" : "var(--color_control-border)"};
`;
export const AccentButtonLarge = styled(AccentButton)`
  font-size: 24px;
  line-height: 60px;
  height: 60px;
`;

export const PrimaryAccentButton = styled(AccentButtonBase)`
  ${selectedButtonSurface}
  color: ${(props) =>
    props.disabled ? "var(--color_control-text-disabled)" : "var(--color_control-selected-text)"};
  border-color: ${(props) =>
    props.disabled ? "var(--color_control-border-disabled)" : "var(--color_control-border)"};
  background-color: ${(props) =>
    props.disabled ? "transparent" : "var(--color_control-selected-bg)"};
`;
