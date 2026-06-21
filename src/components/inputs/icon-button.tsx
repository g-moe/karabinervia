import styled from 'styled-components';

export const IconButton = styled.button`
  appearance: none;
  width: 40px;
  position: relative;
  display: inline-block;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 10px 10px;
  line-height: initial;
  font-size: initial;
  color: ${(props) =>
    props.disabled
      ? 'var(--color_control-text-disabled)'
      : 'var(--color_control-border)'};
  border-color: ${(props) =>
    props.disabled
      ? 'var(--color_control-border-disabled)'
      : 'var(--color_control-border)'};
  &:disabled {
    cursor: not-allowed;
    border-right: 1px solid var(--border_color_icon);
    cursor: not-allowed;
    background: var(--bg_menu);
  }
  &:hover {
    color: ${(props) =>
      props.disabled
        ? 'var(--color_control-text-disabled)'
        : 'var(--color_control-selected-text)'};
    border-color: ${(props) =>
      props.disabled
        ? 'var(--color_control-border-disabled)'
        : 'var(--color_control-border)'};
    border-right: 1px solid var(--border_color_icon);
    background-color: ${(props) =>
      props.disabled ? 'var(--bg_menu)' : 'var(--color_control-selected-bg)'};
  }

  svg {
    color: ${(props) =>
      props.disabled
        ? 'var(--color_control-text-disabled)'
        : 'var(--color_control-border)'};
  }
  &:hover {
    svg {
      color: ${(props) =>
        props.disabled
          ? 'var(--color_control-text-disabled)'
          : 'var(--color_control-selected-text)'};
    }

    color: var(--color_label-highlighted);
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
  background: var(--bg_control);
  border-right: 1px solid var(--border_color_icon);
`;

export const IconToggleContainer = styled(IconButton)<{$selected: boolean}>`
  cursor: pointer;
  transition: all 0.4s ease;
  background: ${(props) =>
    props.$selected ? 'var(--color_control-selected-bg)' : 'var(--bg_menu)'};
  svg {
    color: ${(props) =>
      props.$selected ? 'var(--color_control-selected-text)' : 'var(--bg_icon)'};
  }
  &:hover {
    background: ${(props) =>
      props.$selected ? 'var(--color_control-selected-bg)' : 'var(--bg_menu)'};
    svg {
      color: ${(props) =>
        props.$selected
          ? 'var(--color_control-selected-text)'
          : 'var(--bg_icon)'};
    }
  }
  border-right: 1px solid var(--border_color_icon);
`;
