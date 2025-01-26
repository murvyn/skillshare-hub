import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./userSlice";
import interestReducer from "./interestSlice"
import { encryptTransform } from "redux-persist-transform-encrypt";

const encryptor = encryptTransform({
  secretKey: process.env.SECRET_KEY || "default_secret_key",
  onError: (error: Error) => {
    console.error("Encryption error:", error);
  },
});

const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ["currentUser"],
  transforms: [encryptor],
}

const persistedUserReducer = persistReducer(userPersistConfig, userReducer)

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    interests: interestReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false})
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
