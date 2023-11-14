// components/NavBar.js
import React from 'react';
import { Navbar } from 'react-bootstrap';

const NavBar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href="#home">Edit Names</Navbar.Brand>
    </Navbar>
  );
};

export default NavBar;
