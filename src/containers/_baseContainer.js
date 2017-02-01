import React, { Component, PropTypes } from 'react';
import Auth0Service from '../services/Auth0Service';

// export function _baseContainer(WrappedComponent, requiresAuth = false, roles = []) {
export function _baseContainer(WrappedComponent) {
  
  return class _baseContainer extends Component {
    static contextTypes = {
      router: PropTypes.object
    }
    
    // static propTypes = {
    //   location: PropTypes.object
    // }
    
    constructor(props, context) {
      // console.log('CTX', context);
      // console.log('PROPS', props);
      // console.log('NEEDS AUTH', requiresAuth);
      
      super(props);
      
      // if(requiresAuth) {
      //   console.log('This component requires auth')
      // } else {
      //   console.log('This component does not require auth')
      // }
      
      this.state = {
        auth0: new Auth0Service(context.router),
        profile: null
      };
    }
    
    // componentWillMount() {
      // if(requiresAuth && !this.state.auth0.isLoggedIn()){
      //   console.log('This component requires auth - redirecting to login...')
      //   //this.state.auth0.setNextPath(this.props.pathname);
      //   this.context.router.transitionTo(LOGIN_ROUTE);
      // }
  
      // TODO add handler for not in role
      // roles presuppose that auth is required
      // todo
      // else if (requiresAuth && this.state.auth0.isLoggedIn() && )
      // redirect to 'access denied' page
      
      
      // this.profileSubscription = subscribeToProfile((profile) => {
      //   this.setState({profile});
      // });
    // }
    
    // componentWillUnmount() {
    //   //this.profileSubscription.close();
    // }
    
    render() {
      return (
        <WrappedComponent
          {...this.props}
          auth0={this.state.auth0}
          profile={this.state.profile}
          
        />
      
      );
    }
    
    // ^^^ onUpdateProfile={this.onUpdateProfile}
    
    // onUpdateProfile = (newProfile) => {
    //   return updateProfile(this.state.profile.user_id, newProfile);
    // }
  };
  
}

_baseContainer.PropTypes = {
  auth0: PropTypes.object,
  profile: PropTypes.object,
  // onUpdateProfile: PropTypes.func
};

