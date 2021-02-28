import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Login from './login/Login';
import Signup from './signup/Signup';
// import Delete from './Delete/Delete';
// import Create from './Create/Create';
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
        {/* Render Different Component based on Route */}
        <Route path="/" component={landingPage} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
      </div>
    );
  }
}
// Export The Main Component
export default Main;
