export const SET_GAMES = 'SET_GAMES';
export const ADD_GAME = 'ADD_GAME';
export const GAME_FETCHED = 'GAME_FETCHED';
export const GAME_UPDATED = 'GAME_UPDATED';
export const GAME_DELETED = 'GAME_DELETED';

function handleResponse(response) {
  // console.log('RESPONSE HANDLER', response)
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

export function gameFetched(game) {
  return {
    type: GAME_FETCHED,
    game
  }
}

export function gameUpdated(game) {
  return {
    type: GAME_UPDATED,
    game
  }
}

export function gameDeleted(id) {
  return {
    type: GAME_DELETED,
    id
  }
}

export function updateGame(data) {
  return dispatch => {
    return fetch(`/api/games/${data.id}`, {
      method: 'put',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(handleResponse)
    // dispatch a pure action to update our games list
    // send the same data we sent to the server
    .then(data => dispatch(gameUpdated(data.game)));
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
  //console.log('Games_actions - fetchGames()')
  return dispatch => {
    fetch('/api/games')
    .then(res => {
      // console.log('fetchGames response', res)
      return res.json();
    }) // TODO status check
    .then(data => {
      // console.log('fetchGames response', data.games)
      dispatch(setGames(data.games));
    });
  }
}

export function fetchGame(id){
  console.log('Games_actions - fetchGame()')
  return dispatch => {
    fetch(`/api/games/${id}`)
    .then(res => {
      console.log('fetchGame response', res)
      return res.json();})
    .then(data => {
      console.log('fetchGame response', data.game)
      
      // if exists in store then fetch data
      // otherwise add to collection
      // let reducer handle this logic
      dispatch(gameFetched(data.game));
    });
  }
}

export function deleteGame(id) {
  console.log('Games actions - deleteGame()', id)
  
  return dispatch => {
    fetch(`/api/games/${id}`, {
      method: 'delete',
      headers: {
        "Content-Type": "application/json"
      }
    }).then(handleResponse)
    // dispatch a pure action to update our games list
    // send the same data we sent to the server
    .then(() => {
      // console.log('Dispatched delete', id)
      dispatch(gameDeleted(id))
    })
      .catch(err => {
        console.log('DELETE ERROR', err)
      });
  }
}

