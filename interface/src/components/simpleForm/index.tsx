import React, { PureComponent, ReactNode } from "react";

import styles from "./_form.module.scss";

type SimpleFormProps = {
  action?: () => void;
  body: ReactNode;
  footer?: ReactNode;
};

class SimpleForm extends PureComponent<SimpleFormProps> {
  _onSubmit = (event) => {
    event.preventDefault();

    const { action } = this.props;
    if (action) action();
  };

  render = () => {
    const { body, footer } = this.props;

    let formFooter;
    if (footer) {
      formFooter = <div className={styles.footer}>{footer}</div>;
    }

    return (
      <div className={styles.container}>
        <form onSubmit={this._onSubmit}>
          <div className={styles.body}>{body}</div>
        </form>
        {formFooter}
      </div>
    );
  };
}

export default SimpleForm;
