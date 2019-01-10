import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

import { SetTitleProvider } from "../../context";

import Body from "./body";
import Header from "./header";
import Footer from "./footer";

class Layout extends PureComponent {
  render() {
    return (
      <>
        <Helmet>
          <title>{this.props.title ? `${this.props.title} | jman.me` : "jman.me"}</title>
        </Helmet>
        <SetTitleProvider value={this.setTitle}>
          <Header {...this.props} />
          <Body children={this.props.children} {...this.props} />
          <Footer {...this.props} />
        </SetTitleProvider>
      </>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.element.isRequired
};

export default withRouter(Layout);
