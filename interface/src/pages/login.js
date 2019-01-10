import React, { PureComponent } from "react";
import { Link } from "react-router-dom";

import SimpleForm from "../components/simpleForm";

class LoginForm extends PureComponent {
  static FormBody = class extends PureComponent {
    render = () => (
      <>
        <div className="bold-1 center">Welcome Back!</div>
        <input className="inp" type="text" placeholder="Email Address" name="email" />
        <input className="inp" type="password" placeholder="Password" name="password" />

        <button className="btn btn-1">Log In</button>
      </>
    );
  };

  static FormFooter = class extends PureComponent {
    render = () => (
      <div className="light-1">
        Don't have an account?{" "}
        <Link to="/signup" className="bold-2">
          Sign up
        </Link>
      </div>
    );
  };

  render = () => (
    <SimpleForm
      name="login"
      body={<LoginForm.FormBody />}
      footer={<LoginForm.FormFooter />}
    />
  );
}

class Login extends PureComponent {
  componentDidMount() {
    this.props.setTitle("Login");
  }

  render = () => <LoginForm />;
}

export default Login;
