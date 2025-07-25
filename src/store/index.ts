import { configureStore } from "@reduxjs/toolkit";

import authReducer from './reducers/auth'
import taskReducer from './reducers/task'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
