import {useState, useMemo, FC, useCallback} from 'react';
import styled from 'styled-components';
import {OverflowCell, SubmenuOverflowCell, SubmenuRow} from '../grid';
import {PanelPane} from '../pane';
import {title, component} from '../../icons/adjust';
import {MacroDetailPane} from './submenus/macros/macro-detail';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {getSelectedConnectedDevice} from '../../../store/devicesSlice';
import {
  getExpressions,
  getMacroCount,
  saveMacros,
} from '../../../store/macrosSlice';

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 12px;
  padding-top: 0;
`;

const MenuContainer = styled.div`
  padding: 15px 10px 20px 10px;
`;

const MacroMenuRow = styled(SubmenuRow)`
  border-width: 0;
  text-align: center;
`;

export const Pane: FC = () => {
  const dispatch = useAppDispatch();
  const selectedDevice = useAppSelector(getSelectedConnectedDevice);
  const macroExpressions = useAppSelector(getExpressions);
  const macroCount = useAppSelector(getMacroCount);

  const [selectedMacro, setSelectedMacro] = useState(0);

  const saveMacro = useCallback(
    async (macro: string) => {
      if (!selectedDevice) {
        return;
      }

      const newMacros = macroExpressions.map((oldMacro, i) =>
        i === selectedMacro ? macro : oldMacro,
      );

      dispatch(saveMacros(selectedDevice, newMacros));
    },
    [macroExpressions, saveMacros, dispatch, selectedDevice, selectedMacro],
  );

  const macroMenus = useMemo(
    () =>
      Array(macroCount)
        .fill(0)
        .map((_, idx) => idx)
        .map((idx) => (
          <MacroMenuRow
            $selected={selectedMacro === idx}
            onClick={() => setSelectedMacro(idx)}
            key={idx}
          >
            {`M${idx}`}
          </MacroMenuRow>
        )),
    [selectedMacro, macroCount],
  );

  if (!selectedDevice) {
    return null;
  }
  return (
    <>
      <SubmenuOverflowCell>
        <MenuContainer>{macroMenus}</MenuContainer>
      </SubmenuOverflowCell>
      <OverflowCell>
        <PanelPane>
          <Container>
            <MacroDetailPane
              macroExpressions={macroExpressions}
              selectedMacro={selectedMacro}
              saveMacros={saveMacro}
              protocol={selectedDevice ? selectedDevice.protocol : -1}
            />
          </Container>
        </PanelPane>
      </OverflowCell>
    </>
  );
};

// TODO: these are used in the context that configure.tsx imports menus with props Icon, Title, Pane.
// Should we encapsulate this type and wrap the exports to conform to them?
export const Icon = component;
export const Title = title;
