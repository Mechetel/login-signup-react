import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

class Login extends Component {
  constructor(props) {
    super(props);
    const user = localStorage.getItem("user");
    if (user) {
      this.props.history.push("/home");
    }
    this.state = {
      user: { email: "", password: "" },
      errors: {},
    };
  }

  validateProperty = (name, value) => {
    const { user } = this.state;
    user[name] = value;
    this.setState({ user });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { user } = this.state;
    this.props.checkUser(user);
  };

  render() {
    return (
      <>
        <h1>LOG IN</h1>
        {this.props.userError && (
          <div
            style={{
              backgroundColor: "#d18a8a",
              borderColor: "red",
              padding: 15,
              borderRadius: 5,
              marginBottom: 12,
            }}
          >
            {this.props.userError}
          </div>
        )}
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              disabled={this.props.disableElement}
              type="email"
              className="form-control"
              id="email"
              name="email"
              required
              onChange={(e) =>
                this.validateProperty(e.target.name, e.target.value)
              }
            />
            <small className="text-sm text-danger">
              {this.state.errors["email"]}
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              disabled={this.props.disableElement}
              type="password"
              className="form-control"
              id="password"
              name="password"
              required
              onChange={(e) =>
                this.validateProperty(e.target.name, e.target.value)
              }
            />
            <small className="text-sm text-danger">
              {this.state.errors["password"]}
            </small>
          </div>
          <button className="btn btn-primary" onClick={this.handleClick}>
            Sign In
          </button>
        </form>
        <p className="my-2">
          Don't have account? <Link to="/signup">Sign Up</Link>
        </p>
      </>
    );
  }
}

export default withRouter(Login);
