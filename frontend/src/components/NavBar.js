import React from "react";
import { Navbar, Nav } from "react-bootstrap";

const NavBar = ({ hasAdminAccess }) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href="/">Scrum Tool</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link href="/aws">AWS</Nav.Link>
          <Nav.Link href="/azure">Azure</Nav.Link>
          {/* Only show the "Edit Names" link if the user has Ns.Admin access */}
          {hasAdminAccess && <Nav.Link href="/editnames">Edit Names</Nav.Link>}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
