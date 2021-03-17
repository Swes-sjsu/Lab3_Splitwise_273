import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import cookie from 'react-cookies';
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
import { isEmpty } from 'lodash';
// import { Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import Navheader from '../navbar/navbar';
import Sidebarcomp from '../navbar/sidebar';
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

  showHandler = () => {
    this.setState({ popup: true });
  };

  closeHandler = () => {
    this.setState({ popup: false });
  };

  getuserpgroups = (userid) => {
    axios
      .get(`http://localhost:3001/getuserpgroups/${userid}`, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .then((response) => {
        console.log(response.data);
        console.log(typeof response.data);
        const newaar = response.data.map((el) => el.gpname);
        console.log(newaar);
        const { data } = response;
        const arrayforselect = data.map((el) => ({
          value: el.gpname,
          label: el.gpname,
        }));
        console.log(arrayforselect);
        this.setState({
          groupslist: newaar,
          gpselectoptions: arrayforselect,
        });
      })
      .catch((err) => console.log(err));
  };

  getpgroupinvites = (userid) => {
    axios
      .get(`http://localhost:3001/getpgroupinvites/${userid}`, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .then((response) => {
        console.log(response.data);
        console.log(typeof response.data);
        const newaar = response.data.map((el) => el.gpname);
        console.log(newaar);
        this.setState({
          invitelist: newaar,
        });
      })
      .catch((err) => console.log(err));
  };

  acceptinvitation = (groupname, e) => {
    e.preventDefault();
    console.log(e.target.value);
    this.setState({ popup: false });
    const { popup, userid, useremail } = this.state;
    const currentgrp = groupname;
    const data = {
      currentgrp,
      userid,
      useremail,
    };
    console.log(data, popup);
    axios
      .post('http://localhost:3001/acceptinvitation', data)
      .then((response) => {
        console.log('Status Code : ', response.status);
        console.log('response ', response.data);
        if (response.status === 200) {
          console.log(response.data);
          this.getuserpgroups(userid);
          this.getpgroupinvites(userid);
        } else {
          console.log(response.data);
          alert(response.data);
        }
      })
      .catch((err) => {
        console.log(err.response.data);
        alert(err.response.data);
      });
  };

  denyinvitation = (groupname, e) => {
    e.preventDefault();
    console.log(e.target.value);
    this.setState({ popup: false });
    const { popup, userid, useremail } = this.state;
    const currentgrp = groupname;
    const data = {
      currentgrp,
      userid,
      useremail,
    };
    console.log(data, popup);
    axios
      .post('http://localhost:3001/denyinvitation', data)
      .then((response) => {
        console.log('Status Code : ', response.status);
        console.log('response ', response.data);
        if (response.status === 200) {
          console.log(response.data);
          this.getuserpgroups(userid);
          this.getpgroupinvites(userid);
        } else {
          console.log(response.data);
          alert(response.data);
        }
      })
      .catch((err) => {
        console.log(err.response.data);
        alert(err.response.data);
      });
  };

  gotogrouppage = (groupname, e) => {
    e.preventDefault();
    sessionStorage.setItem('groupname', groupname);
    const redirectVar1 = <Redirect to="/group" />;
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
    const { invitelist } = this.state;
    const { popup, selectedvalue } = this.state;

    console.log(groupslist, invitelist, selectedvalue);
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
          <div>
            <Sidebarcomp />
          </div>

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
                <div className="title">Invitation pending List</div>
              </div>
              <div>
                {checkifinvitesnull ? (
                  <h2>No Invites Pending!</h2>
                ) : (
                  <div>
                    {' '}
                    {invitelist.map((groupname) => (
                      <ul className="mygroups-button">
                        <li>
                          <Button
                            className="myinvites-default"
                            onClick={this.showHandler}
                          >
                            {groupname}
                          </Button>

                          <Modal show={popup} onHide={this.closeHandler}>
                            <Modal.Header closeButton>
                              <Modal.Title>Group Invitation</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              Do you wish to accept the invitaion to join the
                              group or reject the invitation?
                            </Modal.Body>
                            <Modal.Footer>
                              <Button
                                className="login-default"
                                onClick={(e) =>
                                  this.acceptinvitation(groupname, e)
                                }
                              >
                                √ Accept
                              </Button>
                              <Button
                                className="Signup-default"
                                onClick={(e) =>
                                  this.denyinvitation(groupname, e)
                                }
                              >
                                x Reject
                              </Button>
                            </Modal.Footer>
                          </Modal>
                        </li>
                      </ul>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section className="mygroups-center-sec">
              <div className="mygroups-center-section-block">
                <div className="title">My Groups List</div>
              </div>
              {checkifgroupsnull ? (
                <h2>No groups to display!</h2>
              ) : (
                <div>
                  {' '}
                  {groupslist.map((groupname) => (
                    <ul className="mygroups-button">
                      <li>
                        <Button
                          className="mygroups-default"
                          onClick={(e) => this.gotogrouppage(groupname, e)}
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

          <div className="mygroups-right" style={{ width: '100px' }} />
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
          >
            GO
          </Button>
        </div>
        {redirecttopage}
      </div>
    );
  }
}
export default Mygroups;
