import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    navigate('/login');
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <Navbar.Brand as={Link} to="/">NITK Sports</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {user ? (
                <>
                  <Nav.Link as={Link} to="/equipment">Equipment</Nav.Link>
                  <Nav.Link as={Link} to="/infrastructure">Infrastructure</Nav.Link>
                  <Nav.Link as={Link} to="/bookings">My Bookings</Nav.Link>
                  <NavDropdown title={user.name} id="username">
                    <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                    {user.role === 'admin' && (
                      <NavDropdown.Item as={Link} to="/admin">Admin Dashboard</NavDropdown.Item>
                    )}
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login">
                    <i className="fas fa-user"></i> Sign In
                  </Nav.Link>
                  <Nav.Link as={Link} to="/register">
                    <i className="fas fa-user-plus"></i> Register
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header; 