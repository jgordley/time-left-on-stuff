import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap"
import Routes from "./Routes";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import * as firebase from 'firebase';
import './App.css';

var config = {
  apiKey: "AIzaSyCPStqxcPsPyizC8PUUiyv66Uz99Djj3gM",
  authDomain: "time-left-on-stuff.firebaseapp.com",
  databaseURL: "https://time-left-on-stuff.firebaseio.com",
  projectId: "time-left-on-stuff",
  storageBucket: "time-left-on-stuff.appspot.com",
  messagingSenderId: "984522414547",
  appId: "1:984522414547:web:4e56214eda18163e7ff726",
  measurementId: "G-SG97NW5LBM"
};
firebase.initializeApp(config);

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
                <LinkContainer to="/tasks">
                  <Nav.Link>Tasks</Nav.Link>
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
