import React, { PureComponent } from "react";
import { Link } from "react-router-dom";

import SimpleForm from "../components/simpleForm";

class SignupForm extends PureComponent {
  static FormBody = class extends PureComponent {
    render = () => (
      <>
        <div className="bold-1 center">Sign up!</div>
        <input className="inp" type="text" placeholder="Name" name="name" />
        <input className="inp" type="text" placeholder="Email" name="email" />
        <input className="inp" type="password" placeholder="Password" name="password" />

        <button className="btn btn-1 regular">Sign up</button>
      </>
    );
  };

  static FormFooter = class extends PureComponent {
    render = () => (
      <div className="light-1">
        Already have an account?{" "}
        <Link to="/login" className="bold-2">
          Log In
        </Link>
      </div>
    );
  };

  render = () => (
    <SimpleForm
      name="signup"
      body={<SignupForm.FormBody />}
      footer={<SignupForm.FormFooter />}
    />
  );
}

class Signup extends PureComponent {
  render = () => <SignupForm />;
}

export default Signup;
