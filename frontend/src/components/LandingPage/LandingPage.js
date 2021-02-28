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

class landingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    // this.handleLogout = this.handleLogout.bind(this);
  }

  render() {
    return (
      <div>
        <Navbar bg="primary" variant="dark">
          <Navbar.Brand href="#home">Splitwise</Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              <Button variant="dark">
                <Link to="/login">Login</Link>
              </Button>
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
