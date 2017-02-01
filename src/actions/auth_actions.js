export const SET_PROFILE = 'SET_PROFILE';

export function setProfile(profile) {
  console.log('AUTH actions - set profile', profile);
  return {
    type: SET_PROFILE,
    profile
  }
}

