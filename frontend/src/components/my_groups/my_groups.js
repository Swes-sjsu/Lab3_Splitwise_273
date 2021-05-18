/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import cookie from 'react-cookies';
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
import { graphql, withApollo } from 'react-apollo';
import { flowRight as compose, isEmpty } from 'lodash';
// import { Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import Navheader from '../navbar/navbar';
import Sidebarcomp from '../navbar/sidebar';
import {
  acceptinviteMutation,
  denyinviteMutation,
} from '../../mutations/mutation';
import { usergroupsQuery, usergroupinvitesQuery } from '../../query/query';
import '../navbar/navbar.css';
import '../dashboard/dashboard.css';
import './my_groups.css';

class Mygroups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: '',
      useremail: '',
      groupslist: [],
      invitelist: [],
      popup: false,
      gpselectoptions: [],
      selectedvalue: {},
      groupinvite: '',
    };

    // Bind the handlers to this class
    this.acceptinvitation = this.acceptinvitation.bind(this);
    this.denyinvitation = this.denyinvitation.bind(this);
    this.gpselectoptionshandler = this.gpselectoptionshandler.bind(this);
    this.gotogrouppage = this.gotogrouppage.bind(this);
    this.showHandler = this.showHandler.bind(this);
    this.closeHandler = this.closeHandler.bind(this);
  }

  componentWillMount() {
    const userid1 = sessionStorage.getItem('userid');
    const useremail1 = sessionStorage.getItem('useremail');
    const getuserpgroups = this.getuserpgroups(userid1);
    const getpgroupinvites = this.getpgroupinvites(userid1);
    this.setState({
      userid: userid1,
      useremail: useremail1,
      groupslist: getuserpgroups,
      invitelist: getpgroupinvites,
    });
  }

  showHandler = (grpname) => {
    this.setState({ popup: true, groupinvite: grpname });
  };

  closeHandler = () => {
    this.setState({ popup: false, groupinvite: '' });
  };

  getuserpgroups = async (userid) => {
    try {
      const response = await this.props.client.query({
        query: usergroupsQuery,
        variables: { user_id: userid },
      });
      const { usergroups } = response.data;

      console.log(usergroups);
      const newaar = usergroups.map((el) => el.groupname);
      console.log(newaar);
      const arrayforselect = usergroups.map((el) => ({
        value: el.groupname,
        label: el.groupname,
      }));
      console.log(arrayforselect);
      this.setState({
        groupslist: newaar,
        gpselectoptions: arrayforselect,
      });
    } catch (err) {
      console.log(err);
      alert(err);
      this.setState({
        errorMessage: JSON.stringify(err),
      });
    }
  };

  getpgroupinvites = async (userid) => {
    try {
      const response = await this.props.client.query({
        query: usergroupinvitesQuery,
        variables: { user_id: userid },
      });
      const { usergroupsinvites } = response.data;

      console.log(' User groups invites response ', usergroupsinvites);

      const newaar = usergroupsinvites.map((el) => el.groupname);
      console.log(newaar);
      this.setState({
        invitelist: newaar,
      });
    } catch (err) {
      console.log(err);
      alert(err);
      this.setState({
        errorMessage: JSON.stringify(err),
      });
    }
  };

  acceptinvitation = async () => {
    // e.preventDefault();
    // console.log(e.target.value);
    this.setState({ popup: false });
    const { popup, userid, useremail, groupinvite } = this.state;
    // const currentgrp = groupinvite;

    console.log(popup);

    try {
      const response = await this.props.acceptinviteMutation({
        variables: {
          user_id: userid,
          currentgrp: groupinvite,
          email: useremail,
        },
      });
      console.log(response.data.acceptinvite);
      if (response.data.acceptinvite.status === 200) {
        console.log(response.data);
        this.getuserpgroups(userid);
        this.getpgroupinvites(userid);
      }
    } catch (err) {
      console.log(err);
      alert(err);
      this.setState({
        errorMessage: JSON.stringify(err),
      });
    }

    this.setState({ groupinvite: '' });
  };

  denyinvitation = async () => {
    // e.preventDefault();
    // console.log(e.target.value);
    this.setState({ popup: false });
    const { popup, userid, useremail, groupinvite } = this.state;

    console.log(popup);

    try {
      const response = await this.props.denyinviteMutation({
        variables: {
          user_id: userid,
          currentgrp: groupinvite,
          email: useremail,
        },
      });
      console.log(response.data.denyinvite);
      if (response.data.denyinvite.status === 200) {
        console.log(response.data);
        this.getuserpgroups(userid);
        this.getpgroupinvites(userid);
      }
    } catch (err) {
      console.log(err);
      alert(err);
      this.setState({
        errorMessage: JSON.stringify(err),
      });
    }

    this.setState({ groupinvite: '' });
  };

  gotogrouppage = (groupname, e) => {
    e.preventDefault();
    sessionStorage.setItem('groupname', groupname);
    // const redirectVar1 = <Redirect to="/group" />;
    const redirectVar1 = (
      <Redirect to={{ pathname: '/group', state: { gName: groupname } }} />
    );
    this.setState({ redirecttopage: redirectVar1 });
  };

  gpselectoptionshandler = (e) => {
    // const { selectvalue } = this.state;
    const newarr = e.value;
    console.log(e.value);
    this.setState({ selectedvalue: newarr });
  };

  render() {
    let redirectVar = null;
    if (!cookie.load('cookie')) {
      redirectVar = <Redirect to="/" />;
    }
    const { redirecttopage } = this.state;
    const { groupslist, gpselectoptions } = this.state;
    const { invitelist, errorMessage } = this.state;
    const { popup, selectedvalue, groupinvite } = this.state;

    console.log(groupslist, invitelist, selectedvalue, errorMessage);
    let checkifinvitesnull = false;
    let checkifgroupsnull = false;
    if (isEmpty(invitelist)) {
      checkifinvitesnull = true;
    }
    if (isEmpty(groupslist)) {
      checkifgroupsnull = true;
    }
    console.log(checkifinvitesnull, checkifgroupsnull);
    return (
      <div>
        {redirectVar}
        <Navheader />
        <div className="mygroups-flex">
          <Sidebarcomp />
          <div className="mygroups-box">
            <section className="mygroups-heading">
              <h1>My Groups Summary</h1>
              <ul className="button-right">
                <li>
                  <Button className="Signup-default">
                    <Link to="/createnewgroup">Create Group</Link>
                  </Button>
                </li>
              </ul>
            </section>

            <section className="mygroups-left-sec">
              <div className="mygroups-left-section-block">
                <div className="title">
                  <h6>Invitation Pending </h6>
                </div>
              </div>
              <div>
                {checkifinvitesnull ? (
                  <h7> NO INVITES PENDING!</h7>
                ) : (
                  <div>
                    {' '}
                    {invitelist.map((groupname) => (
                      <ul className="mygroups-button">
                        <li>
                          <Button
                            className="Signup-default"
                            onClick={() => this.showHandler(groupname)}
                            style={{
                              height: '33px',
                              width: '350px',
                              'font-size': '17px',
                            }}
                          >
                            {groupname}
                          </Button>
                        </li>
                      </ul>
                    ))}
                    <Modal show={popup} onHide={this.closeHandler}>
                      <Modal.Header closeButton>
                        <Modal.Title>Group Invitation</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        Do you wish to accept the invitaion to join the group{' '}
                        <span>
                          <b>{groupinvite}</b>
                        </span>{' '}
                        or reject the invitation?
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          className="login-default"
                          onClick={() => this.acceptinvitation()}
                        >
                          √ Accept
                        </Button>
                        <Button
                          className="Signup-default"
                          onClick={() => this.denyinvitation()}
                        >
                          x Reject
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </div>
                )}
              </div>
            </section>

            <section className="mygroups-center-sec">
              <div className="mygroups-center-section-block">
                <div className="title">
                  <h6>My Groups </h6>
                </div>
              </div>
              {checkifgroupsnull ? (
                <h7>
                  {' '}
                  <br />
                  YOU ARE NOT PART OF ANY GROUPS AS YET!
                </h7>
              ) : (
                <div>
                  {' '}
                  {groupslist.map((groupname) => (
                    <ul className="mygroups-button">
                      <li>
                        <Button
                          className="login-default"
                          size="lg"
                          onClick={(e) => this.gotogrouppage(groupname, e)}
                          style={{
                            height: '33px',
                            width: '350px',
                            'font-size': '17px',
                          }}
                        >
                          {groupname}
                        </Button>
                      </li>
                    </ul>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div
            className="mygroups-right"
            style={{ width: '100px', display: 'flex', 'flex-direction': 'row' }}
          />
          <Select
            options={gpselectoptions}
            placeholder="GroupName"
            className="div-select"
            menuPlacement="auto"
            menuPosition="fixed"
            onChange={(e) => this.gpselectoptionshandler(e)}
          />
          <Button
            className="mygroups-default"
            onClick={(e) => this.gotogrouppage(selectedvalue, e)}
            style={{
              float: 'right',
              'background-color': '#68f7ce',
              'border-color': '#5bc5a7',
              color: 'black',
            }}
          >
            GO
          </Button>
        </div>
        {redirecttopage}
      </div>
    );
  }
}
// export default Mygroups;
export default compose(
  withApollo,
  graphql(acceptinviteMutation, { name: 'acceptinviteMutation' }),
  graphql(denyinviteMutation, { name: 'denyinviteMutation' })
  // graphql(usergroupsQuery, { name: 'usergroupsQuery' }),
  // graphql(usergroupinvitesQuery, { name: 'usergroupinvitesQuery',})
)(Mygroups);
