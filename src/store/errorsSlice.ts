import { RootState } from "./index";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DeviceInfo } from "../types/types";

export type AppError = {
  timestamp: string;
  message: string;
  deviceInfo: DeviceInfo;
};

export const extractDeviceInfo = (device: DeviceInfo): DeviceInfo => ({
  productId: device.productId,
  vendorId: device.vendorId,
  productName: device.productName,
  protocol: device.protocol,
});

type ErrorsState = {
  appErrors: AppError[];
};

const initialState: ErrorsState = {
  appErrors: [],
};

export const getErrorTimestamp = () => {
  const now = new Date();
  return `${now.toLocaleTimeString([], { hour12: false })}.${now
    .getMilliseconds()
    .toString()
    .padStart(3, "0")}`;
};

export const getMessageFromError = (e: Error) => e.stack || e.message;

const errorsSlice = createSlice({
  name: "errors",
  initialState,
  reducers: {
    logAppError: (state, action: PayloadAction<Omit<AppError, "timestamp">>) => {
      state.appErrors.push({ ...action.payload, timestamp: getErrorTimestamp() });
    },
    clearAppErrors: (state) => {
      state.appErrors = [];
    },
  },
});

export const { logAppError, clearAppErrors } = errorsSlice.actions;

export default errorsSlice.reducer;

export const getAppErrors = (state: RootState) => state.errors.appErrors;
