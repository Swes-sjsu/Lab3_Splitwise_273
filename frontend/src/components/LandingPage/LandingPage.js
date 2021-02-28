import React, { Component } from 'react';
import '../../App.css';
// import cookie from 'react-cookies';
import { Link } from 'react-router-dom';
// import {Redirect} from 'react-router';

// defining landingpage component
class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
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

export default LandingPage;
