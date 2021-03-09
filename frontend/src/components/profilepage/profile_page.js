import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import Button from 'react-bootstrap/Button';
import Navheader from '../navbar/navbar';
import DefaultAvatar from '../../Profile_photos/default_avatar.png'; // import DefaultAvatar from '../  Profile_photos/default_avatar.png';
/* import Nav from 'react-bootstrap/Nav';

import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies'; */

import '../navbar/navbar.css';
import './profilepage.css';

class Profilepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profilephoto: '',
      username: '',
      email: '',
      phonenumber: '',
      defaultcurrency: '',
      timezone: '',
      language: '',
      redirecttohome: null,
      userid: '',
    };

    // Bind the handlers to this class
    this.usrchangeHandler = this.usrchangeHandler.bind(this);
    this.emailChangeHandler = this.emailChangeHandler.bind(this);
    this.phonenumberChangeHandler = this.phonenumberChangeHandler.bind(this);
    this.profilephtochangeHandler = this.profilephtochangeHandler.bind(this);
    this.defaultcurrencychangeHandler = this.defaultcurrencychangeHandler.bind(
      this
    );
    this.timezonechangeHandler = this.timezonechangeHandler.bind(this);
    this.languagechangeHandler = this.languagechangeHandler.bind(this);
    this.submitsave = this.submitsave.bind(this);
  }

  componentDidMount() {
    const userid1 = sessionStorage.getItem('userid');
    this.setState({
      userid: userid1,
    });
    this.getusercurrentdetails(userid1);
  }

  getusercurrentdetails = (userid) => {
    axios
      .get(`http://localhost:3001/getuserdetails${userid}`, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .then((response) => {
        console.log(response);
        this.setState({
          email: response.data.results[0].email,
          profilephoto: response.data.results[0].profphoto,
          username: response.data.results[0].usersname,
          phonenumber: response.data.results[0].usersphone,
          defaultcurrency: response.data.results[0].currencydef,
          timezone: response.data.results[0].timezone,
          language: response.data.results[0].language,
        });
      })
      .catch((err) => console.log(err));
  };

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

  phonenumberChangeHandler = (e) => {
    this.setState({
      phonenumber: e.target.value,
    });
  };

  profilephtochangeHandler = (e) => {
    this.setState({
      profilephoto: e.target.files[0],
    });
  };

  defaultcurrencychangeHandler = (e) => {
    this.setState({
      defaultcurrency: e.target.value,
    });
  };

  timezonechangeHandler = (e) => {
    this.setState({
      timezone: e.target.value,
    });
  };

  languagechangeHandler = (e) => {
    this.setState({
      language: e.target.value,
    });
  };

  submitsave = (e) => {
    e.preventDefault();
    const {
      profilephoto,
      username,
      email,
      phonenumber,
      defaultcurrency,
      timezone,
      language,
      userid,
    } = this.state;
    const formData = {
      userid,
      username,
      email,
      phonenumber,
      defaultcurrency,
      timezone,
      profilephoto,
      language,
    };
    axios
      .post('http://localhost:3001/updateprofile', formData)
      .then((response) => {
        console.log('Status Code : ', response.status);
        if (response.status === 200) {
          console.log(response.data);
          const { resuserid } = response.data.user_id;
          const { resusername } = response.data.username;
          const { resemail } = response.data.email;
          sessionStorage.setItem('userid', resuserid);
          sessionStorage.setItem('username', resusername);
          sessionStorage.setItem('useremail', resemail);
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
        const { errorMessage } = this.state;
        console.log(errorMessage);
      });
  };

  render() {
    const { redirecttohome } = this.state;
    let profilepic;
    const {
      profilephoto,
      username,
      email,
      phonenumber,
      defaultcurrency,
      timezone,
      language,
    } = this.state;
    if (profilephoto) {
      let imagestr = profilephoto;
      imagestr = imagestr.replace('public/', '');
      profilepic = `http://localhost:5000/${imagestr}`;
    } else {
      profilepic = DefaultAvatar;
    }
    return (
      <div>
        <Navheader />
        <div>
          {redirecttohome}
          <h2> Your account </h2>

          <form>
            <div className="avatar-div">
              <img src={profilepic} alt="profils pic" />
              <label htmlFor="profile_avatar">
                Change your avatar
                <input type="file" name="profile_avatar" id="profile_avatar" />
              </label>
            </div>

            <div className="basic_div">
              <label htmlFor="username">
                Your name
                <input
                  type="text"
                  name="username"
                  id="username"
                  defaultValue={username}
                  onChange={this.usrchangeHandler}
                />
              </label>
              <label htmlFor="email">
                Your email address
                <input
                  type="email"
                  name="email"
                  id="email"
                  defaultValue={email}
                  onChange={this.emailChangeHandler}
                />
              </label>
              <label htmlFor="phonenumber">
                Your phone number
                <input
                  type="text"
                  name="phonenumber"
                  id="phonenumber"
                  defaultValue={phonenumber}
                  onChange={this.usrchangeHandler}
                />
              </label>
            </div>

            <div className="default_div">
              <label htmlFor="defaultcurrency">
                Your default currency
                <input
                  type="text"
                  name="defaultcurrency"
                  id="defaultcurrency"
                  defaultValue={defaultcurrency}
                  onChange={this.defaultcurrencychangeHandler}
                />
              </label>
              <label htmlFor="timezone">
                Your email address
                <input
                  type="text"
                  name="timezone"
                  id="timezone"
                  defaultValue={timezone}
                  onChange={this.timezonechangeHandler}
                />
              </label>
              <label htmlFor="language">
                Language
                <input
                  type="text"
                  name="language"
                  id="language"
                  defaultValue={language}
                  onChange={this.languagechangeHandler}
                />
              </label>
            </div>
            <div>
              <Button className="Signup-default" onClick={this.submitsave}>
                Save
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Profilepage;
