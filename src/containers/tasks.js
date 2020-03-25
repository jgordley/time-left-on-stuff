import React, { Component } from "react";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import "react-step-progress-bar/styles.css";
import { ProgressBar } from "react-step-progress-bar";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import * as firebase from 'firebase';

export default class Tasks extends Component {

    constructor() {
        super();

        this.repeatingTimer = null;

        this.state = {
            tasks: null,
            show: false,
            taskTime: null,
            taskName: null,
            taskColor: null,
            stopTasks: false
        }
    }

    toggleClicked = (event) => {
        console.log(event.target.id);
    }

    handleChange = (event) => {
        this.setState({ [event.target.id]: event.target.value });
    }

    updateActive = (taskToActivate, taskActiveStatus, idx) => {
        let data = {
            isActive: !taskActiveStatus
        };
        var user = firebase.auth().currentUser;
        for(let i=0; i<this.state.tasks.length;i++) {
            let id = this.state.tasks[i].id;
            let task = this.state[id];
            if(task.isActive) {
                firebase.firestore().collection('users').doc(user.uid).collection('tasks').doc(id).update(this.state[id]); 
            }
        }
        //TODO: CATCH ERRORS FOR THIS UPLOAD
        firebase.firestore().collection('users').doc(user.uid).collection('tasks').doc(taskToActivate).update(data);
    }

    updateActiveTimers = () => {
        for(let i=0; i<this.state.tasks.length;i++) {
            let id = this.state.tasks[i].id;
            let task = this.state[id];
            let newTimeRemaining = task.timeRemaining-1;

            if(task.isActive) {
                console.log(task)
                let decrementedTask = {
                    timeRemaining: newTimeRemaining,
                    name: task.name,
                    color: task.color,
                    isActive: task.isActive,
                    time: task.time
                }
                this.setState({
                    [id]: decrementedTask
                });
                console.log(this.state[id]);
            }
        }
    }

    createNewTask = (event) => {
        console.log("creating new task");
        event.preventDefault();
        let data = {
            isActive: false,
            name: this.state.taskName,
            time: this.state.taskTime*60,
            timeRemaining: this.state.taskTime*60,
            color: this.state.taskColor
        };
        var user = firebase.auth().currentUser;
        // TODO: CATCH ERRORS FOR THIS UPLOAD
        firebase.firestore().collection('users').doc(user.uid).collection('tasks').add(data)        
        console.log('Task added');
        this.setState({show: false});
    }

    verifyCreateNewTask = () => {
        //TODO MAKE SURE THAT INPUT IS GOOD TO CREATE TASK
        return this.state.taskName && this.state.taskColor && this.state.taskTime;
    }

    componentDidMount() {
        var user = firebase.auth().currentUser;
        this.repeatingTimer = setInterval(() => { 
            this.updateActiveTimers();
          }, 1000);
        if (user) {
            console.log('Current User: ' + user.email, 'User UID: ' + user.uid);
            let self = this;
            let ref = firebase.firestore().collection('users').doc(user.uid).collection('tasks');;
            ref.onSnapshot((snapshot) => {
                snapshot.forEach(doc => {
                    console.log(doc.id, '=>', doc.data());
                    self.setState({
                        [doc.id]: doc.data() //DADESRJKLEA;JDFAD;LASJF USE THE DOC ID TO SET THAT DOC PROPERTY IN THE THING
                    });
                });
                const newTasks = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }))
                self.setState({
                    tasks: newTasks
                })
                console.log(this.state.tasks);
            });
        } else {
            // No user is signed in.
            this.props.history.push('/')
        }
    }

    componentWillUnmount() {
        clearInterval(this.repeatingTimer);
    }

    toggleModal = () => {
        let currentStatus = this.state.show;
        this.setState({
            show: !currentStatus
        });
        console.log(this.state.show);
    }

    signOut = (event) => {
        event.preventDefault();
        let self = this;
        firebase.auth().signOut().then(function () {
            // Sign-out successful.
            console.log('signed out!');
            self.props.history.push('/');
        }).catch(function (error) {
            // An error happened.
            alert("Error: Could not sign out!");
        });
    }



    render() {
        return (
            <Container>
                <div style={{ margin: '50px' }}>
                    {this.state.tasks ? this.state.tasks.map((task, idx) =>
                        <ListGroup horizontal key={task.id} style={{ width: '95%' }}>
                            <ListGroup.Item action onClick={() => this.updateActive(task.id, task.isActive, idx)} variant="primary" style={{ width: '10%' }}>{task.isActive ? 'A' : 'I'}</ListGroup.Item>
                            <ListGroup.Item style={{ width: '30%' }}>{task.name}</ListGroup.Item>
                            <ListGroup.Item style={{ width: '10%' }}>{this.state[task.id].timeRemaining}</ListGroup.Item>
                            <ListGroup.Item style={{ width: '50%' }}>
                                <ProgressBar
                                    percent={this.state[task.id].timeRemaining/task.time*100}
                                    filledBackground={"linear-gradient(to right, white, " + task.color1 + ")"}
                                />
                            </ListGroup.Item>
                            <ListGroup.Item style={{ width: '10%' }}>{task.time}</ListGroup.Item>
                        </ListGroup>
                    ) : null}
                </div>
                <br></br>
                <Button variant="primary" style={{marginBottom: "40px"}} onClick={this.toggleModal}>
                    Add Task
                </Button>

                <Modal show={this.state.show} onHide={this.toggleModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Task</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.createNewTask} style={{ maxWidth: '300px' }}>
                            <Form.Group>
                                <Form.Label>Task Name</Form.Label>
                                <Form.Control id="taskName" onChange={this.handleChange} type="text" placeholder="Enter task name" />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Duration</Form.Label>
                                <Form.Control id="taskTime" onChange={this.handleChange} type="text" placeholder="Enter duration in minutes" />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Color</Form.Label>
                                <Form.Control id="taskColor" onChange={this.handleChange} type="text" placeholder="Enter color (hex or name)" />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.toggleModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.createNewTask}>
                            Save New Task
                        </Button>
                    </Modal.Footer>
                </Modal>
                <br></br>
                <Button onClick={this.signOut}>Sign Out</Button>
            </Container>
        );
    }
}
