import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { saveGame, fetchGame, updateGame } from '../actions/games_actions';
import GameForm from './GameForm';

class GameFormPage extends Component {
  state = {
    redirect: false
  }
  
  componentDidMount = () => {
    const { match } = this.props;
    if(match && match.params.id){
      console.log('FORM MOUNTED', match.params.id)
      this.props.fetchGame(parseInt(match.params.id, 10));
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
  // console.log('MAPPING', props)
  // console.log('MAPPING IDX', props.params.id)
  const { match } = props;
  // console.log('MATCH', match)
  
  if(match && match.params && match.params.id){
    return {
      game: state.games.find(item => item.id === parseInt(match.params.id, 10))
    }
  }
  
  return { game: null };
}

export default connect(mapStateToProps, { saveGame, fetchGame, updateGame })(GameFormPage);

