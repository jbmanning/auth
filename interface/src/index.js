import React from "react";
import * as ReactDOM from "react-dom";

import App from "./components/app";

const root = document.getElementById("root");
if (root.hasChildNodes() === true) {
  // Loadable.preloadReady().then(() => {
  ReactDOM.hydrate(<App />, root);
  // });
} else {
  ReactDOM.render(<App />, root);
}
