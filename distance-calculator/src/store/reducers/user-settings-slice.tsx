import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export type UserSettingsInterface = {
  isMetric: boolean;
  isTable: boolean;
};

const initialState: UserSettingsInterface = {
  isMetric: localStorage.getItem('isMetric') === 'false' ? false : true,
  isTable: Boolean(localStorage.getItem('isTable')) || false,
};

console.log('localStorage.getItem=', localStorage.getItem('isMetric'));
console.log('inState=', initialState.isMetric);

export const userSettingsSlice = createSlice({
  name: 'userSettingsData',
  initialState,
  reducers: {
    setIsMetric: (
      state,
      action: PayloadAction<UserSettingsInterface['isMetric']>
    ) => {
      state.isMetric = action.payload;
      localStorage.setItem('isMetric', String(state.isMetric));
    },
    setIsTable: (
      state,
      action: PayloadAction<UserSettingsInterface['isTable']>
    ) => {
      state.isTable = action.payload;
      localStorage.setItem('isTable', String(state.isTable));
    },
  },
});

export const { setIsMetric, setIsTable } = userSettingsSlice.actions;

export const selectIsMetric = (state: RootState) => state.userSettings.isMetric;
export const selectIsTable = (state: RootState) => state.userSettings.isTable;

const userSettingsReducer = userSettingsSlice.reducer;
export default userSettingsReducer;
