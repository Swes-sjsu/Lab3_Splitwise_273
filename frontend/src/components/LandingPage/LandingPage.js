import React, {Component} from 'react';
import '../../App.css';
//import cookie from 'react-cookies';
import {Link} from 'react-router-dom';
//import {Redirect} from 'react-router';

//defining landingpage component
class LandingPage extends Component{
    /*constructor(props){
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }
    //handle logout to destroy the cookie
     handleLogout = () => {
        cookie.remove('cookie', { path: '/' })
    }
    render(){
        //if Cookie is set render Logout Button
        let navLogin = null;
        if(cookie.load('cookie')){
            console.log("Able to read cookie");
            navLogin = (
                <ul class="nav navbar-nav navbar-right">
                        <li><Link to="/" onClick = {this.handleLogout}><span class="glyphicon glyphicon-user"></span>Logout</Link></li>
                </ul>
            );
        }else{
            //Else display login button
            console.log("Not Able to read cookie");
            navLogin = (
                <ul class="nav navbar-nav navbar-right">
                        <li><Link to="/login"><span class="glyphicon glyphicon-log-in"></span> Login</Link></li>
                </ul>
            )
        }
        //let redirectVar = null;
        //if(cookie.load('cookie')){
          //  redirectVar = <Redirect to="/home"/>
        //}*/
        render(){
        return(
            <div>
                    <div class="panel">
                        <h1>Splitwise</h1>
                    </div>
                    <ul class="nav navbar-nav">
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/sign">Signup</Link></li>
                    </ul>
        </div>
        )
    }
}

export default LandingPage;
