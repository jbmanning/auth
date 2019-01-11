import React, { PureComponent, ReactChild } from "react";

import Body from "./body";
import Header from "./header";
import Footer from "./footer";

type LayoutProps = {
  children: ReactChild;
};

class Layout extends PureComponent<LayoutProps> {
  render = () => (
    <>
      <Header />
      <Body>{this.props.children}</Body>
      <Footer />
    </>
  );
}

export default Layout;
