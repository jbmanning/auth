import React, { PureComponent } from "react";

import styles from "./_footer.module.scss";

class Footer extends PureComponent {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.content} />
      </div>
    );
  }
}

export default Footer;
