import React, { Component } from "react";
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import * as firebase from 'firebase';
import RiseLoader from "react-spinners/ClipLoader";

export default class SignUp extends Component {

    constructor() {
        super();
        this.state = {
            emailInput: null,
            passwordInput: null,
            isLoading: false
        }
    }

    signUp = (event) => {
        event.preventDefault();
        let self = this;
        this.setState({
            isLoading: true
        });
        firebase.auth().createUserWithEmailAndPassword(this.state.emailInput, this.state.passwordInput).then(function () {
            // Signup successful.
            var user = firebase.auth().currentUser;
            let data = {
                isActive: false,
                name: 'Create my first task!',
                time: 60,
                timeRemaining: 60,
                finished: false,
                color: '#ff7675'
            };
            self.setState({
                isLoading: false
            });
            firebase.firestore().collection('users').doc(user.uid).collection('tasks').add(data);
            self.props.history.push('/tasks');
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });
    }

    handleChange = (event) => {
        this.setState({ [event.target.id]: event.target.value });
    }

    render() {
        return (
            <Container>
                <h2 style={{ paddingTop: '100px' }}>Sign Up</h2>
                <hr></hr>
                <Form onSubmit={this.signUp} style={{ maxWidth: '300px' }}>
                    <Form.Group>
                        <Form.Label>Email address</Form.Label>
                        <Form.Control id="emailInput" onChange={this.handleChange} type="email" placeholder="Enter email" />
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control id="passwordInput" onChange={this.handleChange} type="password" placeholder="Password" />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        {!this.state.isLoading ? 
                        'Submit' :
                        <RiseLoader
                            color={"white"}
                        />}
                    </Button>
                </Form>
            </Container>
        );
    }
}
