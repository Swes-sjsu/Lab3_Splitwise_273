import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Navheader from '../navbar/navbar';

// Define a Login Component
class Login extends Component {
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
    // sessionStorage.clear();
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
          console.log(response.data);
          console.log(response.data.username);
          const resuserid = response.data.user_id;
          const resusername = response.data.username;
          const resemail = response.data.email;
          const resprofpic = response.data.profilepic;
          const rescurrency = response.data.currencydef;
          // const restz = response.data.TZ;
          sessionStorage.setItem('userid', resuserid);
          sessionStorage.setItem('username', resusername);
          sessionStorage.setItem('useremail', resemail);
          sessionStorage.setItem('profilepic', resprofpic);
          sessionStorage.setItem('defaultcurrency', rescurrency);
          // sessionStorage.setItem('timezone', restz);
          const redirectVar1 = <Redirect to="/dashboard" />;
          this.setState({
            redirecttohome: redirectVar1,
          });
        } else {
          console.log(response.data);
          alert(response.data);
          this.setState({
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
        <Navheader />
        <div className="container">
          <div className="login-form">
            <div className="main-div">
              <div className="panel">
                <h2>Welcome to Splitwise</h2>
              </div>
              <div className="form-group">
                <label htmlFor="email">
                  EMAIL ADDRESS
                  <input
                    type="text"
                    className="form-control"
                    name="email"
                    id="email"
                    placeholder="Email"
                    onChange={this.emailChangeHandler}
                    required
                    formNoValidate
                  />
                </label>
              </div>
              <div className="form-group">
                <label htmlFor="email">
                  PASSSWORD
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    id="password"
                    placeholder="Password"
                    onChange={this.passwordChangeHandler}
                    required
                    formNoValidate
                  />
                </label>
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
export default Login;
