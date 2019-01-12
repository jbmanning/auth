import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import * as t from "io-ts";

import { AppContext } from "../context";
import { parseUnknown } from "../utils";

import { SIGNUP_URL, DEFAULT_FETCH_PROPS } from "../constants";

import Layout from "../components/layout";
import SimpleForm from "../components/simpleForm";

type signupFormState = {
  errors: Array<string>;
  params: {
    name: string;
    email: string;
    password: string;
  };
};

class SignupFormBody extends PureComponent<
  signupFormState & { changeFormParam: (name: string) => (event) => void }
> {
  getErrors = () => {
    const { errors } = this.props;
    if (errors.length > 0) {
      return (
        <ul>
          {errors.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    }
  };

  render = () => {
    const { changeFormParam } = this.props;
    const { name, email, password } = this.props.params;
    return (
      <>
        <div className="bold-1 center">Sign up!</div>
        {this.getErrors()}
        <input
          className="inp"
          type="text"
          placeholder="Name"
          name="name"
          value={name}
          onChange={changeFormParam("name")}
        />

        <input
          className="inp"
          type="text"
          placeholder="Email"
          name="email"
          value={email}
          onChange={changeFormParam("email")}
        />

        <input
          className="inp"
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={changeFormParam("password")}
        />

        <button className="btn btn-1 regular">Sign up</button>
      </>
    );
  };
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
  state: signupFormState = {
    errors: [],
    params: {
      name: "",
      email: "",
      password: ""
    }
  };

  static responseSchema = t.type({
    errors: t.array(t.string)
  });

  submitSignup = async () => {
    if (this.context === null) throw new Error("missing context");

    const { params } = this.state;
    if (!params.email || !params.password || !params.name) {
      this.setState({
        ...this.state,
        errors: ["All fields are required"]
      });
      return;
    }

    const req = fetch(SIGNUP_URL, {
      ...DEFAULT_FETCH_PROPS,
      body: JSON.stringify(params)
    }).then((req) => req.json());

    const resp: object | null = await req
      .then((result) => {
        if (!result) return null;
        return result;
      })
      .catch((err) => {
        return null;
      });

    let errors: Array<string> = [];
    let { value: apiResponse } = parseUnknown(SignupForm.responseSchema, resp);

    if (apiResponse !== null && apiResponse.errors.length === 0) {
      errors = [`SUCCESS!`];
    } else {
      if (apiResponse === null) {
        errors.push("api request failed");
      } else {
        errors = errors.concat(apiResponse.errors);
      }
    }

    this.setState({
      ...this.state,
      errors
    });
  };

  changeFormParam = (name: string) => {
    return (event) => {
      this.setState({
        ...this.state,
        params: {
          ...this.state.params,
          [name]: event.target.value
        }
      });
    };
  };

  render = () => (
    <SimpleForm
      action={this.submitSignup}
      body={<SignupFormBody changeFormParam={this.changeFormParam} {...this.state} />}
      footer={<SignupFormFooter />}
    />
  );
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
