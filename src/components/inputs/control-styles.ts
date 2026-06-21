import { css } from "styled-components";

export const controlTransition = css`
  transition:
    background-color var(--duration_control) var(--ease_control),
    border-color var(--duration_control) var(--ease_control),
    color var(--duration_control) var(--ease_control),
    filter var(--duration_control) var(--ease_control),
    transform var(--duration_control) var(--ease_control);
`;

export const controlReset = css`
  appearance: none;
  outline: none;
  box-sizing: border-box;
  font: inherit;
`;

export const controlSurface = css`
  ${controlReset}
  background: var(--color_surface-menu);
  color: var(--color_control-text);
  border: 1px solid var(--color_control-border-subtle);
  border-radius: var(--radius_control);
  box-shadow: var(--box-shadow-control-raised);
  box-sizing: border-box;
  ${controlTransition}

  &:hover {
    border-color: var(--color_control-border);
  }

  &:focus,
  &:focus-visible {
    border-color: var(--color_control-border);
    outline: none;
  }

  &::placeholder {
    color: var(--color_control-text-muted);
  }

  &:disabled {
    background: var(--color_control-background-disabled);
    border-color: var(--color_control-border-disabled);
    color: var(--color_control-text-disabled);
    cursor: not-allowed;
  }
`;

export const buttonSurface = css`
  ${controlSurface}
  cursor: pointer;
  user-select: none;

  &:hover {
    border-color: var(--color_control-border);
    filter: var(--filter_control-hover);
  }
`;

export const inputSurface = css`
  ${controlSurface}
  height: 42px;
  min-width: 260px;
  padding: 0 12px;
  line-height: 42px;
`;

export const inlineInputSurface = css`
  ${controlReset}
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--color_control-border-subtle);
  color: var(--color_control-text);
  font-family: inherit;
  font-size: inherit;
  text-align: center;
  ${controlTransition}

  &:focus,
  &:focus-visible {
    border-bottom-color: var(--color_control-border);
    outline: none;
  }

  &::placeholder {
    color: var(--color_control-text-muted);
  }

  &:invalid,
  &:placeholder-shown {
    color: var(--color_error);
  }
`;

export const selectSurface = css`
  ${inputSurface}
  min-width: 320px;
  padding-right: 38px;
  line-height: normal;
  text-align: left;

  option {
    color: var(--color_control-text);
    background: var(--color_surface-menu);
  }
`;

export const textareaSurface = css`
  ${controlSurface}
  min-height: 140px;
  padding: 10px;
  resize: vertical;
  line-height: 1.4;
`;

export const scrimSurface = css`
  position: fixed;
  z-index: 10;
  pointer-events: all;
  inset: 0;
  background: var(--color_scrim);
`;

export const modalSurface = css`
  ${controlSurface}
  min-width: 460px;
  max-width: 550px;
  min-height: 170px;
  gap: 20px;
  border-color: var(--color_control-border);
  border-radius: var(--radius_menu);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 20px;
`;

export const roundSwatchSurface = css<{ $selected?: boolean }>`
  display: inline-block;
  height: 25px;
  width: 25px;
  border-radius: 50%;
  border: 2px solid
    ${(props) => (props.$selected ? "var(--color_accent)" : "var(--color_separator)")};
  cursor: pointer;
  box-sizing: border-box;
  ${controlTransition}

  &:hover {
    border-color: var(--color_control-border);
    filter: var(--filter_control-hover);
  }
`;

export const iconButtonGroupSurface = css`
  border-radius: var(--radius_button);
  border: 1px solid var(--color_separator-opaque);
  display: inline-flex;
  overflow: hidden;

  > button:last-child {
    border-right: none;
  }
`;

export const iconButtonGroupDividerSurface = css`
  background: var(--color_separator-opaque);
  width: 1px;
  height: 80%;
  margin: 0 10px;
`;

export const selectedButtonSurface = css`
  ${buttonSurface}
  background: var(--color_control-selected-bg);
  border-color: var(--color_control-selected-bg);
  color: var(--color_control-selected-text);
`;

export const subtleSelectedSurface = css<{ $selected?: boolean }>`
  background: ${(props) =>
    props.$selected ? "var(--color_control-selected-subtle-bg)" : "transparent"};
  border-color: ${(props) =>
    props.$selected ? "var(--color_control-selected-subtle-border)" : "transparent"};
  color: ${(props) =>
    props.$selected ? "var(--color_control-selected-subtle-text)" : "var(--color_text-primary)"};
`;

export const subtleSelectedHoverSurface = css<{ $selected?: boolean }>`
  &:hover {
    background: ${(props) =>
      props.$selected
        ? "var(--color_control-selected-subtle-bg)"
        : "var(--color_control-background-hover)"};
    border-color: ${(props) =>
      props.$selected ? "var(--color_control-selected-subtle-border)" : "transparent"};
    color: ${(props) =>
      props.$selected ? "var(--color_control-selected-subtle-text)" : "var(--color_text-primary)"};
  }
`;

export const iconNavButtonSurface = css<{ $selected?: boolean }>`
  ${controlReset}
  ${controlTransition}
  position: relative;
  width: 40px;
  height: 35px;
  border: 1px solid;
  border-radius: var(--radius_key-tile);
  ${subtleSelectedSurface}
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  svg {
    height: 20px;
    vertical-align: middle;
  }

  ${subtleSelectedHoverSurface}

  &:hover .tooltip {
    transform: scale(1) translateX(0px);
    opacity: 1;
  }

  .tooltip {
    transform: translateX(-5px) scale(0.6);
    opacity: 0;
  }
`;

export const pillButtonSurface = css<{ $selected?: boolean }>`
  ${controlReset}
  ${controlTransition}
  border: 1px solid;
  border-radius: var(--radius_button);
  ${subtleSelectedSurface}
  cursor: pointer;
  font-variant-numeric: tabular-nums;
  ${subtleSelectedHoverSurface}
`;

export const menuListSurface = css`
  padding: 0;
  border: 1px solid var(--color_separator-opaque);
  width: 160px;
  border-radius: var(--radius_menu);
  background-color: var(--color_surface-menu);
  margin: 5px 0 0;
  position: absolute;
  z-index: 11;
  overflow: hidden;
  ${controlTransition}
`;

export const dropdownMenuVisibility = css<{ $show: boolean }>`
  pointer-events: ${(props) => (props.$show ? "all" : "none")};
  opacity: ${(props) => (props.$show ? 1 : 0)};
  transform: ${(props) => (props.$show ? 0 : `translateY(-5px)`)};
`;

export const menuItemSurface = css<{ $selected?: boolean }>`
  ${controlReset}
  ${subtleSelectedSurface}
  ${controlTransition}
  display: block;
  width: 100%;
  border: none;
  cursor: pointer;
  font-variant-numeric: tabular-nums;
  font-size: 14px;
  text-align: left;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 5px 10px;

  &:hover {
    border: none;
    background: ${(props) =>
      props.$selected
        ? "var(--color_control-selected-subtle-bg)"
        : "var(--color_control-background-hover)"};
    color: ${(props) =>
      props.$selected ? "var(--color_control-selected-subtle-text)" : "var(--color_text-primary)"};
  }
`;
