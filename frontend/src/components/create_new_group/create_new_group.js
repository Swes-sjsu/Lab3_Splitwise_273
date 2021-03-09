import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
// import { cookie } from 'react-cookies';
import { instanceOf } from 'prop-types';
// import Cookies from 'universal-cookie';
import { Redirect } from 'react-router';
import { withCookies, Cookies } from 'react-cookie';

class Createnewgroup extends Component {
  // eslint-disable-next-line react/static-property-placement
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };

  constructor(props) {
    // Call the constrictor of Super class i.e The Component
    super(props);
    // maintain the state required for this component
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
    const { cookies } = this.props;
    this.state = {
      email: cookies.get('cookie'),
      username: cookies.get('cookie_username'),
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
    const { groupname, groupmembers, username, email } = this.state; // set state
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
            // verifyauth: false,
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
      <div className="content">
        <h2>START A NEW GROUP</h2>
        <form className="formgroup" id="new_group">
          <div id="group_avatar">
            <input type="file" name="group_avatar" id="group_avatar" />
          </div>
          <div style={{ 'font size': '24px' }}>
            My group shall be called....
            <div>
              <input
                type="text"
                name="group_name"
                id="group_name"
                onChange={this.groupnameChangeHandler}
              />
            </div>
          </div>
          <div
            className="group_members"
            style={{ 'margin-top': '15px', position: 'relative' }}
          >
            <div style={{ 'min-height': '126px' }}>
              <div id="users">
                <h2 style={{ 'margin-bottom': '10px' }}>Group members</h2>
                <div className="fields">
                  <div className="group-member">
                    <div className="fields">
                      {username}(<em>{email}</em>)
                    </div>
                    <div className="fields">
                      <div className="group-member editable">
                        <input
                          placeholder="Name"
                          className="name ui-autocomplete-input"
                          type="text"
                          // value=""
                          name="group[memberships_attributes][1][user_attributes][name]"
                          id="group_memberships_attributes_1_user_attributes_name"
                          onMouseLeave={this.groupmembersChangeHandler}
                          // autoComplete="off"
                        />
                        <input
                          placeholder="Email address (optional)"
                          className="email"
                          type="email"
                          name="group[memberships_attributes][1][user_attributes][email]"
                          id="group_memberships_attributes_1_user_attributes_email"
                        />
                        <input
                          type="hidden"
                          value="false"
                          name="group[memberships_attributes][1][user_attributes][_destroy]"
                          id="group_memberships_attributes_1_user_attributes__destroy"
                        />
                      </div>
                    </div>

                    <div className="fields">
                      <div className="group-member editable">
                        <input
                          placeholder="Name"
                          className="name ui-autocomplete-input"
                          type="text"
                          // value=""
                          name="group[memberships_attributes][2][user_attributes][name]"
                          id="group_memberships_attributes_2_user_attributes_name"
                          onMouseLeave={this.groupmembersChangeHandler}
                          // autoComplete="off"
                        />
                        <input
                          placeholder="Email address (optional)"
                          className="email"
                          type="email"
                          name="group[memberships_attributes][2][user_attributes][email]"
                          id="group_memberships_attributes_2_user_attributes_email"
                        />
                        <input
                          type="hidden"
                          value="false"
                          name="group[memberships_attributes][2][user_attributes][_destroy]"
                          id="group_memberships_attributes_2_user_attributes__destroy"
                        />
                      </div>
                    </div>

                    <div className="fields">
                      <div className="group-member editable">
                        <input
                          placeholder="Name"
                          className="name ui-autocomplete-input"
                          type="text"
                          // value=""
                          name="group[memberships_attributes][3][user_attributes][name]"
                          id="group_memberships_attributes_3_user_attributes_name"
                          onMouseLeave={this.groupmembersChangeHandler}
                          // autoComplete="off"
                        />
                        <input
                          placeholder="Email address (optional)"
                          className="email"
                          type="email"
                          name="group[memberships_attributes][3][user_attributes][email]"
                          id="group_memberships_attributes_3_user_attributes_email"
                        />
                        <input
                          type="hidden"
                          value="false"
                          name="group[memberships_attributes][3][user_attributes][_destroy]"
                          id="group_memberships_attributes_3_user_attributes__destroy"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div id="invite_link_container">
                <h2 style={{ 'margin-bottom': '10px', 'font-size': '15px' }}>
                  Invite group members by link
                </h2>

                <div
                  style={{
                    'font-size': '12px',
                    'line-height': '16px',
                    color: '#999',
                    margin: '-2px 0 12px',
                  }}
                >
                  Send this link to your friends, and when they click it,they
                  will automatically be added to this group.
                  <div style={{ height: '10px' }} />
                </div>
              </div>
            </div>
          </div>
          <div className="save">
            <button
              type="button"
              className="btn btn-primary"
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
        </form>
      </div>
    );
  }
}
export default withCookies(Createnewgroup);
