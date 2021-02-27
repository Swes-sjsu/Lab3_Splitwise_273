/* eslint-disable no-undef */

import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
// import cookie from 'react-cookies';
// import { Redirect } from 'react-router';

// Define a Login Component
class Login extends Component {
  // call the constructor method
  constructor(props) {
    // Call the constrictor of Super class i.e The Component
    super(props);
    // maintain the state required for this component
    this.state = {
      username: '',
      password: '',
      // authFlag: false,
    };
    // Bind the handlers to this class
    this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
    this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
  }

  // Call the Will Mount to set the auth Flag to false
  componentWillMount() {
    this.setState({
      // authFlag: false,
    });
  }

// username change handler to update state variable with the text entered by the user
usernameChangeHandler = (e) => {
  this.setState({
    username: e.target.value,
  });
}

// password change handler to update state variable with the text entered by the user
passwordChangeHandler = (e) => {
  this.setState({
    password: e.target.value,
  });
}

// submit Login handler to send a request to the node backend
submitLogin = (e) => {
  // prevent page from refresh
  e.preventDefault();
  const { username, password } = this.state;
  const data = {
    username,
    password,
  };
  // set the with credentials to true
  axios.defaults.withCredentials = true;
  // make a post request with the user data
  axios.post('http://localhost:3001/login', data)
    .then((response) => {
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
}

render() {
  return (
    <div>
      <div className="container">

        <div className="login-form">
          <div className="main-div">
            <div className="panel">
              <h2>Login</h2>
              <p>Please enter your email address and password</p>
            </div>

            <div className="form-group">
              <input type="text" className="form-control" name="email" placeholder="Email" />
            </div>
            <div className="form-group">
              <input type="password" className="form-control" name="password" placeholder="Password" />
            </div>
            <button type="button" className="btn btn-primary">Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}
}
// export Login Component
export default Login;
