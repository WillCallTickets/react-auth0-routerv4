import React, { Component } from 'react';
import { _baseContainer } from './_baseContainer';

class Login extends Component {
  
  static propTypes = {
    ..._baseContainer.PropTypes
  }
  
  componentWillMount() {
    // console.log('LOGIN MOUNTING', this.props.auth0.getNextPath())
    // console.log('LOGIN STATE', this.state);
    this.props.auth0.login();
  }
  
  componentWillUnmount() {
    // console.log('LOGIN UNMOUNT', this.props.auth0.getNextPath());
    this.props.auth0.lock.hide();
  }
  
  login = (e) => {
    e.preventDefault();
    // console.log('LOG   CTX', this.context)
    // console.log('LOG PROPS', this.props)
    this.props.auth0.login();
  }
  
  render() {
    // console.log('LOGIN   CTX', this.context)
    // console.log('LOGIN PROPS', this.props)
    
    return (
      <div className="Login">
        <a className="Login-loginButton" onClick={(e) => this.login(e)}>Login with Auth0</a>
      </div>
    );
  }
}

export default _baseContainer(Login);
