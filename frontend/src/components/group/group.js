import React, { Component } from 'react';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Sidebarcomp from '../navbar/sidebar';
import Navheader from '../navbar/navbar';
// import { Row, Col, Container, Jumbotron } from 'react-bootstrap';
import '../navbar/navbar.css';
import '../dashboard/dashboard.css';
import './group.css';

class Groupdetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const grpname1 = sessionStorage.getItem('groupname');
    this.setState({
      grpname: grpname1,
    });
  }

  render() {
    let redirectVar = null;
    if (!cookie.load('cookie')) {
      redirectVar = <Redirect to="/" />;
    }
    const { grpname } = this.state;
    return (
      <div>
        {redirectVar}
        <Navheader />
        <div className="grouppage-flex">
          <div>
            <Sidebarcomp />
          </div>
        </div>
        <div className="grouppage-box">
          <section className="grouppage-heading-buttons">
            <section className="grouppage-heading">
              <h1>Group Name {grpname}</h1>

              <ul className="grouppage-button">
                <li>
                  <Button className="login-default">
                    <Link to="/addbill">Add Expense</Link>
                  </Button>{' '}
                  <Button className="Signup-default">
                    <Link to="/signup">Leave Group</Link>
                  </Button>
                </li>
              </ul>
            </section>

            <section className="grouppage-center-sec">
              <div className="grouppage-center-section-block">
                <div className="title">Payments Made</div>
              </div>

              <div className="grouppage-center-section-block">
                <div className="grouppage-block-border">
                  <div className="title">Time</div>
                </div>
              </div>
            </section>
          </section>
        </div>

        <div className="grouppage-right" />
        <div className="title">You Owe</div>
      </div>
    );
  }
}

export default Groupdetails;
