import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import styles from "./_form.module.scss";

class SimpleForm extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    body: PropTypes.element.isRequired,
    footer: PropTypes.element,
    action: PropTypes.string,
    method: PropTypes.string
  };

  static defaultProps = {
    method: "POST"
  };

  render = () => {
    const { name, body, footer, action, method } = this.props;

    const rAction = action ? action : `/${name}`;

    let renderedFooter;
    if (footer) {
      renderedFooter = <div className={styles.footer}>{footer}</div>;
    }

    return (
      <div className={styles.container}>
        <form id={name} action={rAction} method={method}>
          <div className={styles.body}>{body}</div>
        </form>
        {renderedFooter}
      </div>
    );
  };
}

export default SimpleForm;
