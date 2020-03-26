import React, { Component } from "react";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import "react-step-progress-bar/styles.css";
import { ProgressBar } from "react-step-progress-bar";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FaPlay, FaPause, FaTimesCircle, FaRedo } from 'react-icons/fa';
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
            stopTasks: false,
            removeTasks: false,
            color: '#ff7675',
            colors: ['#ff7675', '#fdcb6e', '#55efc4', '#74b9ff','#a29bfe','#2d3436']
        }
    }

    toggleClicked = (event) => {
        console.log(event.target.id);
    }

    handleChange = (event) => {
        this.setState({ [event.target.id]: event.target.value });
    }

    updateActive = (taskToActivate, taskActiveStatus) => {
        var user = firebase.auth().currentUser;
        if(this.state[taskToActivate].finished) {
            let data = {
                isActive: false,
                finished: false,
                timeRemaining: this.state[taskToActivate].time
            };
            firebase.firestore().collection('users').doc(user.uid).collection('tasks').doc(taskToActivate).update(data);
        } else {
            let data = {
                isActive: !taskActiveStatus
            };
            this.syncTimesForActives();
            //TODO: CATCH ERRORS FOR THIS UPLOAD
            firebase.firestore().collection('users').doc(user.uid).collection('tasks').doc(taskToActivate).update(data);
        }
    }

    syncTimesForActives() {
        var user = firebase.auth().currentUser;
        for(let i=0; i<this.state.tasks.length;i++) {
            let id = this.state.tasks[i].id;
            let task = this.state[id];
            if(task.isActive) {
                firebase.firestore().collection('users').doc(user.uid).collection('tasks').doc(id).update(this.state[id]); 
            }
        }
    }

    toggleRemoveTasks = () => {
        this.setState({
            removeTasks: !this.state.removeTasks
        })
    }

    updateActiveTimers = () => {
        for(let i=0; i<this.state.tasks.length;i++) {
            let id = this.state.tasks[i].id;
            let task = this.state[id];
            let newTimeRemaining = task.timeRemaining-1;

            if(task.isActive) {
                let decrementedTask = {
                    timeRemaining: newTimeRemaining,
                    name: task.name,
                    color: task.color,
                    isActive: task.isActive,
                    time: task.time, 
                    finished: task.finished
                }
                this.setState({
                    [id]: decrementedTask
                });
            }

            if(task.timeRemaining<0) {
                alert('Times up for ' + task.name);
                let finishedTask = {
                    timeRemaining: 0,
                    name: task.name,
                    color: task.color,
                    isActive: false,
                    time: task.time,
                    finished: true
                }
                this.setState({
                    [id]: finishedTask
                })
                var user = firebase.auth().currentUser;
                firebase.firestore().collection('users').doc(user.uid).collection('tasks').doc(id).update(finishedTask);
                
            }
        }
    }

    colorChange = (event) => {
        if(event.target.checked) {
            this.setState({
                color: event.target.id
            })
        }
    }

    createNewTask = (event) => {
        this.syncTimesForActives();
        console.log("creating new task");
        event.preventDefault();
        let data = {
            isActive: false,
            name: this.state.taskName,
            time: this.state.taskTime*60,
            timeRemaining: this.state.taskTime*60,
            color: this.state.color,
            finished: false
        };
        var user = firebase.auth().currentUser;
        // TODO: CATCH ERRORS FOR THIS UPLOAD
        firebase.firestore().collection('users').doc(user.uid).collection('tasks').add(data)        
        console.log('Task added');
        this.setState({show: false});
    }

    removeTask = (id) => {
        //event.preventDefault();
        this.syncTimesForActives();
        console.log('Removing task: ' + this.state[id].name);
        var user = firebase.auth().currentUser;
        firebase.firestore().collection('users').doc(user.uid).collection('tasks').doc(id).delete();
    }

    verifyCreateNewTask = () => {
        //TODO MAKE SURE THAT INPUT IS GOOD TO CREATE TASK
        return this.state.taskName && this.state.color && this.state.taskTime && Number.isInteger(this.state.taskTime);
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

    formatTime(seconds) {
        let secondsLeft = seconds%60;
        let minutesLeft = (seconds-secondsLeft)/(60);
        let formatMinutes = minutesLeft%60;
        let hoursLeft = (minutesLeft-formatMinutes)/60;
        let formatString = ''
        if(hoursLeft>0) {
            formatString+=String(hoursLeft)+':';
            if(formatMinutes<10) {
                formatString+='0'+String(formatMinutes)
                if(secondsLeft === 0) {
                    formatString += ':00';
                } else {
                    formatString += ':'+String(secondsLeft);
                }
            } else {
                formatString+=String(formatMinutes);
                if(secondsLeft === 0) {
                    formatString += ':00';
                } else {
                    formatString += ':'+String(secondsLeft);
                }
            }
        } else {
            if(secondsLeft === 0) {
                formatString += String(formatMinutes)+':00';
            } else {
                formatString += String(formatMinutes)+':'+String(secondsLeft);
            }
        }

        
        
        return formatString;
    } 



    render() {
        return (
            <Container style={{textAlign:'center'}}>
                <h1 style={{margin: '20px'}}>Your Tasks</h1>
                <Row style={{ marginLeft: '50px', marginRight:'50px', marginBottom: '15px'}}>
                    {this.state.tasks ? this.state.tasks.map((task, idx) =>
                        <ListGroup horizontal key={task.id} style={{ margin: 'auto', marginBottom:'25px'}}>
                            <ListGroup.Item action onClick={() => this.updateActive(task.id, task.isActive, idx)} variant="primary" style={{ width: '50px' }}>
                                {task.finished ? 
                                 <FaRedo /> : task.isActive ? <FaPause /> : <FaPlay />}
                            </ListGroup.Item>
                            <ListGroup.Item style={{ width: '200px' }}>{task.name}</ListGroup.Item>
                            <ListGroup.Item style={{ width: '100px' }}>{this.formatTime(this.state[task.id].timeRemaining)}</ListGroup.Item>
                            <ListGroup.Item style={{ width: '400px' }}>
                                <ProgressBar
                                    percent={this.state[task.id].timeRemaining/task.time*100}
                                    // filledBackground={"linear-gradient(to right, white, " + task.color + ")"}
                                    filledBackground={task.color}
                                    style={{margin: 'auto'}}
                                />
                            </ListGroup.Item>
                            <ListGroup.Item style={{ width: '100px' }}>{this.formatTime(this.state[task.id].time)}</ListGroup.Item>
                            {this.state.removeTasks ? 
                                <ListGroup.Item action id={task.id} onClick={() => this.removeTask(task.id)} variant="danger" style={{ width: '50px' }}>
                                    <FaTimesCircle />
                                </ListGroup.Item> : null }
                        </ListGroup>
                    ) : null}
                </Row>
                <br></br>
                <Row style={{marginBottom: '30px'}}>
                    <Col md={6} className="text-center">
                        <Button variant="primary"onClick={this.toggleModal}>
                            Add Task
                        </Button>
                    </Col>
                    <Col md={6} className="text-center">
                        <Button variant="danger" onClick={this.toggleRemoveTasks}>
                            Remove Task
                        </Button>
                    </Col>
                </Row>
                

                <Modal show={this.state.show} onHide={this.toggleModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Task</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.createNewTask}>
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
                                <br></br>
                                {this.state.colors.map((color) =>
                                        <Form.Check 
                                            name="radio-form"
                                            type="radio"
                                            onChange={this.colorChange}
                                            id={color}
                                            key={color}
                                            style={{backgroundColor:color, padding:'25px', margin:'3px'}}
                                            inline
                                        />
                                )}
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
                <Button variant="secondary" onClick={this.signOut}>Sign Out</Button>
            </Container>
        );
    }
}
