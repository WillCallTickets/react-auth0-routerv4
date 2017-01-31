import React, { Component } from 'react';
import { Link, Match } from 'react-router';

import { _baseContainer } from './_baseContainer';
import Home from './Home';
import Login from './Login';
import EditProfile from './EditProfile';


class App extends Component {
  
  // constructor(props, context) {
  //   super(props, context);
  //   // console.log('APP   CTX', this.context)
  //   // console.log('APP PROPS', this.props)
  // }
  
  logout = (e) => {
    e.preventDefault();
    this.props.auth0.logout();
  }
  
  render () {
    return (
      <div className="ui container">
        <div className="ui six item menu">
          <Link className="item" activeClassName="active" activeOnlyWhenExact to="/">Home</Link>
          <Link className="item" activeClassName="active" activeOnlyWhenExact to="/games">Games</Link>
          <Link className="item" activeClassName="active" activeOnlyWhenExact to="/games/new">Add New Game</Link>
          <Link className="item" activeClassName="active" activeOnlyWhenExact to="/login">Login</Link>
          <Link className="item" activeClassName="active" activeOnlyWhenExact to="/profile/edit">Profile</Link>
          <a className="item" onClick={(e) => this.logout(e)}>Log Out</a>
        </div>
    
        <Match exactly pattern="/" component={Home}/>
        <Match pattern="/login" component={Login}/>
        <Match pattern="/profile/edit" component={EditProfile}/>
      </div>
    );
  }
}

export default _baseContainer(App);
