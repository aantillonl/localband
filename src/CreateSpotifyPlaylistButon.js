import React from 'react';
import { connect } from 'react-redux';
import createSpotifyPlaylistSlice from './CreateSpotifyPlaylistSlice';
import createSpotifyPlaylist from './CreateSpotifyPlaylistThunk';

function CreateSpotifyPlaylistButton({ setAuthData, createSpotifyPlaylist }) {
  const queryParams = {
    client_id: '493fa509a9db44d5867e40a7fdcd58a8',
    response_type: 'code',
    redirect_uri: 'http://localhost:3000/callback/',
    scope: 'playlist-modify-private',
  };
  function _onClick() {
    window.open(`https://accounts.spotify.com/authorize?${new URLSearchParams(queryParams)}`);
    const messageHandler = event => {
      if (event.data.type !== 'spotifyAuthCallback') return;
      setAuthData(event.data.auth);
      createSpotifyPlaylist();
    };
    window.addEventListener('message', messageHandler);
  }
  return <button onClick={_onClick}>Create Spotify Playlist</button>;
}

const mapDispatchToProps = {
  ...createSpotifyPlaylistSlice.actions,
  createSpotifyPlaylist,
};
export default connect(null, mapDispatchToProps)(CreateSpotifyPlaylistButton);
