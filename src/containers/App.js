import React, { Component } from 'react';
import { Link, Match, Redirect } from 'react-router';

import { _baseContainer } from './_baseContainer';
import Home from './Home';
import Login from './Login';
import EditProfile from './EditProfile';
import GamesPage from './GamesPage';
import GameForm from './GameForm';

class App extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  }
  
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
    console.log('App Props',this.context.router)
    console.log('App Props',this.props.location)
    console.log('App Logged',this.props.auth0.isLoggedIn())
    
    const logged = this.props.auth0.isLoggedIn();
    
    return (
      <div className="ui container">
        
        <div className="ui five item menu" style={{justifyContent:'flex-start', textAlign:'left'}}>
          
          {/* TODO combine links into one expression */}
          <Link className="item" activeClassName="active" activeOnlyWhenExact to="/">Home</Link>
          <Link className="item" activeClassName="active" activeOnlyWhenExact to="/games">Games</Link>
  
          { logged ? (
              <Link className="item" activeClassName="active" activeOnlyWhenExact to="/games/new">Add New Game</Link>
            ) : (
              <span className="item"></span>
            )}
  
          { logged ? (
              <Link className="item" activeClassName="active" activeOnlyWhenExact to="/profile/edit">Profile</Link>
            ) : (
              <span className="item"></span>
            )}
  
          { logged ? (
              <a className="item" onClick={(e) => this.logout(e)}>Log Out</a>
            ) : (
              <Link className="item" activeClassName="active" activeOnlyWhenExact to="/profile/edit">Login</Link>
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
                <GameForm/>
              ) : (
                <Redirect to={{
                  pathname: '/login',
                  state: { referrer: '/games/new' }
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
