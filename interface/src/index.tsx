import React, { PureComponent } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import * as ReactDOM from "react-dom";

import App from "./components/app";

class Routed extends PureComponent {
  render = () => (
    <Router>
      <App />
    </Router>
  );
}

const root = document.getElementById("root");
if (root && root.hasChildNodes() === true) {
  // Loadable.preloadReady().then(() => {
  ReactDOM.hydrate(<Routed />, root);
  // });
} else {
  ReactDOM.render(<Routed />, root);
}
