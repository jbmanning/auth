import React from "react";

const SetTitleContext = React.createContext(() => {});

export const SetTitleProvider = SetTitleContext.Provider;
export const SetTitleConsumer = SetTitleContext.Consumer;
