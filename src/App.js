import React, { Component } from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Signup from "./components/Signup";
import NotFound from "./components/NotFound";
import Navbar from "./components/Navbar";
import UpdateDetails from "./components/UpdateDetails";
let inputErrorsCount = 0;


class App extends Component {
  state = {
    users: [],
    userError: "",
    disableElement: false,
  };

  addUser = (user) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push({ ...user, id: users.length || 0 });
    localStorage.setItem("users", JSON.stringify(users));
    this.props.history.replace("/login");
  };

  checkUser = (user) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const u = users.filter(
      (us) => us.email === user.email && us.password === user.password
    );
    if (u.length) {
      localStorage.setItem("user", JSON.stringify(u[0]));
      this.setState({ userError: "" });
      this.props.history.push("/home");
      inputErrorsCount = 0;
    } else {
      inputErrorsCount += 1;
      if (inputErrorsCount > 2) {
        this.setState({ disableElement: true });
      }
      console.log(inputErrorsCount);
      this.setState(
        { userError: "The email or password is incorrect." },
        () => {
          setTimeout(() => this.setState({ userError: "" }), 5000);
        }
      );
    }
  };

  setError = () => {
    this.setState({ userError: "" });
  };

  handleLog = () => {
    const user = localStorage.getItem("user");
    if (user) {
      localStorage.removeItem("user");
    }
    this.props.history.replace("/login");
  };

  render() {
    return (
      <>
        <Navbar handleLog={this.handleLog} />
        <div className="container my-3">
          <Switch>
            <Route
              path="/login"
              render={() => (
                <Login
                  checkUser={this.checkUser}
                  userError={this.state.userError}
                  disableElement={this.state.disableElement}
                  setError={this.setError}
                />
              )}
            />
            <Route
              path="/signup"
              render={() => <Signup addUser={this.addUser} />}
            />
            <Route path="/home" component={Home} />
            <Route path="/update-details" component={UpdateDetails} />
            <Route path="/not-found" component={NotFound} />
            <Redirect from="/" exact to="login" />
            <Redirect to="/not-found" />
          </Switch>
        </div>
      </>
    );
  }
}
export default withRouter(App);
