import {FC, useState} from 'react';
import styled from 'styled-components';
import {ErrorMessage} from '../../styled';
import {AccentUploadButton} from '../../inputs/accent-upload-button';
import {AccentButton} from '../../inputs/accent-button';
import {title, component} from '../../icons/save';
import {PanelPane} from '../pane';
import {Detail, Label, ControlRow, SpanOverflowCell} from '../grid';
import {saveRawKeymapToDevice} from 'src/store/keymapSlice';
import {useAppDispatch, useAppSelector} from 'src/store/hooks';
import {getSelectedConnectedDevice} from 'src/store/devicesSlice';
import {useTranslation} from 'react-i18next';
import {downloadKarabiner, downloadProject} from 'src/karabiner/export';
import {
  createDefaultWorkspace,
  saveWorkspace,
  workspaceToViaLayers,
} from 'src/karabiner/workspace';

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0 12px;
`;

export const Pane: FC = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const selectedDevice = useAppSelector(getSelectedConnectedDevice);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!selectedDevice) {
    return null;
  }

  const loadKarabinerProject = ([file]: Blob[]) => {
    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const workspace = JSON.parse((reader as any).result.toString());
        saveWorkspace(workspace);
        dispatch(
          saveRawKeymapToDevice(
            workspaceToViaLayers(workspace).map((layer) => layer.keymap),
            selectedDevice,
          ),
        );
      } catch (error) {
        setErrorMessage(t('Could not load file: invalid data.'));
      }
    };
    reader.readAsText(file);
  };

  const resetWorkspace = () => {
    setErrorMessage(null);
    const workspace = createDefaultWorkspace();
    saveWorkspace(workspace);
    dispatch(
      saveRawKeymapToDevice(
        workspaceToViaLayers(workspace).map((layer) => layer.keymap),
        selectedDevice,
      ),
    );
  };

  return (
    <SpanOverflowCell>
      <PanelPane>
        <Container>
          <ControlRow>
            <Label>{t('Export Project')}</Label>
            <Detail>
              <AccentButton onClick={() => downloadProject()}>
                {t('Save')}
              </AccentButton>
            </Detail>
          </ControlRow>
          <ControlRow>
            <Label>{t('Import Project')}</Label>
            <Detail>
              <AccentUploadButton onLoad={loadKarabinerProject}>
                {t('Load')}
              </AccentUploadButton>
            </Detail>
          </ControlRow>
          <ControlRow>
            <Label>{t('Export Karabiner')}</Label>
            <Detail>
              <AccentButton onClick={() => downloadKarabiner()}>
                {t('Save')}
              </AccentButton>
            </Detail>
          </ControlRow>
          <ControlRow>
            <Label>{t('Reset Workspace')}</Label>
            <Detail>
              <AccentButton onClick={resetWorkspace}>{t('Reset')}</AccentButton>
            </Detail>
          </ControlRow>
          {errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}
        </Container>
      </PanelPane>
    </SpanOverflowCell>
  );
};

export {title as Title, component as Icon};
