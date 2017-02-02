import { SET_GAMES, ADD_GAME, GAME_FETCHED, GAME_UPDATED, GAME_DELETED } from '../actions/games_actions';

export default function games(state = [], action = {}){
  switch(action.type){
  
    case GAME_DELETED:
      return state.filter(item => {
        return (item.id !== parseInt(action.id, 10));
      });
  
      // console.log('REDUCER DEL ID', action.id)
      // console.log('REDUCER COLL', coll)
      // return coll;
      
    case GAME_UPDATED:
      return state.map(item => {
        if(item.id === parseInt(action.game.id, 10))
          return action.game;
        return item;
      });
      
    case GAME_FETCHED:
      const idx = state.findIndex(item => item.id === parseInt(action.game.id, 10))
      if(idx > -1){ // if game exists in the state collection
        // then return a collection where we insert the updated action.game in the match position
        return state.map(item => {
          if(item.id === parseInt(action.game.id, 10))
            return action.game;
          return item;
        });
      } else {
        // if no game was found - add action.game to end of collection
        return [
          ...state,
          action.game
        ]
      }
    case ADD_GAME:
      // return the entire collection of games plus the newly added game
      return [
        ...state,
        action.game
      ];
    case SET_GAMES:
      return action.games;
    default:
      return state;
  }
}