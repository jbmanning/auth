import React, { PureComponent } from "react";

import styles from "./_body.module.scss";

class Body extends PureComponent {
  render = () => (
    <div className={styles.container}>
      <div className={`${styles.content} page-content`}>
        {React.Children.only(this.props.children)}
      </div>
    </div>
  );
}

export default Body;
