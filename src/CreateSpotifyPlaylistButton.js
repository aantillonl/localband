import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ValidationError } from 'ajv';
import { AUTH_SCOPE } from './common/restApiConstants';
import { authResponseValidator } from './schemaValidation';
import CreateSpotifyPlaylistThunk, { getSpotifyAccessToken } from './CreateSpotifyPlaylistThunk';

const AUTH_TIMEOUT = 1000 * 60; // 1 MIN
function openAuthPopUp() {
  const authParams = {
    client_id: '493fa509a9db44d5867e40a7fdcd58a8',
    response_type: 'code',
    redirect_uri: 'http://localhost:3000/callback/',
    scope: AUTH_SCOPE,
  };
  window.open(`https://accounts.spotify.com/authorize?${new URLSearchParams(authParams)}`);
}

function saveAuthDataToLocalStorage(authData) {
  if (!authResponseValidator(authData)) throw new ValidationError();

  localStorage.setItem('access_token', authData.access_token);
  localStorage.setItem('refresh_token', authData.refresh_token);
  localStorage.setItem('expiration_date', Date.now() + authData.expires_in * 1000);
}

function ListenForAuthResponseMessage() {
  return new Promise(resolve => {
    window.addEventListener('message', ({ data }) => resolve(data));
    setTimeout(() => window.removeEventListener('message', resolve), AUTH_TIMEOUT);
  });
}

function GetSpotifyAuthToken() {
  const storage_access_token = localStorage.getItem('access_token');
  const storage_expiration_date = localStorage.getItem('expiration_date');
  const storage_refresh_token = localStorage.getItem('refresh_token');
  if (storage_access_token && parseInt(storage_expiration_date) > Date.now())
    return Promise.resolve(storage_access_token);

  const saveAuthAndReturnToken = ({ data }) => {
    saveAuthDataToLocalStorage(data);
    return data.access_token;
  };

  if (!storage_access_token) {
    openAuthPopUp();
    return ListenForAuthResponseMessage()
      .then(getSpotifyAccessToken)
      .then(saveAuthAndReturnToken);
  }

  if (storage_access_token && storage_refresh_token && storage_expiration_date < Date.now()) {
    return getSpotifyAccessToken(storage_refresh_token).then(saveAuthAndReturnToken);
  }
}

function CreateSpotifyPlaylistButton({ CreateSpotifyPlaylistThunk }) {
  async function _onClick() {
    CreateSpotifyPlaylistThunk(await GetSpotifyAuthToken());
  }
  return (
    <button type="button" onClick={_onClick}>
      Create Spotify Playlist
    </button>
  );
}

const mapStateToProps = state => ({ playlistName: state.playlistName });
CreateSpotifyPlaylistButton.propTypes = {
  CreateSpotifyPlaylistThunk: PropTypes.func.isRequired,
};
export default connect(mapStateToProps, { CreateSpotifyPlaylistThunk })(
  CreateSpotifyPlaylistButton
);

export { GetSpotifyAuthToken, openAuthPopUp };
