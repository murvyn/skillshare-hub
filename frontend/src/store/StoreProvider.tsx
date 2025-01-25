"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import LoadingSate from "@/components/LoadingSate";

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingSate />} persistor={persistor}>{children}</PersistGate>
    </Provider>
  );
};
