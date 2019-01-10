import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { BrowserRouter, StaticRouter } from "react-router-dom";

import "normalize.css";
import "../scss/main.scss";

import Layout from "./layout";
import Login from "../pages/login";
import Signup from "../pages/signup";

class App extends React.PureComponent {
  static routes = [
    {
      title: "Login",
      path: "/login",
      component: Login
    },
    {
      path: "/signup",
      component: Signup
    },
    {
      path: "/",
      component: () => <Redirect to="/signup" />
    }
  ];

  state = {
    title: ""
  };

  setTitle = (title) => {
    this.setState({
      title: title
    });
  };

  render = () => {
    const Router = true ? BrowserRouter : StaticRouter;
    return (
      <Router>
        <Layout title={this.state.title}>
          <Switch>
            {App.routes.map((route, i) => {
              const { component: Component, ...rest } = route;

              return (
                <Route
                  key={i}
                  {...rest}
                  render={(props) => <Component {...props} setTitle={this.setTitle} />}
                />
              );
            })}
          </Switch>
        </Layout>
      </Router>
    );
  };
}

export default App;
