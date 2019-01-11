import React, { PureComponent } from "react";
import { Link } from "react-router-dom";

import { AppContext } from "../context";
import Layout from "../components/layout";
import SimpleForm from "../components/simpleForm";
import { SIGNUP_URL, DEFAULT_FETCH_PROPS } from "../constants";

class SignupFormBody extends PureComponent {
  render = () => (
    <>
      <div className="bold-1 center">Sign up!</div>
      <input className="inp" type="text" placeholder="Name" name="name" />
      <input className="inp" type="text" placeholder="Email" name="email" />
      <input className="inp" type="password" placeholder="Password" name="password" />

      <button className="btn btn-1 regular">Sign up</button>
    </>
  );
}

class SignupFormFooter extends PureComponent {
  render = () => (
    <div className="light-1">
      Already have an account?{" "}
      <Link to="/login" className="bold-2">
        Log In
      </Link>
    </div>
  );
}

class SignupForm extends PureComponent {
  static contextType = AppContext;
  submitSignup = () => {
    const req = fetch(SIGNUP_URL, {
      ...DEFAULT_FETCH_PROPS,
      body: JSON.stringify("")
    }).then((resp) => resp.json());

    const resp = req
      .then((result) => {
        console.log("RES");
        console.log(result);
      })
      .catch((err) => {
        console.log("ERR");
        console.log(err);
      });
  };

  render = () => <SimpleForm body={<SignupFormBody />} footer={<SignupFormFooter />} />;
}

class Signup extends PureComponent {
  static contextType = AppContext;
  componentDidMount() {
    this.context.funcs.setTitle("Signup");
  }
  render = () => (
    <Layout>
      <SignupForm />
    </Layout>
  );
}

export default Signup;
