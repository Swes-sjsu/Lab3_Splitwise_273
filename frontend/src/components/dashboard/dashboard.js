// import React from 'react';
import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
// import cookie from 'react-cookies';
// import { Redirect } from 'react-router';
import landingPage from '../landingPage/LandingPage';

class dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <landingPage />
        <Button variant="dark">
          <Link to="/createnewgroup"> + Create new group </Link>
        </Button>
      </div>
    );
  }
}

export default dashboard;
