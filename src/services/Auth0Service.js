//TODO move from events to redux/dispatch
import { EventEmitter } from 'events';
import { isTokenExpired } from './jwtHelper';
import Auth0Lock from 'auth0-lock';

export const ROOT_ROUTE = '/';
export const NEXT_PATH_KEY = 'next_path';
export const LOGIN_ROUTE = '/login';// this is the page to go to when in need of auth
export const DEFAULT_POST_LOGIN_ROUTE = '/profile/edit';// this is where to go after auth
export const ID_TOKEN_KEY = 'auth0_id_token';
export const ACCESS_TOKEN_KEY = 'auth0_access_token';
export const PROFILE_KEY = 'auth0_profile';


export default class Auth0Service extends EventEmitter {

  // an attempt at a singleton
  static instance = null;
  
  constructor(contextRouter) {
    super();
    
    if(this.instance) {
      return this.instance;
    }
      
    if (!process.env.REACT_APP_AUTH0_CLIENT_ID || !process.env.REACT_APP_AUTH0_DOMAIN) {
      throw new Error('Please define `REACT_APP_AUTH0_CLIENT_ID` and `REACT_APP_AUTH0_DOMAIN` in your .env file');
    }
    this.clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
    this.domain = process.env.REACT_APP_AUTH0_DOMAIN;
    
    // Configure Auth0
    this.lock = new Auth0Lock(this.clientId, this.domain, {
      auth: {
        redirectUrl: `${window.location.origin}/login`,
        responseType: 'token'
      }
    })
    
    this.router = contextRouter;
    // Add callback for lock `authenticated` event
    this.lock.on('authenticated', this._doAuthentication.bind(this))
    // Add callback for lock `authorization_error` event
    this.lock.on('authorization_error', this._authorizationError.bind(this))
    // binds login functions to keep this context
    this.login = this.login.bind(this)
  
    this.instance = this;
  }
  
  _doAuthentication(authResult){
    var nPath = this.getNextPath();
    console.log('DO AUTH - NEXT PATH', nPath)
    
    
    // Saves the user token
    this.setIdToken(authResult.idToken);
    // navigate to the home route
    // browserHistory.replace('/home')
    // TODO do this with redux instead?
    // this.router.transitionTo('/');//this.getNextPath() || DEFAULT_POST_LOGIN_ROUTE);
        
    // Async loads the user profile data
    this.lock.getProfile(authResult.idToken, (error, profile) => {
      if (error) {
        console.log('Error loading the Profile', error);
      } else {
        this.setProfile(profile);
        
        console.log('AUTH0 - Post get profile', 'redirect?');
        this.router.transitionTo('/');
      }
    });
  }
  
  _authorizationError(error){
    // Unexpected authentication error
    console.log('Authentication Error', error)
  }
  
  // login method shows the widget
  login() {
    console.log('Auth0Service - LOGIN called', this.lock)
    
    
    // this.lock.auth.redirectUrl = `${window.location.origin}{this.getNextPath()}`;
    this.lock.show({});
    
    return {
      hide() {
        this.lock.hide();
      }
    }
  }
  
  isLoggedIn(){
    // Checks if there is a saved token and it's still valid
    const token = this.getIdToken();
    return !!token && !isTokenExpired(token);
  }
  
  logout(transitionTo = ROOT_ROUTE){
    console.log('Auth0Service - Logout called')
  
    // Clear user token and profile data from localStorage
    this.clearNextPath();
    this.clearIdToken();
    this.clearAccessToken();
    this.clearProfile();
    
    this.router.transitionTo(transitionTo);
  }
  
  // PROFILE
  getProfile() {
    const profile = localStorage.getItem('profile');
    return profile ? JSON.parse(localStorage.profile) : {};
  }
  setProfile(profile) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    // TODO no longer using events - replace with dispatch action
    this.emit('profile_updated', profile);
  }
  clearProfile() {
    localStorage.removeItem(PROFILE_KEY);
    // TODO no longer using events - replace with dispatch action
    this.emit('profile_updated', null);
  }
  
  // ID_TOKEN
  getIdToken() {
    return localStorage.getItem(ID_TOKEN_KEY);
  }
  setIdToken(idToken) {
    localStorage.setItem(ID_TOKEN_KEY, idToken);
  }
  clearIdToken() {
    localStorage.removeItem(ID_TOKEN_KEY);
  }
  
  // NEXT_PATH
  getNextPath() {
    return localStorage.getItem(NEXT_PATH_KEY) || ROOT_ROUTE;
  }
  setNextPath(nextPath) {
    localStorage.setItem(NEXT_PATH_KEY, nextPath);
  }
  clearNextPath() {
    localStorage.removeItem(NEXT_PATH_KEY);
  }
  
  // ACCESS_TOKEN
  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }
  setAccessToken(accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }
  clearAccessToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
  
  
}
