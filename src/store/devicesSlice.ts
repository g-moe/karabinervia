import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ConnectedDevice, ConnectedDevices } from "../types/types";

import type { RootState } from "./index";

type DevicesState = {
  selectedDevicePath: string | null;
  connectedDevicePaths: ConnectedDevices;
};

const initialState: DevicesState = {
  selectedDevicePath: null,
  connectedDevicePaths: {},
};

const deviceSlice = createSlice({
  name: "devices",
  initialState,
  reducers: {
    // TODO: change to just pass the device path instead of the whole device
    selectDevice: (state, action: PayloadAction<ConnectedDevice | null>) => {
      if (!action.payload) {
        state.selectedDevicePath = null;
      } else {
        state.selectedDevicePath = action.payload.path;
      }
    },
    updateConnectedDevices: (state, action: PayloadAction<ConnectedDevices>) => {
      state.connectedDevicePaths = action.payload;
    },
    clearAllDevices: (state) => {
      state.selectedDevicePath = null;
      state.connectedDevicePaths = {};
    },
  },
});

export const { clearAllDevices, selectDevice, updateConnectedDevices } = deviceSlice.actions;

export default deviceSlice.reducer;

export const getConnectedDevices = (state: RootState) => state.devices.connectedDevicePaths;
export const getSelectedDevicePath = (state: RootState) => state.devices.selectedDevicePath;
export const getSelectedConnectedDevice = createSelector(
  getConnectedDevices,
  getSelectedDevicePath,
  (devices, path) => path && devices[path],
);
