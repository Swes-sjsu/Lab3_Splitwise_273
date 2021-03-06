import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

function NavHeader() {
  return (
    <body>
      <Navbar bg="primary" variant="dark">
        <Navbar.Brand href="#home">Navbar</Navbar.Brand>
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
    </body>
  );
}

export default NavHeader;
