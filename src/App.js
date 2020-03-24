import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap"
import Routes from "./Routes";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';

import './App.css';

class App extends Component {
  render() {
      const childProps = {
        isAuthenticated: true
      };

      return (
        <Container>
          <Navbar bg="light" expand="lg" className="rounded" style={{marginTop:"25px"}}>
            <LinkContainer to="/">
              <Navbar.Brand href="/">Time Left on Stuff<span role="img" aria-label="emoji">&#127804;</span></Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <LinkContainer to="/">
                  <Nav.Link>Home</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/about">
                  <Nav.Link>About</Nav.Link>
                </LinkContainer>
                </Nav>
            </Navbar.Collapse>
          </Navbar>
          <Routes childProps={childProps} />
          <link href="https://fonts.googleapis.com/css?family=Comfortaa&display=swap" rel="stylesheet"></link>
          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
            integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
            crossOrigin="anonymous"
          />
        </Container>
      );
    }
}
export default withRouter(App);
