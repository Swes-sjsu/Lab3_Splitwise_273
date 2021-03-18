import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import './navbar.css';

class Sidebarcomp extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="sidebar">
        <Nav className="flex-column">
          <div className="sidebar-wrapper">
            <ul className="navlist">
              <li className="nav-item">
                <li className="nav-item1">
                  <NavLink className="nav-link1" to="/dashboard" />
                </li>
                <NavLink className="nav-link1" to="/dashboard">
                  <p>Dashboard</p>
                </NavLink>
              </li>
              <li className="nav-item1">
                <NavLink className="nav-link1" to="/recentactivity">
                  <p>Recent Acitivity</p>
                </NavLink>
              </li>
              <li className="nav-item1">
                <NavLink className="nav-link1" to="/mygroups">
                  <p> My Groups</p>
                </NavLink>
              </li>
              <li>
                <NavLink to="/createnewgroup" className="nav-link2">
                  <p> + Add </p>
                </NavLink>
              </li>
              <li className="nav-item1">
                <NavLink className="nav-link1" to="/profile">
                  <p>My Profile</p>
                </NavLink>
              </li>
            </ul>
          </div>
        </Nav>
      </div>
    );
  }
}

export default Sidebarcomp;
