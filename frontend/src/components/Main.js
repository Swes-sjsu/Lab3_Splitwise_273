import React, { Component } from 'react';
// import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import login from './login/Login';
import signup from './signup/Signup';
import landingPage from './landingPage/LandingPage';
// Create a Main Component
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Router>
          <Route path="/" component={landingPage} />
          <Route path="/signup" component={signup} />
          <Route path="/login" component={login} />
        </Router>
      </div>
    );
  }
}
// Export The Main Component
export default Main;
