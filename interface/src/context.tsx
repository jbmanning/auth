import React from "react";

export interface IAppContext {
  funcs: {
    setTitle: (a: string) => void;
    setSession: (sid: string) => void;
  };
}

export const AppContext = React.createContext<IAppContext | null>(null);
export const AppContextProvider = AppContext.Provider;
export const AppContextConsumer = AppContext.Consumer;
