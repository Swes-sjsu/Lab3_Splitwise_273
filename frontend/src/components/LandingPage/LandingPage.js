/* import React, { Component } from 'react';
import '../../App.css';
import { Link } from 'react-router-dom';
import NavHeader from '../navbar/navbar';

// defining landingpage component
class landingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <NavHeader />
        <div className="panel">
          <h1>Splitwise</h1>
        </div>
        <ul className="nav navbar-nav">
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/signup">Signup</Link>
          </li>
        </ul>
      </div>
    );
  }
}
*/
import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';

class landingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout = () => {
    cookie.remove('cookie', { path: '/' });
  };

  render() {
    // if Cookie is set render Logout Button
    let navLogin = null;
    if (cookie.load('cookie')) {
      console.log('Able to read cookie');
      navLogin = (
        <ul className="nav navbar-nav navbar-right">
          <li>
            <Link to="/" onClick={this.handleLogout}>
              <span className="glyphicon glyphicon-user" />
              Logout
            </Link>
          </li>
        </ul>
      );
    } else {
      // Else display login button
      console.log('Not Able to read cookie');
      navLogin = (
        <ul className="nav navbar-nav navbar-right">
          <li>
            <Link to="/login">
              <span className="glyphicon glyphicon-log-in" /> Login
            </Link>
          </li>
        </ul>
      );
    }
    let redirectVar = null;
    if (cookie.load('cookie')) {
      redirectVar = <Redirect to="/dashboard" />;
    }
    return (
      <div>
        {redirectVar}
        <Navbar bg="primary" variant="dark">
          <Navbar.Brand href="#home">Splitwise</Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              <Button variant="dark">{navLogin}</Button>
              <Button variant="dark">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}
export default landingPage;
