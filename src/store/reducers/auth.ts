import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('token') || null, 
  user: null,
  status: 'idle', 
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.status = 'succeeded';
      localStorage.setItem('token', action.payload.token); 
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.status = 'idle';
      localStorage.removeItem('token');
    },
    loginFailure: (state, action) => {
      state.error = action.payload;
      state.status = 'failed';
    },
  },
});

export const { loginSuccess, logout, loginFailure } = authSlice.actions;

export default authSlice.reducer;