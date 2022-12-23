import React, { Component } from "react";
import { withRouter } from "react-router-dom";
const password = require("secure-random-password");

class SignUp extends Component {
  constructor(props) {
    super(props);
    const user = localStorage.getItem("user");
    if (user) {
      this.props.history.push("/home");
    }
    this.state = {
      user: {
        firstName: "",
        lastName: "",
        dob: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        gender: "",
      },
      errors: {},
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { user } = this.state;
    Object.keys(user).forEach((field) =>
      this.validateProperty(field, user[field])
    );
    if (!Object.keys(this.state.errors).length) {
      this.props.addUser(this.state.user);
    }
  };

  handleGenerate = (e) => {
    e.preventDefault();
    const final_password = password.randomPassword({
      characters: [
        { characters: password.upper, exactly: 2 },
        { characters: password.digits, exactly: 2 },
        { characters: "!@#$%^&*", exactly: 2 },
        password.lower,
      ],
    });
    this.setState({
      user: {
        ...this.state.user,
        password: final_password,
        confirmPassword: final_password,
      },
    });
  };

  validateProperty = (name, value) => {
    const { errors, user } = this.state;
    // eslint-disable-next-line
    switch (name) {
      case "firstName":
      case "lastName": {
        let regex = /^[a-z ,.'-]+$/i;
        user[name] = value;
        const nameUser = name === "firstName" ? "First Name" : "Last Name";
        if (value === "") {
          errors[name] = `Please enter your ${nameUser}`;
        } else if (value.trim().length < 2) {
          errors[name] = `${nameUser} must be at least 2 characters long.`;
        } else if (regex.test(value.trim())) {
          delete errors[name];
        } else {
          errors[
            name
          ] = `${nameUser} contains alphanumeric charaters or ,.'- only`;
        }
        break;
      }

      case "dob": {
        user[name] = value;
        const date = new Date();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const year = String(date.getFullYear());
        const dateValue = value.split("-");
        if (
          +dateValue[0] > +year ||
          (+dateValue[0] === +year && +dateValue[1] > +month) ||
          (+dateValue[0] === +year &&
            +dateValue[1] === +month &&
            +dateValue[2] > +day)
        ) {
          errors["dob"] = "Date of birth should be less than current date";
        } else {
          delete errors["dob"];
        }
        break;
      }

      case "gender": {
        user[name] = value;
        if (value === "") {
          errors["gender"] = "Please select your gender";
        } else {
          delete errors["gender"];
        }
        break;
      }

      case "phone": {
        if (value === "") {
          errors["phone"] = "Please enter your contact number.";
          user[name] = value;
        } else {
          const regex = /^[0-9]+$/g;
          if (regex.test(value)) {
            user[name] = value;
            if (value.length !== 10) {
              errors["phone"] = "Phone number length should be 10 characters.";
            } else {
              delete errors["phone"];
            }
          }
        }
        break;
      }

      case "email": {
        user[name] = value;
        // eslint-disable-next-line
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (regex.test(value.trim())) {
          const users = JSON.parse(localStorage.getItem("users")) || [];
          const comp = users.filter((obj) => obj.email === value);
          if (comp.length) {
            errors[name] = "Email already registered.";
          } else {
            delete errors[name];
          }
        } else {
          errors[name] = "Please enter a valid email address.";
        }
        break;
      }

      case "password": {
        user[name] = value;
        function testPassword(pass) {
          let allRigthCharacters =
            "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*";
          for (let i = 0; i < pass.length; i++) {
            if (allRigthCharacters.includes(pass[i])) {
              continue;
            } else {
              return false;
            }
          }
          return true;
        }
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,15})/;
        if (regex.test(value.trim()) && testPassword(value.trim())) {
          delete errors[name];
        } else {
          errors[name] =
            "Error with password. Must comply with the regulations";
        }
        break;
      }

      case "confirmPassword": {
        user[name] = value;
        if (!(user["password"] === value)) {
          errors[name] = "Passwords didn't match. Try again.";
        } else if (!value.trim()) {
          errors[name] = "Confirm Password can't be empty.";
        } else {
          delete errors[name];
        }
        break;
      }
    }
    this.setState({ user, errors });
  };

  render() {
    return (
      <>
        <h1 className="my-3">SIGN UP</h1>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">First Name*</label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              required
              onChange={(e) =>
                this.validateProperty(e.target.name, e.target.value)
              }
              className="form-control"
            />
            <small className="text-sm text-danger">
              {this.state.errors["firstName"]}
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name*</label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              required
              onChange={(e) =>
                this.validateProperty(e.target.name, e.target.value)
              }
              className="form-control"
            />
            <small className="text-sm text-danger">
              {this.state.errors["lastName"]}
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number*</label>
            <input
              type="tel"
              name="phone"
              id="phone"
              required
              value={this.state.user.phone}
              onChange={(e) =>
                this.validateProperty(e.target.name, e.target.value)
              }
              className="form-control"
            />
            <small>Format: 1234567890</small>
            <br />
            <small className="text-sm text-danger">
              {this.state.errors["phone"]}
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="gender">Gender*</label>
            <select
              name="gender"
              id="gender"
              required
              value={this.state.user.gender}
              className="form-control"
              onChange={(e) =>
                this.validateProperty(e.target.name, e.target.value)
              }
            >
              <option></option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <small className="text-sm text-danger">
              {this.state.errors["gender"]}
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="dob">Date Of Birth*</label>
            <input
              type="date"
              name="dob"
              id="dob"
              required
              max="2022-01-01"
              min="1920-01-01"
              onChange={(e) =>
                this.validateProperty(e.target.name, e.target.value)
              }
              className="form-control"
            />
            <small className="text-sm text-danger">
              {this.state.errors["dob"]}
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email*</label>
            <input
              type="email"
              name="email"
              autoComplete="off"
              id="email"
              required
              onChange={(e) =>
                this.validateProperty(e.target.name, e.target.value)
              }
              className="form-control"
            />
            <small className="text-sm">
              Email must be example@example.example
            </small>
            <br />
            <small className="text-sm text-danger">
              {this.state.errors["email"]}
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password*</label>
            <input
              name="password"
              id="password"
              required
              value={this.state.user.password}
              onChange={(e) =>
                this.validateProperty(e.target.name, e.target.value)
              }
              className="form-control"
            />
            <small className="text-sm">
              Password must be at least 8 characters long and must contains 1
              lowercase character, 1 uppercase character, 1 numeric character
              and 1 special character !@#$%^&*.
            </small>
            <br />
            <small className="text-sm text-danger">
              {this.state.errors["password"]}
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password*</label>
            <input
              name="confirmPassword"
              id="confirmPassword"
              required
              value={this.state.user.confirmPassword}
              onChange={(e) =>
                this.validateProperty(e.target.name, e.target.value)
              }
              className="form-control"
            />
            <small className="text-sm text-danger">
              {this.state.errors["confirmPassword"]}
            </small>
          </div>

          <button className="btn btn-primary">Sign Up</button>
        </form>
        <form onSubmit={this.handleGenerate}>
          <button className="btn btn-success recommend-password-button">
            Recomend Password
          </button>
        </form>
      </>
    );
  }
}

export default withRouter(SignUp);
