/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import '../../App.css';
// import axios from 'axios';
// import bcrypt from 'bcryptjs';
// import Proptypes from 'prop-types';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import { signupMutation } from '../../mutations/mutation';
import Navheader from '../navbar/navbar';
import '../navbar/navbar.css';

// const saltRounds = 10;

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      usernameerrors: '',
      emailerrors: '',
      passworderrors: '',
      redirecttohome: null,
    };

    // Bind the handlers to this class
    this.usrchangeHandler = this.usrchangeHandler.bind(this);
    this.emailChangeHandler = this.emailChangeHandler.bind(this);
    this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    this.submitsignup = this.submitsignup.bind(this);
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

  passwordChangeHandler = (e) => {
    this.setState({
      password: e.target.value,
    });
  };

  isformvalid = () => {
    let formisvalid = true;
    const signuperrors = {
      usernameerrors: '',
      emailerrors: '',
      passworderrors: '',
    };

    const emailpattern =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,4})$/;
    const pwdpattern =
      /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,50}$/;

    const { username, email, password } = this.state;

    if (username.length === 0) {
      formisvalid = false;
      signuperrors.usernameerrors = 'Username cannot be blank!';
      console.log(signuperrors.usernameerrors);
    }

    if (!emailpattern.test(email)) {
      formisvalid = false;
      if (email.length === 0) {
        signuperrors.emailerrors = 'Email address cannot be blank!';
      } else {
        signuperrors.emailerrors = 'Email ID is not Valid!';
      }
      console.log(signuperrors.emailerrors);
    }
    if (!pwdpattern.test(password)) {
      formisvalid = false;
      signuperrors.passworderrors =
        'Password is not valid and must contain minimum 8 characters with a numeric, special character , lower and upper case letters!';
      console.log(signuperrors.passworderrors);
    }
    this.setState((prevstate) => ({
      ...prevstate,
      ...signuperrors,
    }));

    console.log(
      formisvalid,
      signuperrors.usernameerrors,
      signuperrors.emailerrors,
      signuperrors.passworderrors
    );
    return formisvalid;
  };

  // submit Login handler to send a request to the node backend
  submitsignup = async (e) => {
    // prevent page from refresh
    e.preventDefault();
    const formisvalidated = this.isformvalid();
    console.log(formisvalidated);
    if (formisvalidated) {
      const { username, email, password } = this.state;
      const data = {
        username,
        email,
        password,
      };
      console.log(data);

      try {
        const response = await this.props.signupMutation({
          variables: {
            username,
            email,
            password,
          },
        });
        console.log(response);
        console.log(response.data.signup.status);
        if (response.data.signup.status === 200) {
          const resuserid = response.data.signup.user_id;
          const resusername = response.data.signup.username;
          const resemail = response.data.signup.email;
          const rescurrency = response.data.signup.currencydef;
          let resprofile;
          if (response.data.signup.profilepic === '' || ' ' || 'undefined') {
            resprofile =
              'https://splitwise-profilepictures.s3.amazonaws.com/default_avatar.png';
          } else {
            resprofile = response.data.signup.profilepic;
          }
          sessionStorage.setItem('userid', resuserid);
          sessionStorage.setItem('username', resusername);
          sessionStorage.setItem('useremail', resemail);
          sessionStorage.setItem('profilepic', resprofile);
          sessionStorage.setItem('defaultcurrency', rescurrency);
          const redirectVar1 = <Redirect to="/dashboard" />;
          this.setState({ redirecttohome: redirectVar1 });
        } else {
          this.setState({
            redirecttohome: null,
          });
        }
      } catch (err) {
        console.log(err.graphQLErrors[0].message);
        alert('Email already exists!!Please Login or use a different email ID');
        this.setState({
          errorMessage:
            'Email already exists!!Please Login or use a different email ID',
        });
      }
      /*
      // set the with credentials to true
      axios.defaults.withCredentials = true;
      // make a post request with the user data
      axios
        .post('http://localhost:3001/signup', data)
        .then((response) => {
          console.log('Status Code : ', response.status);
          if (response.status === 200) {
            console.log(response.data);
            console.log(response.data.username);
            const resuserid = response.data.user_id;
            const resusername = response.data.username;
            const resemail = response.data.email;
            const rescurrency = response.data.currencydef;
            sessionStorage.setItem('userid', resuserid);
            sessionStorage.setItem('username', resusername);
            sessionStorage.setItem('useremail', resemail);
            sessionStorage.setItem('profilepic', null);
            sessionStorage.setItem('defaultcurrency', rescurrency);
            const redirectVar1 = <Redirect to="/dashboard" />;
            this.setState({ redirecttohome: redirectVar1 });
          } else {
            this.setState({
              redirecttohome: null,
            });
          }
        })
        .catch((err) => {
          console.log(err.response);
          alert(err.response.data);
          this.setState({
            errorMessage: err.response.data,
          });
        }); */
    }
  };

  render() {
    let redirectVar = null;
    if (cookie.load('cookie')) {
      redirectVar = <Redirect to="/dashboard" />;
    }
    const { usernameerrors, emailerrors, passworderrors, errorMessage } =
      this.state;
    const { redirecttohome } = this.state;
    return (
      <form>
        <div>
          <Navheader />
          <div className="container">
            {redirectVar}
            {redirecttohome}
            <div className="signup-form">
              <div className="main-div">
                <div className="panel">
                  <h2>Welcome to Splitwise!</h2>
                  <br />
                  <br />
                  <h3>INTRODUCE YOURSELF</h3>
                  <br />
                  <br />
                </div>
                <div className="form-group">
                  <label htmlFor="username">
                    Hi there! My name is
                    <input
                      type="text"
                      onChange={this.usrchangeHandler}
                      className="form-control"
                      name="username"
                      placeholder="Username"
                      required
                      formNoValidate
                    />
                  </label>
                  <br />
                  {usernameerrors && (
                    <span className="errmsg" style={{ color: 'maroon' }}>
                      {' '}
                      {usernameerrors}{' '}
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="username">
                    Here???s my email address:
                    <input
                      type="text"
                      onChange={this.emailChangeHandler}
                      className="form-control"
                      name="email"
                      placeholder="Email Address"
                      required
                      formNoValidate
                    />
                  </label>
                  <br />
                  {emailerrors && (
                    <span className="errmsg" style={{ color: 'maroon' }}>
                      {' '}
                      {emailerrors}{' '}
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="username">
                    And here???s my password:
                    <input
                      type="password"
                      onChange={this.passwordChangeHandler}
                      className="form-control"
                      name="password"
                      placeholder="Password"
                      required
                      formNoValidate
                    />
                  </label>
                  <br />
                  {passworderrors && (
                    <span className="errmsg" style={{ color: 'maroon' }}>
                      {' '}
                      {passworderrors}{' '}
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  onClick={this.submitsignup}
                  className="Signup-default"
                  formNoValidate
                >
                  Sign Up
                </button>
                <p className="errmsg" style={{ color: 'maroon' }}>
                  {' '}
                  {errorMessage}{' '}
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}
// export Signup Component

export default compose(graphql(signupMutation, { name: 'signupMutation' }))(
  Signup
);
