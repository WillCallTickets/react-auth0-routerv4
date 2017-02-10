import React, { Component, PropTypes } from 'react';
// import { connect } from 'react-redux';
import Auth0Service from '../services/Auth0Service';
// import setProfile from '../actions/auth_actions';

// export function _baseContainer(WrappedComponent, requiresAuth = false, roles = []) {
export function _baseContainer(WrappedComponent) {
  
  class _baseContainer extends Component {
    
    static contextTypes = {
      router: PropTypes.object,
      store: PropTypes.object
    }
    
    constructor(props, context){
      super(props, context);
  
      // console.log('base CTX', context);
      // console.log('base PROPS', props);
  
      this.state = {
        auth0: new Auth0Service(this.context.router, this.context.store),
        profile: null
      };
    }
    
    
    componentWillMount() {
      
      // TODO add handler for not in role - delegate to router?
      // roles presuppose that auth is required
      // todo
      // else if (requiresAuth && this.state.auth0.isLoggedIn() && )
      // redirect to 'access denied' page
      
      // console.log('comp will mount', this.props)
      // this.profileSubscription = this.state.auth0.subscribeToProfile((profile) => {
      //   // console.log('Subscribing to profile- base', WrappedComponent)
      //   this.setState({profile});
      //
      //   // this.updateTheP(profile);
      // });
    }
    
    componentWillUnmount() {
      // this.profileSubscription.close();
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
    
    // updateTheP = (profile) => {
    //   console.log('the p')
    // }
    
    // fires when we update via edit profile/submit
    // onUpdateProfile = (newProfile) => {
    //   console.log('Base on Update')
    //
    //   return this.state.auth0.updateProfile(this.state.profile.user_id, newProfile);
    // }
  };
  
  _baseContainer.PropTypes = {
    auth0: PropTypes.object,
    profile: PropTypes.object
    //,    onUpdateProfile: PropTypes.func
  };
  

  
  return _baseContainer;
  
}
