export const SET_GAMES = 'SET_GAMES';
export const ADD_GAME = 'ADD_GAME';

function handleResponse(response) {
  if(response.ok) {
    return response.json();
  } else {
    let error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

export function setGames(games) {
  return {
    type: SET_GAMES,
    games
  }
}

export function addGame(game) {
  return {
    type: ADD_GAME,
    game
  }
}

export function saveGame(data) {
  return dispatch => {
    return fetch('/api/games', {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(handleResponse)
    // dispatch a pure action to update our games list
    // send the same data we sent to the server
    .then(data => dispatch(addGame(data.game)));
  }
}

export function fetchGames(){
  console.log('Games_actions - fetchGames()')
  return dispatch => {
    fetch('/api/games')
    .then(res => {
      // console.log('fetchGames response', res)
      
      return res.json()}) // TODO status check
    .then(data => {
      // console.log('fetchGames response', data.games)
  
      dispatch(setGames(data.games))
    
    });
  }
}