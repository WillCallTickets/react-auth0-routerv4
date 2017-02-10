import { combineReducers } from 'redux';

import user from './user_reducer';
import games from './games_reducer';

export default combineReducers({
  user,
  games
});