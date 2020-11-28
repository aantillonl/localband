import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { AUTH_SCOPE } from './common/restApiConstants';
import CreateSpotifyPlaylistThunk from './CreateSpotifyPlaylistThunk';

const AUTH_TIMEOUT = 1000 * 60; // 1 MIN
function _OpenAuthPopUp() {
  const authParams = {
    client_id: '493fa509a9db44d5867e40a7fdcd58a8',
    response_type: 'code',
    redirect_uri: 'http://localhost:3000/callback/',
    scope: AUTH_SCOPE,
  };
  window.open(`https://accounts.spotify.com/authorize?${new URLSearchParams(authParams)}`);
}

function saveEventDataToLocalStorage(event) {
  const data = event.data;
  if (data.type !== 'spotifyAuthCallback') return;

  data.access_token && localStorage.setItem('access_token', data.access_token);
  data.expires_in && localStorage.setItem('expires_in', data.expires_in);
  data.refresh_toke && localStorage.setItem('refresh_token', data.refresh_token);
}

function ListenForAuthMessage() {
  return new Promise(resolve => {
    window.addEventListener('message', resolve);
    setTimeout(() => window.removeEventListener('message', resolve), AUTH_TIMEOUT);
  });
}

async function GetSpotifyAuthToken() {
  try {
    if (!localStorage.getItem('access_token')) {
      _OpenAuthPopUp();
      saveEventDataToLocalStorage(await ListenForAuthMessage());
    }
    return localStorage.getItem('access_token');
  } catch (error) {
    throw new Error("Couldn't get access_token");
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
