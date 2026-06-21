import React, {useMemo, useState} from 'react';
import styled from 'styled-components';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faAngleDown, faPlus} from '@fortawesome/free-solid-svg-icons';
import {HID} from '../../../shims/node-hid';
import type {VIADefinitionV2, VIADefinitionV3} from '@the-via/reader';
import type {ConnectedDevice} from '../../../types/types';
import {useAppDispatch, useAppSelector} from 'src/store/hooks';
import {
  getDefinitions,
  getSelectedDefinition,
} from 'src/store/definitionsSlice';
import {
  getConnectedDevices,
  getSelectedDevicePath,
} from 'src/store/devicesSlice';
import {selectConnectedDeviceByPath} from 'src/store/devicesThunks';
import {isElectron} from 'src/utils/running-context';
import {useTranslation} from 'react-i18next';
import {KARABINER_VIA_VENDOR_PRODUCT_ID} from 'src/karabiner/virtual-device';
import {
  dropdownMenuVisibility,
  controlTransition,
  menuItemSurface,
  menuListSurface,
  scrimSurface,
} from 'src/components/inputs/control-styles';

const Container = styled.div`
  position: absolute;
  right: 15px;
  top: 0px;
  font-size: 18px;
  pointer-events: none;
  font-weight: 400;
`;

const KeyboardTitle = styled.label`
  pointer-events: all;
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
  cursor: pointer;
  ${controlTransition}
  &:hover {
    filter: var(--filter_control-hover);
  }
`;
const KeyboardList = styled.ul<{$show: boolean}>`
  ${menuListSurface}
  ${dropdownMenuVisibility}
  right: 10px;
`;
const KeyboardButton = styled.button<{$selected?: boolean}>`
  ${menuItemSurface}
`;

const InlineTrailingIcon = styled(FontAwesomeIcon)`
  margin-left: 10px;
`;

const DisclosureIcon = styled(FontAwesomeIcon)<{$open: boolean}>`
  margin-left: 5px;
  transform: ${(props) => (props.$open ? 'rotate(180deg)' : 'none')};
  ${controlTransition}
`;

const ClickCover = styled.div`
  ${scrimSurface}
`;

type ConnectedKeyboardDefinition = [string, VIADefinitionV2 | VIADefinitionV3];

const KeyboardSelectors: React.FC<{
  show: boolean;
  keyboards: ConnectedKeyboardDefinition[];
  selectedPath: string;
  onClickOut: () => void;
  selectKeyboard: (kb: string) => void;
}> = (props) => {
  const {t} = useTranslation();
  const requestAndChangeDevice = async () => {
    const device = await HID.requestDevice();
    if (device) {
      props.selectKeyboard((device as any).__path);
    }
  };
  return (
    <>
      {props.show && <ClickCover onClick={props.onClickOut} />}
      <KeyboardList $show={props.show}>
        {props.keyboards.map(([path, keyboard]) => {
          return (
            <KeyboardButton
              $selected={path === props.selectedPath}
              key={path}
              onClick={() => props.selectKeyboard(path as string)}
            >
              {keyboard.name}
            </KeyboardButton>
          );
        })}
        {!isElectron && (
          <KeyboardButton onClick={requestAndChangeDevice}>
            {t('Authorize New')}
            <InlineTrailingIcon icon={faPlus} />
          </KeyboardButton>
        )}
      </KeyboardList>
    </>
  );
};

export const Badge = () => {
  const dispatch = useAppDispatch();
  const definitions = useAppSelector(getDefinitions);
  const selectedDefinition = useAppSelector(getSelectedDefinition);
  const connectedDevices = useAppSelector(getConnectedDevices);
  const selectedPath = useAppSelector(getSelectedDevicePath);
  const [showList, setShowList] = useState(false);

  const connectedKeyboardDefinitions: ConnectedKeyboardDefinition[] = useMemo(
    () =>
      Object.entries(connectedDevices)
        .map<ConnectedKeyboardDefinition>(([path, device]) => [
          path,
          definitions[(device as ConnectedDevice).vendorProductId] &&
            definitions[(device as ConnectedDevice).vendorProductId][
              (device as ConnectedDevice).requiredDefinitionVersion
            ],
        ])
        .filter((i) => i[1]),
    [connectedDevices, definitions],
  );

  if (!selectedDefinition || !selectedPath) {
    return null;
  }

  if (selectedDefinition.vendorProductId === KARABINER_VIA_VENDOR_PRODUCT_ID) {
    return (
      <Container>
        <KeyboardTitle>{selectedDefinition.name}</KeyboardTitle>
      </Container>
    );
  }

  return (
    <>
      <Container>
        <KeyboardTitle onClick={() => setShowList(!showList)}>
          {selectedDefinition.name}
          <DisclosureIcon icon={faAngleDown} $open={showList} />
        </KeyboardTitle>
        <KeyboardSelectors
          show={showList}
          selectedPath={selectedPath}
          keyboards={connectedKeyboardDefinitions}
          onClickOut={() => setShowList(false)}
          selectKeyboard={(path) => {
            dispatch(selectConnectedDeviceByPath(path));
            setShowList(false);
          }}
        />
      </Container>
    </>
  );
};
