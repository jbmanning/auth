import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import * as t from "io-ts";

import { AppContext } from "../context";
import { LOGIN_URL, DEFAULT_FETCH_PROPS } from "../constants";
import { parseUnknown } from "../utils";
import Layout from "../components/layout";
import SimpleForm from "../components/simpleForm";

class LoginFormBody extends PureComponent<{ errors: Array<string> }> {
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
    return (
      <>
        <div className="bold-1 center">Welcome Back!</div>
        {this.getErrors()}
        <input className="inp" type="text" placeholder="Email Address" name="email" />
        <input className="inp" type="password" placeholder="Password" name="password" />

        <button className="btn btn-1">Log In</button>
      </>
    );
  };
}

class LoginFormFooter extends PureComponent {
  render = () => (
    <div className="light-1">
      Don't have an account?{" "}
      <Link to="/signup" className="bold-2">
        Sign up
      </Link>
    </div>
  );
}

class LoginForm extends PureComponent {
  static contextType = AppContext;
  context: React.ContextType<typeof AppContext>;

  state = {
    errors: [],
    params: {
      email: "",
      password: ""
    }
  };

  static responseSchema = t.type({
    errors: t.array(t.string),
    success: t.boolean
  });

  submitLogin = async () => {
    if (this.context === null) throw new Error("missing context");

    const { params } = this.state;
    const req = fetch(LOGIN_URL, {
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
    let { value: loginAPIResponse } = parseUnknown(LoginForm.responseSchema, resp);
    if (loginAPIResponse !== null) {
      if (loginAPIResponse.errors.length === 0 && loginAPIResponse.success) {
        this.context.funcs.setSession("SUCCESS");
        return;
      } else {
        errors = errors.concat(loginAPIResponse.errors);
      }
    } else {
      errors.push("api request failed");
    }

    this.setState({
      ...this.state,
      errors
    });
  };

  render = () => {
    return (
      <SimpleForm
        action={this.submitLogin}
        body={<LoginFormBody errors={this.state.errors} />}
        footer={<LoginFormFooter />}
      />
    );
  };
}

class Login extends PureComponent {
  static contextType = AppContext;
  componentDidMount() {
    if (this.context === null) throw new Error("missing context");
    this.context.funcs.setTitle("Login");
  }

  render = () => {
    return (
      <Layout>
        <LoginForm />
      </Layout>
    );
  };
}

export default Login;
