import React, { Component } from 'react';
import { Match, Redirect } from 'react-router';
import ActiveLink from '../components/ActiveLink';

import { _baseContainer } from './_baseContainer';
import Home from './Home';
import Login from './Login';
import EditProfile from './EditProfile';
import GamesPage from './GamesPage';
import GameFormPage from './GameFormPage';

class App extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  }
  
  // constructor(props, context) {
  //   super(props, context);
  // }
  
  logout = (e) => {
    e.preventDefault();
    this.props.auth0.logout();
  }
  
  render () {
    // console.log('App Props',this.context.router)
    // console.log('App Props',this.props.location)
    // console.log('App Logged',this.props.auth0.isLoggedIn())
    
    const logged = this.props.auth0.isLoggedIn();
    
    return (
      <div className="ui container">
        
        <div className="ui five item menu" style={{justifyContent:'flex-start', textAlign:'left'}}>
          
          {/* TODO combine links into one expression */}
          <ActiveLink to="/">Home</ActiveLink>
          <ActiveLink to="/games">Games</ActiveLink>
  
          { logged ? (
              <ActiveLink to="/games/new">Add New Game</ActiveLink>
            ) : (
              <span className="item"></span>
            )}
  
          { logged ? (
              <ActiveLink to="/profile/edit">Profile</ActiveLink>
            ) : (
              <span className="item"></span>
            )}
  
          { logged ? (
              <a className="item" onClick={(e) => this.logout(e)}>Log Out</a>
            ) : (
              <ActiveLink to="/profile/edit">Login</ActiveLink>
            )}
          
        </div>
        {/* end of nav menu */}
        
        {/* TODO look into switch construct of RRv4 - switch ensures only on e component match*/}
        <div className="page-content">
          <Match exactly pattern="/" component={Home}/>
          <Match pattern="/login" component={Login}/>
          <Match exactly pattern="/games" component={GamesPage}/>
          
          <Match pattern="/games/new" render={() => (
            logged ? (
                <GameFormPage />
              ) : (
                <Redirect to={{
                  pathname: '/login',
                  state: { referrer: '/games/new' }
                }} />
              )
          )}/>
  
          {/* Note how we pass params here */}
          <Match exactly pattern="/game/:id" render={(id) => (
           logged ? (
               <GameFormPage {...id}/>
             ) : (
               <Redirect to={{
                 pathname: '/login',
                 state: { referrer: `/games/${id}` }
               }} />
             )
         )}/>
          
          <Match pattern="/profile/edit" render={() => (
            logged ? (
                <EditProfile />
              ) : (
                <Redirect to={{
                  pathname: '/login',
                  state: { referrer: '/profile/edit' }
                }} />
              )
          )}/>
        </div>
        {/* end of page-content */}
        
      </div>
    );
  }
}

export default _baseContainer(App);
