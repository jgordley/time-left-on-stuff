import React, { Component } from "react";
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { LinkContainer } from "react-router-bootstrap"
import * as firebase from 'firebase';
import RiseLoader from "react-spinners/ClipLoader";

export default class Home extends Component {

  constructor() {
    super();
    this.state = {
      emailInput: null,
      passwordInput: null,
      loginOrSignup: true,
      isLoading: false
    }
  }

  signIn = (event) => {
    event.preventDefault();
    this.setState({
      isLoading: true
    });
    let self = this;
    // Sign into Firebase using popup auth & Google as the identity provider.
    firebase.auth().signInWithEmailAndPassword(this.state.emailInput, this.state.passwordInput).then(function () {
      console.log('signed in!');
      self.setState({
        isLoading: true
      });
      self.props.history.push('/tasks');
    }).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorCode, errorMessage);
    });
  }

  signOut() {
    // Sign out of Firebase.
    firebase.auth().signOut();
    alert("Signed out!");
  }

  handleChange = (event) => {
    this.setState({ [event.target.id]: event.target.value });
  }
  handleSignupChange = (event) => {
    this.setState({
      loginOrSignup: false
    });
  }

  renderLogin() {
    return (
      <Form onSubmit={this.signIn} style={{ maxWidth: '300px' }}>
        <Form.Group>
          <Form.Label>Email address</Form.Label>
          <Form.Control id="emailInput" onChange={this.handleChange} type="email" placeholder="Enter email" />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control id="passwordInput" onChange={this.handleChange} type="password" placeholder="Password" />
        </Form.Group>
        <Button variant="primary" type="submit">
          {!this.state.isLoading ?
            'Log In' :
            <RiseLoader
              color={"white"}
            />}
        </Button>
      </Form>
    );
  }

  render() {
    return (
      <Container>
        <h2 style={{ paddingTop: '100px' }}>Login</h2>
        <hr></hr>
        {this.state.loginOrSignup ? this.renderLogin() : null}
        <br></br>
        <p>or <LinkContainer to="/signup"><a href="index.html">sign up</a></LinkContainer></p>
      </Container>
    );
  }
}
