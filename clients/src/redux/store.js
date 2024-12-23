import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import orebiReducer from "./orebiSlice";
import userReducer from "./slices/userSlice";
import adminReducer from './slices/adminSlice'
import {combineReducers} from 'redux'

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  orebiReducer,
  userReducer,
  adminReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export let persistor = persistStore(store);
