import React, { Component } from 'react';
import Navheader from '../navbar/navbar';

class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Navheader />
        <p>This is landing LandingPage</p>
      </div>
    );
  }
}

export default LandingPage;
