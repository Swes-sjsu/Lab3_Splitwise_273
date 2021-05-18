/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import cookie from 'react-cookies';
import Button from 'react-bootstrap/Button';
import { Form, Image } from 'react-bootstrap';
import { uploadFile } from 'react-s3';
import { graphql, withApollo } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import { userdetailsQuery } from '../../query/query';
import { updateprofileMutation } from '../../mutations/mutation';
import Navheader from '../navbar/navbar';

// import DefaultAvatar from '../../../public/Profile_photos/default_avatar.png'; // import DefaultAvatar from '../  Profile_photos/default_avatar.png';

import '../navbar/navbar.css';
import './profilepage.css';

class Profilepage extends Component {
  constructor(props) {
    super(props);
    this.profileform = React.createRef();
    this.state = {
      profilephoto: null,
      username: '',
      email: '',
      phonenumber: '',
      defaultcurrency: '',
      timezone: '',
      language: '',
      // redirecttohome: null,
      userid: '',
      setSelectedfile: null,
      updatedpic: false,
      usernameerrors: '',
      emailerrors: '',
      phoneerrors: '',
    };

    // Bind the handlers to this class
    this.usrchangeHandler = this.usrchangeHandler.bind(this);
    this.emailChangeHandler = this.emailChangeHandler.bind(this);
    this.phonenumberChangeHandler = this.phonenumberChangeHandler.bind(this);
    this.profilephtochangeHandler = this.profilephtochangeHandler.bind(this);
    this.defaultcurrencychangeHandler =
      this.defaultcurrencychangeHandler.bind(this);
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

  getusercurrentdetails = async (userid) => {
    const response = await this.props.client.query({
      query: userdetailsQuery,
      variables: { user_id: userid },
    });
    console.log(response.data.userdetails);
    if (response.data.userdetails.status === 200) {
      this.setState({
        email: response.data.userdetails.email,
        profilephoto: response.data.userdetails.profilepic,
        username: response.data.userdetails.username,
        phonenumber: response.data.userdetails.phonenumber,
        defaultcurrency: response.data.userdetails.currencydef,
        timezone: response.data.userdetails.timezone,
        language: response.data.userdetails.language,
      });
    }
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
    const S3_BUCKET = 'splitwise-profilepictures';
    const REGION = 'us-east-1';
    const ACCESS_KEY = 'AKIAJSP2ZFMVUPCPOXLA';
    const SECRET_ACCESS_KEY = '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';

    const config = {
      bucketName: S3_BUCKET,
      region: REGION,
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_ACCESS_KEY,
    };
    this.setState({
      // profilephoto: e.target.files[0],
      setSelectedfile: e.target.files[0],
      updatedpic: true,
    });
    uploadFile(e.target.files[0], config)
      .then((data) => {
        const loc = data.location;
        console.log(loc);
        this.setState({
          profilephoto: loc,
        });
      })
      .catch((err) => {
        console.error('error during upload file ', err);
      });
  };

  defaultcurrencychangeHandler = (e) => {
    console.log('currecny change ', e.target.value);
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

  isformvalid = () => {
    let formisvalid = true;
    const formerrors = {
      usernameerrors: '',
      emailerrors: '',
      phoneerrors: '',
    };

    const emailpattern =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,4})$/;
    const phnpattern = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

    const { username, email, phonenumber } = this.state;

    if (username.length === 0) {
      formisvalid = false;
      formerrors.usernameerrors = 'Username cannot be blank!';
      console.log(formerrors.usernameerrors);
    }

    if (!emailpattern.test(email)) {
      formisvalid = false;
      if (email.length === 0) {
        formerrors.emailerrors = 'Email address cannot be blank!';
      } else {
        formerrors.emailerrors = 'Email ID is not Valid!';
      }
      console.log(formerrors.emailerrors);
    }
    if (!phnpattern.test(phonenumber) && phonenumber.length > 0) {
      formisvalid = false;
      formerrors.phoneerrors = 'Phone Number is not valid!';
      console.log(formerrors.phoneerrors);
    }
    this.setState((prevstate) => ({
      ...prevstate,
      ...formerrors,
    }));
    return formisvalid;
  };

  submitsave = async (e) => {
    e.preventDefault();
    const {
      email,
      username,
      profilephoto,
      userid,
      phonenumber,
      defaultcurrency,
      timezone,
      language,
      updatedpic,
    } = this.state;
    const formisvalidated = this.isformvalid();
    console.log(updatedpic, formisvalidated);
    if (formisvalidated) {
      console.log(
        'Swes inside form valideatded ',
        formisvalidated,
        profilephoto
      );
      try {
        const response = await this.props.updateprofileMutation({
          variables: {
            user_id: userid,
            email,
            username,
            phonenumber,
            currencydef: defaultcurrency,
            timezone,
            language,
            profilepic: profilephoto,
          },
          refetchQueries: [
            { query: userdetailsQuery, variables: { user_id: userid } },
          ],
        });
        console.log(response.data.updateprofile.status);
        console.log(response.data.updateprofile);
        console.log(response.data);
        if (response.data.updateprofile.status === 200) {
          sessionStorage.setItem(
            'username',
            response.data.updateprofile.username
          );
          sessionStorage.setItem(
            'useremail',
            response.data.updateprofile.email
          );
          sessionStorage.setItem(
            'profilepic',
            response.data.updateprofile.profilepic
          );
          sessionStorage.setItem(
            'defaultcurrency',
            response.data.updateprofile.currencydef
          );
          // this.getusercurrentdetails(userid);
          this.setState({
            updatedpic: false,
            // email: response.data.updateprofile.email,
            // profilephoto: response.data.updateprofile.profilepic,
            // username: response.data.updateprofile.username,
            // phonenumber: response.data.updateprofile.phonenumber,
            // defaultcurrency: response.data.updateprofile.currencydef,
            // timezone: response.data.updateprofile.timezone,
            // language: response.data.updateprofile.language,
          });
          // const redirectVar1 = <Redirect to="/dashboard" />;
          // this.setState({ redirecttohome: redirectVar1 });
        }
      } catch (err) {
        console.log(err);
        alert(err);
        this.setState({
          errorMessage: JSON.stringify(err),
        });
      }
    }
  };

  render() {
    let redirectVar = null;
    if (!cookie.load('cookie')) {
      redirectVar = <Redirect to="/" />;
    }
    // const { redirecttohome } = this.state;
    // let profilepic = '/Profile_photos/default_avatar.png';
    const {
      username,
      email,
      phonenumber,
      defaultcurrency,
      timezone,
      language,
      usernameerrors,
      emailerrors,
      phoneerrors,
    } = this.state;
    const imagename = sessionStorage.getItem('profilepic');
    console.log(imagename);
    // if (profilephoto) profilepic = DefaultAvatar;
    return (
      <div>
        {redirectVar}
        <Navheader />
        <div className="profilepage-block">
          <h2> Your account </h2>
          <section>
            <div className="avatar-div">
              <Image src={imagename} className="avatar1" alt="profile pic" />
              <br />
              <label htmlFor="profile_avatar">
                Change your avatar <br />
                <input
                  type="file"
                  name="profile_avatar"
                  id="profile_avatar"
                  onChange={this.profilephtochangeHandler}
                />
              </label>
            </div>
          </section>

          <section>
            <Form
              ref={this.profileform}
              id="profileform"
              className="profileform"
            >
              <section className="center-block">
                <div className="basic_div">
                  <label htmlFor="username">
                    Your name <br />
                    <input
                      type="text"
                      name="username"
                      id="username"
                      defaultValue={username}
                      onChange={this.usrchangeHandler}
                    />
                  </label>
                  <br />
                  <br />
                  <label htmlFor="email">
                    Your email address <br />
                    <input
                      type="email"
                      name="email"
                      id="email"
                      defaultValue={email}
                      onChange={this.emailChangeHandler}
                    />
                  </label>
                  <br />
                  <br />
                  <label htmlFor="phonenumber">
                    Your phone number <br />
                    <input
                      type="text"
                      name="phonenumber"
                      id="phonenumber"
                      defaultValue={phonenumber}
                      onChange={this.phonenumberChangeHandler}
                    />
                  </label>
                </div>
                {usernameerrors && (
                  <span className="errmsg" style={{ color: 'maroon' }}>
                    {' '}
                    {usernameerrors}{' '}
                  </span>
                )}
                {emailerrors && (
                  <span className="errmsg" style={{ color: 'maroon' }}>
                    {' '}
                    {emailerrors}{' '}
                  </span>
                )}
                {phoneerrors && (
                  <span className="errmsg" style={{ color: 'maroon' }}>
                    {' '}
                    {phoneerrors}{' '}
                  </span>
                )}
              </section>

              <section className="right-block">
                <div className="default_div">
                  <Form.Group controlId="defaultcurrency">
                    <Form.Label>Your default currency</Form.Label>
                    <Form.Control
                      as="select"
                      value={defaultcurrency}
                      placeholder={defaultcurrency}
                      onChange={this.defaultcurrencychangeHandler}
                    >
                      <option value="BHD (BD)">BHD (BD)</option>
                      <option value="CAD (C$)">CAD (C$)</option>
                      <option value="EUR (€)">EUR (€)</option>
                      <option value="GBP (£)">GBP (£)</option>
                      <option value="KWD (KWD)">KWD (KWD)</option>
                      <option value="USD ($)">USD ($)</option>
                    </Form.Control>
                  </Form.Group>
                  <br />
                  <Form.Group controlId="timezone">
                    <Form.Label>TimeZone</Form.Label>
                    <Form.Control
                      as="select"
                      value={timezone}
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
                      <option>
                        (GMT -3:00) Brazil, Buenos Aires, Georgetown
                      </option>
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
                      <option>
                        (GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi
                      </option>
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
                      value={language}
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
                <div className="savebtn" data-testid="Saveupdates">
                  <Button className="Signup-default" onClick={this.submitsave}>
                    Save
                  </Button>
                </div>
              </section>
            </Form>
          </section>
        </div>
      </div>
    );
  }
}

// export default Profilepage;

export default compose(
  withApollo,

  graphql(updateprofileMutation, { name: 'updateprofileMutation' })
)(Profilepage);
