import React, { Component } from 'react';
// import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import Login from './login/Login';
import Signup from './signup/Signup';
import LandingPage from './landingPage/LandingPage';
import Dashboard from './dashboard/dashboard';
import Createnewgroup from './create_new_group/create_new_group';
import Profilepage from './profilepage/profile_page';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/createnewgroup" component={Createnewgroup} />
          <Route path="/profile" component={Profilepage} />
        </Switch>
      </div>
    );
  }
}
// Export The Main Component
export default Main;
