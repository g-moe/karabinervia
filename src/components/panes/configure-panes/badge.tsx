import styled from 'styled-components';
import {useAppSelector} from 'src/store/hooks';
import {getSelectedDefinition} from 'src/store/definitionsSlice';
import {controlTransition} from 'src/components/inputs/control-styles';

const Container = styled.div`
  position: absolute;
  right: 15px;
  top: 0px;
  font-size: 18px;
  pointer-events: none;
  font-weight: 400;
`;

const KeyboardTitle = styled.label`
  pointer-events: none;
  display: inline-block;
  background: var(--color_control-selected-subtle-bg);
  border-bottom-left-radius: var(--radius_menu);
  border-bottom-right-radius: var(--radius_menu);
  font-size: 18px;
  text-transform: uppercase;
  color: var(--color_control-selected-subtle-text);
  padding: 1px 10px;
  margin-right: 10px;
  border: solid 1px var(--color_control-selected-subtle-border);
  border-top: none;
  ${controlTransition}
`;

export const Badge = () => {
  const selectedDefinition = useAppSelector(getSelectedDefinition);

  if (!selectedDefinition) {
    return null;
  }

  return (
    <Container>
      <KeyboardTitle>{selectedDefinition.name}</KeyboardTitle>
    </Container>
  );
};
