import {faXmarkCircle} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {PropsWithChildren} from 'react';
import styled from 'styled-components';
const DeletableContainer = styled.div<{$disabled: boolean}>`
  display: inline-flex;
  vertical-align: middle;
  position: relative;
  pointer-events: ${(props) => (props.$disabled ? 'none' : 'all')};

  svg {
    color: var(--color_text-primary);
    position: absolute;
    right: -5px;
    top: 6px;
    opacity: 0;
    cursor: pointer;
    transition: transform 0.2s ease-in-out;
    background: var(--color_control-background);
    border-radius: 50%;
    transform: scale(0.8);
  }
  &:hover svg {
    opacity: 1;
    transform: scale(1);
  }
`;

export const Deletable: React.FC<
  PropsWithChildren<{
    index: number;
    disabled: boolean;
    deleteItem: (index: number) => void;
  }>
> = (props) => {
  return (
    <DeletableContainer $disabled={props.disabled}>
      {props.children}
      <FontAwesomeIcon
        icon={faXmarkCircle}
        size={'lg'}
        onClick={() => props.deleteItem(props.index)}
      />
    </DeletableContainer>
  );
};
