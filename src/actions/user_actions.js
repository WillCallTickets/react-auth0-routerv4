export const FETCH_USER = 'FETCH_USER';
export const SET_USER = 'SET_USER';
export const UNSET_USER = 'UNSET_USER';

// this is handled by Auth0 service
// export function fetchProfile() {
// }

// data has already been fetched - dispatch to reducer
export function setUser(user) {
  console.log('AUTH actions - set user', user);
  return {
    type: SET_USER,
    user
  }
}

export function unsetUser() {
  return {
    type: UNSET_USER
  }
}

