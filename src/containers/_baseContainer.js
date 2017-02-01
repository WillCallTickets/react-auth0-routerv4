import React, { Component, PropTypes } from 'react';
import Auth0Service from '../services/Auth0Service';

// export function _baseContainer(WrappedComponent, requiresAuth = false, roles = []) {
export function _baseContainer(WrappedComponent) {
  
  return class _baseContainer extends Component {
    static contextTypes = {
      router: PropTypes.object
    }
    
    // constructor(props, context) {
    //   super(props);
      state = {
        auth0: new Auth0Service(this.context.router),
        profile: null
      };
    // }
    
    componentWillMount() {
      
      // TODO add handler for not in role - delegate to router?
      // roles presuppose that auth is required
      // todo
      // else if (requiresAuth && this.state.auth0.isLoggedIn() && )
      // redirect to 'access denied' page
      
      console.log('comp will mount')
      this.profileSubscription = this.state.auth0.subscribeToProfile((profile) => {
        this.setState({profile});
      });
    }
    
    componentWillUnmount() {
      this.profileSubscription.close();
    }
    
    render() {
      // console.log('CTX', context);
      // console.log('PROPS', props);
  
      return (
        <WrappedComponent
          {...this.props}
          auth0={this.state.auth0}
          profile={this.state.profile}
          onUpdateProfile={this.onUpdateProfile}
        />
      );
    }
    
    onUpdateProfile = (newProfile) => {
      return this.state.auth0.updateProfile(this.state.profile.user_id, newProfile);
    }
  };
}

_baseContainer.PropTypes = {
  auth0: PropTypes.object,
  profile: PropTypes.object,
  onUpdateProfile: PropTypes.func
};



