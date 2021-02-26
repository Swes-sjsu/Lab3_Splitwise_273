import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Login from './Login/Login';
import Signup from './Signup/Signup';
// import Delete from './Delete/Delete';
// import Create from './Create/Create';
import LandingPage from './LandingPage/LandingPage';
// Create a Main Component
class Main extends Component {
  render() {
    return (
      <div>
        {/* Render Different Component based on Route */}
        <Route path="/" component={LandingPage} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
      </div>
    );
  }
}
// Export The Main Component
export default Main;
