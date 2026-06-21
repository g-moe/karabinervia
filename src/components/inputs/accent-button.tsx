import styled from 'styled-components';

type AccentButtonProps = {
  disabled?: boolean;
  onClick?: (...a: any[]) => void;
};

const AccentButtonBase = styled.button<AccentButtonProps>`
  height: 40px;
  padding: 0 15px;
  line-height: 40px;
  min-width: 100px;
  text-align: center;
  outline: none;
  font-size: 20px;
  border-radius: var(--radius_control);
  color: var(--color_control-border);
  border: 1px solid var(--color_control-border);
  display: inline-block;
  box-sizing: border-box;
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};

  &:hover {
    border: 1px solid var(--color_control-border);
  }
`;
export const AccentButton = styled(AccentButtonBase)`
  background-color: ${(props) =>
    props.disabled ? 'var(--bg_control-disabled)' : 'var(--bg_outside-accent)'};
  color: ${(props) =>
    props.disabled
      ? 'var(--color_control-text-disabled)'
      : 'var(--color_control-text)'};
  border-color: ${(props) =>
    props.disabled
      ? 'var(--color_control-border-disabled)'
      : 'var(--color_control-border)'};

  &:hover {
    filter: brightness(0.7);
  }
`;
export const AccentButtonLarge = styled(AccentButton)`
  font-size: 24px;
  line-height: 60px;
  height: 60px;
`;

export const PrimaryAccentButton = styled(AccentButtonBase)`
  color: ${(props) =>
    props.disabled
      ? 'var(--color_control-text-disabled)'
      : 'var(--color_control-selected-text)'};
  border-color: ${(props) =>
    props.disabled
      ? 'var(--color_control-border-disabled)'
      : 'var(--color_control-border)'};
  background-color: ${(props) =>
    props.disabled ? 'transparent' : 'var(--color_control-selected-bg)'};
  &:hover {
    filter: brightness(0.7);
  }
`;
