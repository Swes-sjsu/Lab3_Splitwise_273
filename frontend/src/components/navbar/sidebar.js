import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';
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
            <ul className="nav">
              <li className="nav-item">
                <li className="nav-item">
                  <NavLink className="nav-link" to="/dashboard" />
                </li>
                <NavLink className="nav-link" to="/dashboard">
                  <p>Dashboard</p>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/recent_activity">
                  <p>Recent Acitivity</p>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/mygroups">
                  <p>My Groups</p>
                </NavLink>
              </li>
              <Dropdown>
                <Dropdown.Toggle
                  split
                  variant="primary"
                  id="dropdown-custom-2"
                />
                <Dropdown.Menu>
                  <Dropdown.Item>
                    <Link to="/createnewgroup">+ Add group</Link>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <li className="nav-item">
                <NavLink className="nav-link" to="/profile">
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
