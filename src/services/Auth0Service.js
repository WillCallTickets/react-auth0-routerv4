//TODO move from events to redux/dispatch
import { EventEmitter } from 'events';
import { isTokenExpired } from './jwtHelper';
import Auth0Lock from 'auth0-lock';
import { setUser, unsetUser } from '../actions/user_actions';

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
  
  constructor(contextRouter, contextStore) {
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
    this.store = contextStore;
    
    // Add callback for lock `authenticated` event
    this.lock.on('authenticated', this._doAuthentication.bind(this))
    // Add callback for lock `authorization_error` event
    this.lock.on('authorization_error', this._authorizationError.bind(this))
    // binds login functions to keep this context
    this.login = this.login.bind(this)
      
    this.instance = this;
  }
  
  _doAuthentication(authResult){
    
    // console.log('do auth', authResult)
        
    // Save the user & access token
    this.setIdToken(authResult.idToken);
    this.setAccessToken(authResult.accessToken);
    // TODO dispatch redux action to save token to store?
  
    // debugger;
        
    // Async loads the user profile data
    this.lock.getProfile(authResult.idToken, (error, profile) => {
      if (error) {
        console.log('Error loading the Profile', error);
      } else {
        // console.log('AUTH0 - Post get profile example', '<Redirect to= pathname: "/login", state: { referrer: "/profile/edit" ');
        
        this.setProfile(profile);
        
        // default is to redirect to login page - set by lock component
        // unfortunately, this creates an endless loop to the login page and
        // worse yet, it redirects to /login#
        
        // by redirecting to the home route '/', or a route of our choice,
        // the router is able to use it's state.referrer
        
        this.router.transitionTo(DEFAULT_POST_LOGIN_ROUTE);
      }
    });
  }
  
  _authorizationError(error){
    // Unexpected authentication error
    console.log('Authentication Error', error)
  }
  
  // login method shows the widget
  login() {
    let self = this;
    // console.log('Auth0Service - LOGIN called', this.lock)
    self.lock.show({});
    
    return {
      hide() {
        self.lock.hide();
      }
    }
  }
  
  isLoggedIn(){
    // Checks if there is a saved token and it's still valid
    const token = this.getIdToken();
    return !!token && !isTokenExpired(token);
  }
  
  logout(transitionTo = ROOT_ROUTE){
    // console.log('Auth0Service - Logout called')
  
    // Clear user token and profile data from localStorage
    this.clearNextPath();
    this.clearIdToken();
    this.clearAccessToken();
    this.clearProfile();
  
    this.store.dispatch(unsetUser());
    
    this.router.transitionTo(transitionTo);
  }
  
 // PROFILE SUBSCRIPTION
 //  subscribeToProfile(subscription) {
 //    let self = this; // set this up to be available in the return > close block
 //    self.on('profile_updated', subscription);
 //
 //    if (self.isLoggedIn()) {
 //      subscription(self.getProfile());
 //
 //      self.lock.getUserInfo(this.getAccessToken(), (error, profile) => {
 //        if (error) {
 //          return self.setProfile({error});
 //        }
 //        // console.log('self setter')
 //        self.setProfile(profile);
 //      });
 //    }
 //
 //    return {
 //      close() {
 //        self.removeListener('profile_updated', subscription);
 //      }
 //    };
 //  }
  
  fetchAsUser(input, init={}) {
    const headers = init.headers || {};
    
    return fetch(input, {
      ...init,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getIdToken()}`,
        ...headers
      }
    }).then((response) => {
      if (!response.ok) { throw new Error(response); }
      return response;
    });
  }
  
  async updateProfile(userId, newProfile) {
    try {
      const response = await this.fetchAsUser(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify(newProfile)
      });
      
      const profile = await response.json();
      console.log('Profile updated')
      this.setProfile(profile);
    } catch (error) {
      return error;
    }
  }
  
  // PROFILE STORAGE
  getProfile() {
    const profile = localStorage.getItem('profile');
    return profile ? JSON.parse(localStorage.profile) : {};
  }
  setProfile(profile) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    this.store.dispatch(setUser(profile))
    
    // TODO get ref to dispatch then use dispatch => setUser(profile)
    
    console.log('PRO----FILE SET ')
    //this.emit('profile_updated', profile);
  }
  clearProfile() {
    localStorage.removeItem(PROFILE_KEY);
    this.emit('profile_updated', null);
  }
  
  // ID_TOKEN STORAGE
  getIdToken() {
    return localStorage.getItem(ID_TOKEN_KEY);
  }
  setIdToken(idToken) {
    localStorage.setItem(ID_TOKEN_KEY, idToken);
  }
  clearIdToken() {
    localStorage.removeItem(ID_TOKEN_KEY);
  }
  
  // NEXT_PATH STORAGE
  getNextPath() {
    return localStorage.getItem(NEXT_PATH_KEY) || ROOT_ROUTE;
  }
  setNextPath(nextPath) {
    localStorage.setItem(NEXT_PATH_KEY, nextPath);
  }
  clearNextPath() {
    localStorage.removeItem(NEXT_PATH_KEY);
  }
  
  // ACCESS_TOKEN STORAGE
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
