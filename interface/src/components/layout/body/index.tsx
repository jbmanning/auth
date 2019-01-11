import React, { PureComponent, ReactChild } from "react";

import styles from "./_body.module.scss";

type BodyProps = {
  children: ReactChild;
};

class Body extends PureComponent<BodyProps> {
  render = () => (
    <div className={styles.container}>
      <div className={`${styles.content} page-content`}>{this.props.children}</div>
    </div>
  );
}

export default Body;
