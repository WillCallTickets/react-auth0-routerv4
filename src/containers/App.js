import React, { Component } from 'react';
import { Route, Redirect, Link } from 'react-router-dom';
// import ActiveLink from '../components/ActiveLink';


// import DevTool from './DevTools';

import { _baseContainer } from './_baseContainer';
import Home from './Home';
import Login from './Login';
import EditProfile from './EditProfile';
import GamesPage from './GamesPage';
import GameFormPage from './GameFormPage';
import './App.css';


const ActiveLink = ({ label, to, activeOnlyWhenExact }) => (
  <Route path={to} exact={activeOnlyWhenExact} children={({ match }) => (
    <Link className={match ? 'active item' : 'item'} to={to}>{label}</Link>
  )} />
);


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
      <div>
      <div className="ui container">
        
        
        <div className="ui five item menu " style={{justifyContent:'flex-start', textAlign:'left'}}>
          
          {/* TODO combine links into one expression */}
          <ActiveLink activeOnlyWhenExact to="/" label="Home"/>
          <ActiveLink activeOnlyWhenExact to="/games" label="Games" />
  
          { logged ? (
              <ActiveLink activeOnlyWhenExact to="/games/new" label="Add New Game"/>
            ) : (
              <span className="item"></span>
            )}
  
          { logged ? (
              <ActiveLink activeOnlyWhenExact to="/profile/edit" label="Profile" />
            ) : (
              <span className="item"></span>
            )}
  
          { logged ? (
              <a className="item" onClick={(e) => this.logout(e)}>Log Out</a>
            ) : (
              <ActiveLink activeOnlyWhenExact to="/profile/edit" label="Login" />
            )}
          
        </div>
        {/* end of nav menu */}
        
        {/* TODO look into switch construct of RRv4 - switch ensures only on e component match*/}
        <div className="page-content">
          <Route exact path="/" component={Home}/>
          <Route path="/login" component={Login}/>
          <Route exact path="/games" component={GamesPage}/>
          
          <Route path="/games/new" render={() => (
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
          <Route exact path="/game/:id" render={(id) => (
           logged ? (
               <GameFormPage {...id}/>
             ) : (
               <Redirect to={{
                 pathname: '/login',
                 state: { referrer: `/games/${id}` }
               }} />
             )
         )}/>
          
          <Route path="/profile/edit" render={() => (
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
      </div>
    );
  }
}

export default _baseContainer(App);
