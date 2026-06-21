import { createListenerMiddleware } from "@reduxjs/toolkit";
import { logAppError } from "./errorsSlice";
import { formatNumberAsHex } from "src/utils/format";
import { DeviceInfo } from "src/types/types";

export const errorsListenerMiddleware = createListenerMiddleware();

const captureError = (message: string, deviceInfo: DeviceInfo) => {
  console.error("Error captured:", {
    message,
    deviceInfo: {
      productName: deviceInfo.productName,
      vendorId: formatNumberAsHex(deviceInfo.vendorId, 4),
      protocol: deviceInfo.protocol,
    },
  });
};

errorsListenerMiddleware.startListening({
  actionCreator: logAppError,
  effect: async ({ payload: { message, deviceInfo } }) => {
    captureError(message, deviceInfo);
  },
});
