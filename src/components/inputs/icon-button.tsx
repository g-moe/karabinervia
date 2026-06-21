import styled from "styled-components";
import { controlReset, controlTransition, iconNavButtonSurface } from "./control-styles";

export const IconButton = styled.button`
  ${controlReset}
  width: 40px;
  position: relative;
  display: inline-block;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 10px 10px;
  line-height: initial;
  font-size: initial;
  border-radius: var(--radius_button);
  ${controlTransition}
  color: ${(props) =>
    props.disabled ? "var(--color_control-text-disabled)" : "var(--color_control-border)"};
  border-color: ${(props) =>
    props.disabled ? "var(--color_control-border-disabled)" : "var(--color_control-border)"};
  &:disabled {
    cursor: not-allowed;
    border-right: 1px solid var(--color_separator-opaque);
    cursor: not-allowed;
    background: var(--color_surface-menu);
  }
  &:hover {
    color: ${(props) =>
      props.disabled
        ? "var(--color_control-text-disabled)"
        : "var(--color_control-selected-subtle-text)"};
    border-color: ${(props) =>
      props.disabled ? "var(--color_control-border-disabled)" : "var(--color_control-border)"};
    border-right: 1px solid var(--color_separator-opaque);
    background-color: ${(props) =>
      props.disabled ? "var(--color_surface-menu)" : "var(--color_control-selected-subtle-bg)"};
  }

  svg {
    color: ${(props) =>
      props.disabled ? "var(--color_control-text-disabled)" : "var(--color_control-border)"};
  }
  &:hover {
    svg {
      color: ${(props) =>
        props.disabled
          ? "var(--color_control-text-disabled)"
          : "var(--color_control-selected-subtle-text)"};
    }

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

export const IconButtonUnfilledContainer = styled(IconButton)`
  cursor: pointer;
  background: inherit;
  border: 1px solid var(--color_control-border);
  width: 30px;
  height: 30px;
  justify-content: center;
  display: inline-flex;
  align-items: center;
`;

export const IconButtonContainer = styled(IconButton)`
  cursor: pointer;
  background: var(--color_control-background);
  border-right: 1px solid var(--color_separator-opaque);
`;

export const IconToggleContainer = styled.button<{ $selected: boolean }>`
  ${iconNavButtonSurface}
  width: 40px;
  display: inline-block;
  border-right: 1px solid var(--color_separator-opaque);
`;
