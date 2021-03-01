import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';

// Define a Login Component
class login extends Component {
  // call the constructor method
  constructor(props) {
    // Call the constrictor of Super class i.e The Component
    super(props);
    // maintain the state required for this component
    this.state = {
      email: '',
      password: '',
    };
    // Bind the handlers to this class
    this.emailChangeHandler = this.emailChangeHandler.bind(this);
    this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
  }

  // Call the Will Mount to set the auth Flag to false
  componentWillMount() {
    this.setState({
      // verifyauth: false,
      redirecttohome: null,
    });
  }

  // username change handler to update state variable with the text entered by the user
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

  // submit Login handler to send a request to the node backend
  submitLogin = async (e) => {
    // prevent page from refresh
    e.preventDefault();
    const { email, password } = this.state;
    const data = {
      email,
      password,
    };
    // set the with credentials to true
    axios.defaults.withCredentials = true;
    // make a post request with the user data
    axios
      .post('http://localhost:3001/login', data)
      .then((response) => {
        console.log('Status Code : ', response.status);
        console.log('response ', response.data);
        if (response.status === 200) {
          const redirectVar1 = <Redirect to="/dashboard" />;
          this.setState({
            redirecttohome: redirectVar1,
            // verifyauth: true
          });
          // alert('status 200');
        } else {
          console.log(response.data);
          alert(response.data);
          this.setState({
            // verifyauth: false,
            redirecttohome: null,
          });
        }
      })
      .catch((err) => {
        console.log(err.response.data);
        alert(err.response.data);
        this.setState({
          errorMessage: err.response.data,
        });
      });
  };

  render() {
    let redirectVar = null;
    if (cookie.load('cookie')) {
      redirectVar = <Redirect to="/dashboard" />;
    }
    const { errorMessage } = this.state;
    const { redirecttohome } = this.state;
    return (
      <div>
        {redirectVar}
        {redirecttohome}
        <div className="container">
          <div className="login-form">
            <div className="main-div">
              <div className="panel">
                <h2>Login</h2>
                <p>Please enter your email address and password</p>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  name="email"
                  placeholder="Email"
                  onChange={this.emailChangeHandler}
                  required
                  formNoValidate
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Password"
                  onChange={this.passwordChangeHandler}
                  required
                  formNoValidate
                />
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.submitLogin}
                formNoValidate
              >
                Login
              </button>
              <p className="errmsg" style={{ color: 'maroon' }}>
                {' '}
                {errorMessage}{' '}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
// export Login Component
export default login;
