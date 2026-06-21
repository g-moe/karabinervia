import React, {FC, useContext} from 'react';
import fullKeyboardDefinition from '../../utils/test-keyboard-definition.json';
import {Pane} from './pane';
import styled from 'styled-components';
import {PROTOCOL_GAMMA} from '../../utils/keyboard-api';
import {ControlRow, Label, Detail} from './grid';
import {
  BottomSection,
  BottomSectionContent,
  BottomSectionNav,
  BottomSectionNavItem,
  BottomSectionTopBar,
} from './bottom-section';
import {AccentSlider} from '../inputs/accent-slider';
import {AccentButton} from '../inputs/accent-button';
import {useDispatch} from 'react-redux';
import {useAppSelector} from 'src/store/hooks';
import {getSelectedConnectedDevice} from 'src/store/devicesSlice';
import {
  getSelectedDefinition,
  getSelectedKeyDefinitions,
} from 'src/store/definitionsSlice';
import {
  getIsTestMatrixEnabled,
  setTestMatrixEnabled,
  getTestKeyboardSoundsSettings,
  setTestKeyboardSoundsSettings,
} from 'src/store/settingsSlice';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleQuestion} from '@fortawesome/free-solid-svg-icons';
import {useProgress} from '@react-three/drei';
import {AccentSelect} from '../inputs/accent-select';
import {AccentRange} from '../inputs/accent-range';
import {TestKeyboardSoundsMode} from '../void/test-keyboard-sounds';
import {useTranslation} from 'react-i18next';

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0 12px;
`;

const TestPane = styled(Pane)`
  display: flex;
  height: 100%;
  max-width: 100vw;
  flex-direction: column;
`;

export const TestContext = React.createContext([
  {clearTestKeys: () => {}},
  (...a: any[]) => {},
] as const);

export const Test: FC = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const selectedDevice = useAppSelector(getSelectedConnectedDevice);
  const selectedDefinition = useAppSelector(getSelectedDefinition);
  const keyDefinitions = useAppSelector(getSelectedKeyDefinitions);
  const isTestMatrixEnabled = useAppSelector(getIsTestMatrixEnabled);
  const testKeyboardSoundsSettings = useAppSelector(
    getTestKeyboardSoundsSettings,
  );

  const [testContextObj] = useContext(TestContext);
  const {progress} = useProgress();

  const hasTestMatrixDevice =
    selectedDevice && selectedDefinition && keyDefinitions;
  const canUseMatrixState =
    hasTestMatrixDevice && PROTOCOL_GAMMA <= selectedDevice.protocol;

  const testDefinition = isTestMatrixEnabled
    ? selectedDefinition
    : fullKeyboardDefinition;

  if (!testDefinition || typeof testDefinition === 'string') {
    return null;
  }

  const waveformOptions = [
    {
      label: t('Sine'),
      value: 'sine',
    },
    {
      label: t('Triangle'),
      value: 'triangle',
    },
    {
      label: t('Sawtooth'),
      value: 'sawtooth',
    },
    {
      label: t('Square'),
      value: 'square',
    },
  ];
  const waveformDefaultValue = waveformOptions.find(
    (opt) => opt.value === testKeyboardSoundsSettings.waveform,
  );

  const modeOptions = [
    {
      label: t('Wicki-Hayden'),
      value: TestKeyboardSoundsMode.WickiHayden,
    },
    {
      label: t('Chromatic'),
      value: TestKeyboardSoundsMode.Chromatic,
    },
    {
      label: t('Random'),
      value: TestKeyboardSoundsMode.Random,
    },
  ];
  const modeDefaultValue = modeOptions.find(
    (opt) => opt.value === testKeyboardSoundsSettings.mode,
  );

  return progress !== 100 ? null : (
    <TestPane>
      <BottomSection>
        <BottomSectionTopBar>
          <BottomSectionNav>
            <BottomSectionNavItem selected={true} tooltip={t('Check Key')}>
              <FontAwesomeIcon icon={faCircleQuestion} />
            </BottomSectionNavItem>
          </BottomSectionNav>
        </BottomSectionTopBar>
        <BottomSectionContent>
          <Container>
            <ControlRow>
              <Label>{t('Reset Keyboard')}</Label>
              <Detail>
                <AccentButton onClick={testContextObj.clearTestKeys}>
                  {t('Reset')}
                </AccentButton>
              </Detail>
            </ControlRow>
            {canUseMatrixState && selectedDefinition ? (
              <ControlRow>
                <Label>{t('Test Matrix')}</Label>
                <Detail>
                  <AccentSlider
                    isChecked={isTestMatrixEnabled}
                    onChange={(val) => {
                      dispatch(setTestMatrixEnabled(val));
                      testContextObj.clearTestKeys();
                    }}
                  />
                </Detail>
              </ControlRow>
            ) : null}
            <ControlRow>
              <Label>{t('Key Sounds')}</Label>
              <Detail>
                <AccentSlider
                  isChecked={testKeyboardSoundsSettings.isEnabled}
                  onChange={(val) => {
                    dispatch(
                      setTestKeyboardSoundsSettings({
                        isEnabled: val,
                      }),
                    );
                  }}
                />
              </Detail>
            </ControlRow>
            <ControlRow>
              <Label>{t('Volume')}</Label>
              <Detail>
                <AccentRange
                  max={100}
                  min={0}
                  defaultValue={testKeyboardSoundsSettings.volume}
                  onChange={(value: number) => {
                    dispatch(
                      setTestKeyboardSoundsSettings({
                        volume: value,
                      }),
                    );
                  }}
                />
              </Detail>
            </ControlRow>
            <ControlRow>
              <Label>{t('Transpose')}</Label>
              <Detail>
                <AccentRange
                  max={24}
                  min={-24}
                  defaultValue={testKeyboardSoundsSettings.transpose}
                  onChange={(value: number) => {
                    dispatch(
                      setTestKeyboardSoundsSettings({
                        transpose: value,
                      }),
                    );
                  }}
                />
              </Detail>
            </ControlRow>
            <ControlRow>
              <Label>{t('Waveform')}</Label>
              <Detail>
                <AccentSelect
                  isSearchable={false}
                  value={waveformDefaultValue}
                  options={waveformOptions}
                  onChange={(option: any) => {
                    option &&
                      dispatch(
                        setTestKeyboardSoundsSettings({
                          waveform: option.value,
                        }),
                      );
                  }}
                />
              </Detail>
            </ControlRow>
            <ControlRow>
              <Label>{t('Mode')}</Label>
              <Detail>
                <AccentSelect
                  isSearchable={false}
                  defaultValue={modeDefaultValue}
                  options={modeOptions}
                  onChange={(option: any) => {
                    option &&
                      dispatch(
                        setTestKeyboardSoundsSettings({
                          mode: option.value,
                        }),
                      );
                  }}
                />
              </Detail>
            </ControlRow>
          </Container>
        </BottomSectionContent>
      </BottomSection>
    </TestPane>
  );
};
