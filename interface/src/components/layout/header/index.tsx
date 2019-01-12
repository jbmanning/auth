import React, { PureComponent } from "react";
import { Link } from "react-router-dom";

import styles from "./_header.module.scss";

class Header extends PureComponent {
  render = () => (
    <header className={styles.container}>
      <div className={`${styles.content} page-content`}>
        <div>DO NOT INPUT SENSITIVE DATA.</div>
        <div>
          <Link to="/login" className="btn btn-2" style={{ marginRight: "2px" }}>
            Log In
          </Link>
          <Link to="/signup" className="btn btn-1">
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
