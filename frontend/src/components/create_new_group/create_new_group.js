import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import { Redirect } from 'react-router';
import Navheader from '../navbar/navbar';
import DefaultAvatar from '../../Profile_photos/default_avatar.png';
import '../navbar/navbar.css';

class Createnewgroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupname: '',
      groupmembers: [],
    };

    // Bind the handlers to this class
    this.groupnameChangeHandler = this.groupnameChangeHandler.bind(this);
    this.groupmembersChangeHandler = this.groupmembersChangeHandler.bind(this);
    this.submitgroupcreate = this.submitgroupcreate.bind(this);
  }

  componentWillMount() {
    this.state = {
      email: sessionStorage.getItem('useremail'),
      username: sessionStorage.getItem('username'),
      redirecttogroup: null,
      groupname: '',
      groupmembers: [],
    };
  }

  groupnameChangeHandler = (e) => {
    this.setState({
      groupname: e.target.value,
    });
  };

  groupmembersChangeHandler = (e) => {
    this.setState((prevstate) => ({
      groupmembers: [...prevstate.groupmembers, e.target.value],
    }));
  };

  submitgroupcreate = async (e) => {
    e.preventDefault();
    const { groupname, groupmembers, username, email } = this.state;
    const data = {
      groupname,
      groupmembers,
      username,
      email,
    };
    console.log(data);
    axios
      .post('http://localhost:3001/createnewgroup', data)
      .then((response) => {
        console.log('Status Code : ', response.status);
        console.log('response ', response.data);
        if (response.status === 200) {
          const redirectVar1 = <Redirect to="/group" />;
          this.setState({
            redirecttogroup: redirectVar1,
          });
        } else {
          console.log(response.data);
          alert(response.data);
          this.setState({
            redirecttogroup: null,
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
    const { email, username } = this.state;
    const { errorMessage } = this.state;
    const { redirecttogroup } = this.state;
    console.log(username, email);
    return (
      <div>
        <Navheader />
        <div id="group_avatar">
          <img src={DefaultAvatar} alt="profils pic" />
          <br />
          <input type="file" name="group_avatar" id="group_avatar" />
        </div>

        <div className="createnewgroup">
          <h2>START A NEW GROUP</h2>
          <form className="formgroup" id="new_group">
            <div>
              <h3>My group shall be called....</h3>
              <input
                type="text"
                name="group_name"
                id="group_name"
                onChange={this.groupnameChangeHandler}
              />
            </div>

            <div className="group_members">
              <div className="users">
                <h2>Group members</h2>
                <div className="group-member">
                  <div className="grpnameemail">
                    {username}(<em>{email}</em>)
                  </div>
                  <div className="grpnameemail">
                    <input
                      placeholder="Name"
                      className="name ui-autocomplete-input"
                      type="text"
                      // value=""
                      name="group_members_name_1"
                      id="group_members_name_1"
                      onMouseLeave={this.groupmembersChangeHandler}
                      // autoComplete="off"
                    />
                    <input
                      placeholder="Email address (optional)"
                      className="email"
                      type="email"
                      name="group_members_email_1"
                      id="group_members_email_1"
                    />
                  </div>

                  <div className="grpnameemail">
                    <input
                      placeholder="Name"
                      className="name ui-autocomplete-input"
                      type="text"
                      // value=""
                      name="group_members_name_2"
                      id="group_members_name_2"
                      onMouseLeave={this.groupmembersChangeHandler}
                      // autoComplete="off"
                    />
                    <input
                      placeholder="Email address (optional)"
                      className="email"
                      type="email"
                      name="group_members_email_2"
                      id="group_members_email_2"
                    />
                  </div>

                  <div className="grpnameemail">
                    <input
                      placeholder="Name"
                      className="name ui-autocomplete-input"
                      type="text"
                      // value=""
                      name="group_members_name_3"
                      id="group_members_name_3"
                      onMouseLeave={this.groupmembersChangeHandler}
                      // autoComplete="off"
                    />
                    <input
                      placeholder="Email address (optional)"
                      className="email"
                      type="email"
                      name="group_members_email_3"
                      id="group_members_email_3"
                    />
                  </div>
                </div>
              </div>

              <div id="invite_link_container">
                <h2>Invite group members by link</h2>

                <div className="invitelink">
                  Send this link to your friends, and when they click it,they
                  will automatically be added to this group.
                  <div />
                </div>
                <div className="save">
                  <button
                    type="button"
                    className="Signup-default"
                    onClick={this.submitgroupcreate}
                    formNoValidate
                  >
                    Save
                  </button>
                  <p className="errmsg" style={{ color: 'maroon' }}>
                    {' '}
                    {errorMessage}{' '}
                  </p>
                  {redirecttogroup}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
export default Createnewgroup;
