import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import Button from 'react-bootstrap/Button';
import { Form } from 'react-bootstrap';
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
      .get(`http://localhost:3001/getuserdetails/${userid}`, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .then((response) => {
        console.log(response.data[0].email);
        this.setState({
          email: response.data[0].email,
          profilephoto: response.data[0].profphoto,
          username: response.data[0].usersname,
          phonenumber: response.data[0].usersphone,
          defaultcurrency: response.data[0].currencydef,
          timezone: response.data[0].timezone,
          language: response.data[0].language,
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
    const { profilephoto, userid } = this.state;
    const formdata = new FormData(e.target);
    formdata.append('profphoto', profilephoto);
    formdata.append('idusers', userid);
    console.log(formdata.entries);
    axios
      .post('http://localhost:3001/updateprofile', formdata)
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
          this.setState({ profilephoto: response.data.results.profphoto });
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

          <Form className="form">
            <Form.Control type="text" name="profileinput" />
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
              <Form.Group controlId="defaultcurrency">
                <Form.Label>Your default currency</Form.Label>
                <Form.Control
                  as="select"
                  defaultValue={defaultcurrency}
                  onChange={this.defaultcurrencychangeHandler}
                >
                  <option>BHD (BD)</option>
                  <option>CAD (C$)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                  <option>KWD (KWD)</option>
                  <option>USD ($)</option>
                </Form.Control>
              </Form.Group>
              <br />
              <Form.Group controlId="timezone">
                <Form.Label>TimeZone</Form.Label>
                <Form.Control
                  as="select"
                  defaultValue={timezone}
                  onChange={this.timezonechangeHandler}
                >
                  <option>(GMT -12:00) Eniwetok, Kwajalein</option>
                  <option>(GMT -11:00) Midway Island, Samoa</option>
                  <option>(GMT -10:00) Hawaii</option>
                  <option>(GMT -9:00) Alaska</option>
                  <option>(GMT -8:00) Pacific Time (US & Canada)</option>
                  <option>(GMT -7:00) Mountain Time (US & Canada)</option>
                  <option>
                    (GMT -6:00) Central Time (US & Canada), Mexico City
                  </option>
                  <option>
                    (GMT -5:00) Eastern Time (US & Canada), Bogota, Lima
                  </option>
                  <option>
                    (GMT -4:00) Atlantic Time (Canada), Caracas, La Paz
                  </option>
                  <option>(GMT -3:00) Brazil, Buenos Aires, Georgetown</option>
                  <option>(GMT -2:00) Mid-Atlantic</option>
                  <option>(GMT -1:00) Azores, Cape Verde Islands</option>
                  <option>
                    (GMT) Western Europe Time, London, Lisbon, Casablanca
                  </option>
                  <option>
                    (GMT +1:00) Brussels, Copenhagen, Madrid, Paris
                  </option>
                  <option>(GMT +2:00) Kaliningrad, South Africa</option>
                  <option>
                    (GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg
                  </option>
                  <option>(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi</option>
                  <option>
                    (GMT +5:30) Bombay, Calcutta, Madras, New Delhi
                  </option>
                  <option>(GMT +6:00) Almaty, Dhaka, Colombo</option>
                  <option>(GMT +7:00) Bangkok, Hanoi, Jakarta</option>
                  <option>
                    (GMT +8:00) Beijing, Perth, Singapore, Hong Kong
                  </option>
                  <option>
                    (GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk
                  </option>
                  <option>
                    (GMT +10:00) Eastern Australia, Guam, Vladivostok
                  </option>
                  <option>
                    (GMT +11:00) Magadan, Solomon Islands, New Caledonia
                  </option>
                  <option>
                    (GMT +12:00) Auckland, Wellington, Fiji, Kamchatka
                  </option>
                </Form.Control>
              </Form.Group>
              <br />
              <Form.Group controlId="language">
                <Form.Label>Language</Form.Label>
                <Form.Control
                  as="select"
                  defaultValue={language}
                  onChange={this.languagechangeHandler}
                >
                  <option>English</option>
                  <option>Deutsch</option>
                  <option>Italiano</option>
                  <option>Nederlands</option>
                  <option>Svenska</option>
                </Form.Control>
              </Form.Group>
            </div>
            <div>
              <Button className="Signup-default" onClick={this.submitsave}>
                Save
              </Button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

export default Profilepage;
