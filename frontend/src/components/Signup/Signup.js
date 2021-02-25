import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

//Define a Signup Component
class Signup extends Component{
   //call the constructor method
   constructor(props){
    //Call the constrictor of Super class i.e The Component
    super(props);
    //maintain the state required for this component
    this.state = {
        username : "",
        email : "",
        password : ""
    }
    //Bind the handlers to this class
    this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
    this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
}
//Call the Will Mount to set the auth Flag to false
componentWillMount(){
    this.setState({
        authFlag : false
    })
}
//username change handler to update state variable with the text entered by the user
// eslint-disable-next-line no-undef
usernameChangeHandler = (e) => {
    this.setState({
        username : e.target.value
    })
}
// eslint-disable-next-line no-undef
emailChangeHandler = (e) => {
    this.setState({
        email : e.target.value
    })
}
//password change handler to update state variable with the text entered by the user
// eslint-disable-next-line no-undef
passwordChangeHandler = (e) => {
    this.setState({
        password : e.target.value
    })
}
//submit Login handler to send a request to the node backend
// eslint-disable-next-line no-undef
submitLogin = (e) => {
    var headers = new Headers();
    //prevent page from refresh
    e.preventDefault();
    const data = {
        username : this.state.username,
        email : this.state.email,
        password : this.state.password
    }
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.post('http://localhost:3001/login',data)
        .then(response => {
            console.log("Status Code : ",response.status);
            if(response.status === 200){
                this.setState({
                    authFlag : true
                })
            }else{
                this.setState({
                    authFlag : false
                })
            }
        });
}

    render(){
        
        return(
            <div>
            <div class="container">
                
                <div class="login-form">
                    <div class="main-div">
                        <div class="panel">
                            <h2>Signup</h2>
                            <p>Please enter your name , email and password</p>
                        </div>
                        <div class="form-group">
                                <input type="text" class="form-control" name="username" placeholder="Username"/>
                            </div>
                            <div class="form-group">
                                <input type="text" class="form-control" name="email" placeholder="Email Address"/>
                            </div>
                            <div class="form-group">
                                <input type="password" class="form-control" name="password" placeholder="Password"/>
                            </div>
                            <button onClick ={this.submitLogin} class="btn btn-primary">Sign Up</button>                 
                    </div>
                </div>
            </div>
            </div>
        )
    }
}
//export Signup Component
export default Signup;