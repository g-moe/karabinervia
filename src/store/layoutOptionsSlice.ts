import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from './index';

type LayoutOptionsState = {
  selectedOptionKeys: number[];
};

const initialState: LayoutOptionsState = {
  selectedOptionKeys: [],
};

const layoutOptionsSlice = createSlice({
  name: 'layoutOptions',
  initialState,
  reducers: {
    updateSelectedOptionKeys: (state, action: PayloadAction<number[]>) => {
      state.selectedOptionKeys = action.payload;
    },
  },
});

export const {updateSelectedOptionKeys} = layoutOptionsSlice.actions;

export default layoutOptionsSlice.reducer;

export const getLayoutSelectedOptionKeys = (state: RootState) =>
  state.layoutOptions.selectedOptionKeys;
