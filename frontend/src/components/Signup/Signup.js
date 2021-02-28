import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
// import cookie from 'react-cookies';
// import { Redirect } from 'react-router';

// Define a Signup Component
class Signup extends Component {
  // call the constructor method
  constructor(props) {
    // Call the constrictor of Super class i.e The Component
    super(props);
    // maintain the state required for this component
    this.state = {
      username: '',
      email: '',
      password: '',
    };
    // Bind the handlers to this class
    this.usrchangeHandler = this.usrchangeHandler.bind(this);
    this.emailChangeHandler = this.emailChangeHandler.bind(this);
    this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
  }

  // Call the Will Mount to set the auth Flag to false
  componentWillMount() {
    this.setState({
      // authFlag: false,
    });
  }

  usrchangeHandler = (e) => {
    this.setState({
      username: e.target.value,
    });
  };

  emailChangeHandler = (e) => {
    this.setState({
      email: e.target.value,
    });
  };
  // password change handler to update state variable with the text entered by the user

  passwordChangeHandler = (e) => {
    this.setState({
      password: e.target.value,
    });
  };

  // username change handler to update state variable with the text entered by the user

  // submit Login handler to send a request to the node backend
  submitLogin = (e) => {
    // prevent page from refresh
    e.preventDefault();
    const { username, email, password } = this.state;
    const data = {
      username,
      email,
      password,
    };
    // set the with credentials to true
    axios.defaults.withCredentials = true;
    // make a post request with the user data
    axios.post('http://localhost:3001/signup', data).then((response) => {
      console.log('Status Code : ', response.status);
      if (response.status === 200) {
        this.setState({
          // authFlag: true,
        });
      } else {
        this.setState({
          // authFlag: false,
        });
      }
    });
  };

  render() {
    return (
      <div>
        <div className="container">
          <div className="login-form">
            <div className="main-div">
              <div className="panel">
                <h2>Signup</h2>
                <p>Please enter your name , email and password</p>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  onChange={this.usrchangeHandler}
                  className="form-control"
                  name="username"
                  placeholder="Username"
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  onChange={this.emailChangeHandler}
                  className="form-control"
                  name="email"
                  placeholder="Email Address"
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  onChange={this.passwordChangeHandler}
                  className="form-control"
                  name="password"
                  placeholder="Password"
                />
              </div>
              <button
                type="button"
                onClick={this.submitLogin}
                className="btn btn-primary"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
// export Signup Component
export default Signup;
