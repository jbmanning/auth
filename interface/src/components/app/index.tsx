import React, { PureComponent } from "react";
import Helmet from "react-helmet";
import {
  Route,
  Redirect,
  Switch,
  withRouter,
  RouteComponentProps,
  RouteProps
} from "react-router-dom";

import "normalize.css";
import "../../scss/main.scss";

import Login from "../../pages/login";
import Signup from "../../pages/signup";
import { IAppContext, AppContextProvider } from "../../context";

type IAppProps = {
  context: IAppContext;
  title: string;
};

class App extends PureComponent<IAppProps> {
  static routes: Array<RouteProps> = [
    {
      path: "/login",
      component: Login
    },
    {
      path: "/create",
      component: Signup
    },
    {
      path: "/",
      render: (props) => <Redirect {...props} to="/signup" />
    }
  ];

  render = () => {
    return (
      <>
        <Helmet>
          <title>{this.props.title ? `${this.props.title} | jman.me` : "jman.me"}</title>
        </Helmet>
        <AppContextProvider value={this.props.context}>
          <Switch>
            {App.routes.map((route, i) => (
              <Route key={i} {...route} />
            ))}
          </Switch>
        </AppContextProvider>
      </>
    );
  };
}

type AppState = {
  title: string;
  sid: string;
};

class AppContainer extends React.PureComponent<RouteComponentProps, AppState> {
  state = {
    title: "",
    sid: ""
  };

  setTitle = (title: string) => {
    this.setState({
      ...this.state,
      title
    });
  };

  setSession = (sid: string) => {
    this.setState({
      ...this.state,
      sid
    });
  };

  render = () => {
    const context: IAppContext = {
      funcs: {
        setTitle: this.setTitle,
        setSession: this.setSession
      }
    };

    return <App title={this.state.title} context={context} />;
  };
}

export default withRouter(AppContainer);
