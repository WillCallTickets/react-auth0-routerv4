import { SET_USER, UNSET_USER } from '../actions/user_actions';

export default function user(state = {}, action = {}){
    
  switch(action.type){
    case SET_USER:
      console.log('USER REDUCER ', action)
      return action.user;
    case UNSET_USER:
      return {};
      
    default:
      return state;
  }
}