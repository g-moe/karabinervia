import {AnyAction, configureStore, ThunkAction} from '@reduxjs/toolkit';
import settingsReducer from './settingsSlice';
import macrosReducer from './macrosSlice';
import devicesReducer from './devicesSlice';
import keymapReducer from './keymapSlice';
import definitionsReducer from './definitionsSlice';
import menusReducer from './menusSlice';
import layoutOptionsReducer from './layoutOptionsSlice';
import errorsReducer from './errorsSlice';
import {errorsListenerMiddleware} from './errorsListener';
import firmwareReducer from './firmwareSlice';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    macros: macrosReducer,
    devices: devicesReducer,
    keymap: keymapReducer,
    definitions: definitionsReducer,
    menus: menusReducer,
    layoutOptions: layoutOptionsReducer,
    errors: errorsReducer,
    firmware: firmwareReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(errorsListenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;
