import React, { Component } from "react";

class Home extends Component {
  constructor(props) {
    super(props);
    this.user = JSON.parse(localStorage.getItem("user"));
    if (!this.user) {
      this.props.history.push("/login");
    }
    this.state = {
      user: this.user || {},
      update: false,
      updateField: null,
      passwordError: "",
      password: "",
    };
  }

  getPassword = () => {
    this.setState({ update: true });
  };

  handlePasswordSubmit = (e) => {
    e.preventDefault();
    const { user, password } = this.state;
    if (user["password"] === password) {
      this.props.history.push({
        pathname: "/update-details",
        state: { update: true },
      });
    } else {
      this.setState({ passwordError: "Incorrect Current Password" });
    }
  };

  validatePassword = (value) => {
    let { password } = this.state;
    password = value;
    this.setState({ password });
  };

  render() {
    let { password = "" } = this.state.user;
    password = password
      .split("")
      .map((c) => "*")
      .join("");
    let input = null;
    if (this.state.update) {
      input = (
        <form className="my-3" onSubmit={this.handlePasswordSubmit}>
          <div className="form-group">
            <label htmlFor="currentPassword">Enter your Current Password</label>
            <input
              type="password"
              required
              name="currentPassword"
              id="currentPassword"
              onChange={(e) => this.validatePassword(e.target.value)}
              className="form-control"
            />
            <small className="text-sm text-danger">
              {this.state.passwordError}
            </small>
          </div>
          <button className="btn btn-info">Submit</button>
        </form>
      );
    }

    const { user } = this.state;
    const keys = Object.keys(user).filter((el) => el !== "id");
    return (
      <div>
        <table className="table">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Field</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {keys.map((key, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>{key}</td>
                <td>
                  {key === "password" || key === "confirmPassword"
                    ? password
                    : this.state.user[key]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn btn-primary" onClick={this.getPassword}>
          Update details
        </button>
        {input}
      </div>
    );
  }
}

export default Home;
