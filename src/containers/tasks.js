import React, { Component } from "react";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import * as firebase from 'firebase';

export default class Tasks extends Component {

    constructor() {
        super();
        this.state = {
            tasks: null
        }
    }

    componentDidMount() {
        var user = firebase.auth().currentUser;

        if (user) {
            // User is signed in.
            // let ref = firebase.firestore().collection('users').doc('4h6PyQsb8LYYVkTuM6f0vv5xjRu2').collection('tasks');
            // let getDoc = ref.get()
            // .then(doc => {
            //     if(!doc.exists) {
            //         console.log('no such document');
            //     } else {
            //         console.log('Document data:', doc.data());
            //         this.setState({ tasks: doc.data() });
            //     }  
            // })
            // .catch(err => {
            //     console.log('Error getting document', err);
            // });
            let ref = firebase.firestore().collection('users').doc(user.uid).collection('tasks');;
            ref.get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
                });
            })
            .catch(err => {
                console.log('Error getting documents', err);
            });
        } else {
            // No user is signed in.
            this.props.history.push('/')
        }
    }

    signOut = (event) => {
        event.preventDefault();
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
        }).catch(function(error) {
            // An error happened.
        });

        this.props.history.push('/');
    }

    render() {
        return (
            <Container>
                {/* {this.state.tasks ? [...this.state.tasks].map((task) => 
                <div>
                    <p>{task.name}</p>
                    <p>{task.time}</p>
                </div>
                ) : null } */}
                <br></br>
                <Button onClick={this.signOut}>Sign Out</Button>
            </Container>
        );
    }
}
