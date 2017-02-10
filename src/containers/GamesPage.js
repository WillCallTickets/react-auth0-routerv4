import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { fetchGames, deleteGame } from '../actions/games_actions';

import GamesList from '../components/GamesList';

class GamesPage extends Component{
  state = {
    redirect: false
  }
  
  componentDidMount = () => {
    this.props.fetchGames();
  }
    
  render(){
    // console.log('GAMES RETURNED From Fetch', this.props)
    return(
      <div>
        {
          this.state.redirect ?
            <Redirect to="/games" /> :
            <div>
            <h1>Games List</h1>
            < GamesList games={this.props.games} deleteGame={this.props.deleteGame} />
            </div>
        }
      </div>
    );
  }
}

GamesPage.propTypes = {
  games: React.PropTypes.array.isRequired,
  fetchGames: React.PropTypes.func.isRequired,
  deleteGame: React.PropTypes.func.isRequired
}

function mapStateToProps(state){
  return {
    games: state.games
  }
}

export default connect(mapStateToProps, { fetchGames, deleteGame })(GamesPage);