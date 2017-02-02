import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { saveGame, fetchGame, updateGame } from '../actions/games_actions';
import GameForm from './GameForm';

class GameFormPage extends Component {
  state = {
    redirect: false
  }
  
  componentDidMount = () => {
    if(this.props.params.id){
      console.log('FORM MOUNTED', this.props.params.id)
      this.props.fetchGame(parseInt(this.props.params.id, 10));
    }
  }
  
  // this will be passed to form component
  saveGame = ({id, title, cover}) => {
    if(id) {
      return this.props.updateGame({id, title, cover})
      .then(
        () => {
          this.setState({redirect: true})
        }
      );
    } else {
      return this.props.saveGame({title, cover})
      .then(
        () => {
          this.setState({redirect: true})
        }
      );
    }
  }
  
  render() {
    return (
      <div>
        {
          this.state.redirect ?
          <Redirect to="/games" /> :
          <GameForm
            game={this.props.game}
            saveGame={this.saveGame}
          />
        }
      </div>
    );
  }
}

function mapStateToProps(state, props){
  //console.log('MAPPING', state)
  // console.log('MAPPING IDX', props.params.id)
  if(props.params.id){
    return {
      game: state.games.find(item => item.id === parseInt(props.params.id, 10))
    }
  }
  
  return { game: null };
}

export default connect(mapStateToProps, { saveGame, fetchGame, updateGame })(GameFormPage);

