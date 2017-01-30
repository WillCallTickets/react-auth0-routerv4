import React, { Component } from 'react';
import { _baseContainer } from './_baseContainer';

class Login extends Component {
  
  // static propTypes = {
  //   ..._baseContainer.PropTypes
  // }
  //
  // constructor(props, context) {
  //   super(props, context);
  // //   console.log('LOGIN   CTX', this.context)
  // //   console.log('LOGIN PROPS', this.props)
  //   this.state = {
  //     loginWidget: null
  //   }
  // }
  
  componentWillMount() {
    this.props.auth0.login();
  }
  
  componentWillUnmount() {
    console.log('LOGIN UNMOUNT', this.props);
    this.props.auth0.lock.hide();
    // todo is this necessary?
    // this.props.auth0.login = null;
  }
  
  login = (e) => {
    e.preventDefault();
    console.log('HOME   CTX', this.context)
    console.log('HOME PROPS', this.props)
    this.props.auth0.login();
  }
  
  render() {
    return (
      <div className="Login">
        <a className="Login-loginButton" onClick={(e) => this.login(e)}>Login with Auth0</a>
      </div>
    );
  }
}

// Login.contextTypes = {
//   router: React.PropTypes.object
// }

// const mapStateToProps = (state, ownProps) => {
//   console.log('MAPPER 1', state);
//   console.log('MAPPER 2', ownProps);
// }

export default _baseContainer(Login);
