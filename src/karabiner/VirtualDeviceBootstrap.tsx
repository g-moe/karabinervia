import {useEffect} from 'react';
import {updateDefinitions} from 'src/store/definitionsSlice';
import {selectDevice, updateConnectedDevices} from 'src/store/devicesSlice';
import {
  getSelectedRawLayers,
  saveKeymapSuccess,
  setNumberOfLayers,
} from 'src/store/keymapSlice';
import {useAppDispatch, useAppSelector} from 'src/store/hooks';
import {
  KARABINER_VIA_DEVICE_PATH,
  KARABINER_VIA_VENDOR_PRODUCT_ID,
  macbookConnectedDevice,
  macbookDefinition,
} from './virtual-device';
import {loadWorkspace, saveWorkspace, workspaceToViaLayers} from './workspace';

export function VirtualDeviceBootstrap() {
  const dispatch = useAppDispatch();
  const layers = useAppSelector(getSelectedRawLayers);

  useEffect(() => {
    const workspace = loadWorkspace();
    const initialLayers = workspaceToViaLayers(workspace);
    dispatch(
      updateDefinitions({
        [KARABINER_VIA_VENDOR_PRODUCT_ID]: {
          v2: undefined as any,
          v3: macbookDefinition,
        },
      }),
    );
    dispatch(
      updateConnectedDevices({
        [KARABINER_VIA_DEVICE_PATH]: macbookConnectedDevice,
      }),
    );
    dispatch(selectDevice(macbookConnectedDevice));
    dispatch(setNumberOfLayers(initialLayers.length));
    dispatch(
      saveKeymapSuccess({
        devicePath: KARABINER_VIA_DEVICE_PATH,
        layers: initialLayers,
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    if (layers.length) {
      const workspace = loadWorkspace();
      saveWorkspace(workspace);
    }
  }, [layers]);

  return null;
}
