import React, { Component } from "react";
import * as firebase from 'firebase';

export default class About extends Component {

    componentDidMount() {
        var user = firebase.auth().currentUser;

        if (user) {
          // User is signed in.
          console.log(user);
        } else {
          // No user is signed in.
          console.log("Not signed in");
        }
    }

    render() {
        return (
            <div>
              <p>About us</p>
            </div>
        );
    }
}
