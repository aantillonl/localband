import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import axios from 'axios';
import thunk from 'redux-thunk';
import { ValidationError } from 'ajv';
import App from './App';
import store from './store';
import searchBoxSlice from './searchBoxSlice';
import fetchCitiesThunk from './FetchCities';
import createSpotifyPlaylist, {
  getSpotifyAuthToken,
  getArtistSpotifyId,
  getArtistTopTrackUri,
  createPlaylist,
  addSongsToPlaylist,
  saveAuthDataToLocalStorage
} from './CreateSpotifyPlaylistThunk';

jest.mock('axios');
jest.useFakeTimers();

const mockStore = configureMockStore([thunk]);

describe('App Component', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});

describe('Action creators', () => {
  it('should create the right setSearchString action', () => {
    searchBoxSlice.actions;
    const payload = { searchString: 'abc', triggerSearch: true };
    const expectedAction = {
      type: 'searchBox/setSearchString',
      payload
    };
    expect(searchBoxSlice.actions.setSearchString(payload)).toEqual(
      expectedAction
    );
  });
});

describe('Async dbpedia actions', () => {
  afterEach(() => {
    axios.get.mockReset();
  });

  it('should not start fetch cities if the search string is less or equal to 3', () => {
    const store = mockStore({});
    return store.dispatch(fetchCitiesThunk('abc')).then(() => {
      expect(store.getActions()).toEqual([]);
    });
  });

  it('should start fetch cities if the search string is greater than 3', () => {
    const resp = {
      data: {
        results: {
          bindings: [
            {
              city: { value: 'http://dbpedia.org/london' },
              name: { value: 'London' }
            }
          ]
        }
      }
    };
    axios.get.mockResolvedValue(resp);
    const store = mockStore({});
    const expectedActions = [
      expect.objectContaining({ type: 'fetchCities/pending' }),
      expect.objectContaining({ type: 'fetchCities/fulfilled' })
    ];
    const promise = store.dispatch(
      fetchCitiesThunk({ searchString: 'London' })
    );
    jest.runAllTimers();
    return promise.then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should not request data from dbpedia if the request is aborted', () => {
    const store = mockStore({});
    const expectedActions = [
      expect.objectContaining({ type: 'fetchCities/pending' }),
      expect.objectContaining({ type: 'fetchCities/rejected' })
    ];
    const promise = store.dispatch(
      fetchCitiesThunk({ searchString: 'London' })
    );
    promise.abort();
    jest.runAllTimers();
    return promise.then(() => {
      expect(store.getActions()).toEqual(expectedActions);
      expect(axios.get).not.toHaveBeenCalled();
    });
  });

  it('should fail if db pedias response is not like the specified schema', () => {
    const resp = 'Not a valid payload';
    axios.get.mockResolvedValue(resp);
    const store = mockStore({});
    const expectedActions = [
      expect.objectContaining({ type: 'fetchCities/pending' }),
      expect.objectContaining({ type: 'fetchCities/rejected' })
    ];
    const promise = store.dispatch(
      fetchCitiesThunk({ searchString: 'London' })
    );
    jest.runAllTimers();
    return promise.then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

describe('Spotify Auth', () => {
  afterEach(() => {
    localStorage.clear();
    axios.get.mockReset();
    axios.post.mockReset();
  });

  it('should not get the auth token from local storage if available and valid', () => {
    localStorage.setItem('access_token', 'test_token_from_storage');
    const inOneHour = Date.now() + 3600 * 1000;
    localStorage.setItem('expiration_date', inOneHour);
    return getSpotifyAuthToken().then(auth_token => {
      expect(auth_token).toEqual('test_token_from_storage');
    });
  });

  it('should start auth flow and listen for auth code messages', () => {
    global.open = jest.fn();
    axios.post.mockResolvedValue({
      data: {
        access_token: 'test_token_from_api',
        refresh_token: 'test_refresh_token_from_storage',
        token_type: 'Bearer',
        scope: 'playlist-modify-private',
        expires_in: 0
      }
    });
    const tokenPromise = getSpotifyAuthToken();
    window.dispatchEvent(
      new MessageEvent('message', {
        data: { eventType: 'spotifyAuthResoponse', code: 'test_code' },
        origin: '*'
      })
    );

    return tokenPromise.then(access_token => {
      expect(access_token).toEqual('test_token_from_api');
    });
  });

  it('should exchange code for auth token', () => {
    localStorage.setItem('access_token', 'expired_token');
    localStorage.setItem('refresh_token', 'refresh_token');
    const oneHourAgo = Date.now() - 3600 * 1000;
    localStorage.setItem('expiration_date', oneHourAgo);
    const resp = {
      data: {
        access_token: 'test_refreshed_token_from_api',
        refresh_token: 'test_refresh_token_from_api',
        token_type: 'Bearer',
        scope: 'playlist-modify-private',
        expires_in: 0
      }
    };
    axios.post.mockResolvedValue(resp);
    return getSpotifyAuthToken().then(auth_token => {
      expect(auth_token).toEqual('test_refreshed_token_from_api');
    });
  });

  it('should fail to save auth data if doesnt match schema', () => {
    try {
      saveAuthDataToLocalStorage({});
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError);
    }
  });
  it('should not update refresh_token if is not included in response', () => {
    localStorage.setItem('refresh_token', 'test_refresh_token');
    saveAuthDataToLocalStorage({
      access_token: 'test_refreshed_token_from_api',
      token_type: 'Bearer',
      scope: 'playlist-modify-private',
      expires_in: 0
    });
    expect(localStorage.getItem('refresh_token')).toEqual('test_refresh_token');
  });
});

describe('Create Playlist', () => {
  afterEach(() => {
    localStorage.clear();
    axios.get.mockReset();
    axios.post.mockReset();
  });
  it('should getArtistSpotifyId', () => {
    const resp = {
      data: {
        artists: {
          items: [{ id: '08td7MxkoHQkXnWAYD8d6Q' }]
        }
      }
    };
    axios.get.mockResolvedValue(resp);
    return getArtistSpotifyId('test_token', 'Metallica').then(id => {
      expect(id).toEqual('08td7MxkoHQkXnWAYD8d6Q');
    });
  });

  it('should fail if getArtistSpotifyId response  is invalid', () => {
    axios.get.mockResolvedValue({ data: 'invalid response' });
    return getArtistSpotifyId('test_token', 'Metallica').catch(err => {
      expect(err).toBeInstanceOf(ValidationError);
    });
  });

  it('should getArtistTopTrackUri', () => {
    const resp = { data: { tracks: [{ uri: '08td7MxkoHQkXnWAYD8d6Q' }] } };
    axios.get.mockResolvedValue(resp);
    return getArtistTopTrackUri('test_token', 'test_artist_uri').then(uri => {
      expect(uri).toEqual('08td7MxkoHQkXnWAYD8d6Q');
    });
  });

  it('should create a playlist', () => {
    const resp = { data: { id: 'test_playlist_id' } };
    axios.post.mockResolvedValue(resp);
    return createPlaylist('test_token').then(playlistId =>
      expect(playlistId).toEqual('test_playlist_id')
    );
  });

  it('should add songs to a playlist', () => {
    const resp = { status: 201 };
    axios.post.mockResolvedValue(resp);
    return addSongsToPlaylist('test_token', 'test_playlist', [
      'song_uri_1',
      'song_uri_2',
      'song_uri_3'
    ]);
  });

  it('should create a playlist end to end', () => {
    const spotifyApiMock = jest.fn(url => {
      if (url.match(/\/search$/)) {
        return Promise.resolve({
          data: { artists: { items: [{ id: 'test_artist_id' }] } }
        });
      }
      if (url.match(/\/top-tracks\?/)) {
        return Promise.resolve({ data: { tracks: [{ uri: 'track_uri' }] } });
      }
      if (url.match(/\/me$/)) {
        return Promise.resolve({ data: { id: 'user_id' } });
      }
      if (url.match(/\/playlists$/)) {
        return Promise.resolve({ data: { id: 'playlist_id' } });
      }
      if (url.match(/\/tracks$/)) {
        return Promise.resolve({ status: 201 });
      }
    });
    axios.get.mockImplementation(spotifyApiMock);
    axios.post.mockImplementation(spotifyApiMock);
    localStorage.setItem('access_token', 'test_token_from_storage');
    localStorage.setItem('refresh_token', 'test_refresh_token_from_storage');
    const inOneHour = Date.now() + 3600 * 1000;
    localStorage.setItem('expiration_date', inOneHour);
    const store = mockStore({
      bandsList: ['test_band'],
      searchBox: { searchString: 'test_playlist' }
    });
    return store
      .dispatch(createSpotifyPlaylist())
      .then(res => expect(res.payload).toEqual('playlist_id'));
  });

  it('should handle no results from Spotify Search API', () => {
    localStorage.setItem('access_token', 'test_token_from_storage');
    localStorage.setItem('refresh_token', 'test_refresh_token_from_storage');
    const inOneHour = Date.now() + 3600 * 1000;
    localStorage.setItem('expiration_date', inOneHour);
    const store = mockStore({
      bandsList: ['band_that_doesnt_exist', 'metallica'],
      searchBox: { searchString: 'test_playlist' }
    });
    axios.get
      .mockResolvedValueOnce({ data: { artists: { items: [] } } }) // First artist not found
      .mockResolvedValueOnce({
        data: { artists: { items: [{ id: 'metallica_id' }] } }
      }) // 2nd artist found
      .mockResolvedValueOnce({ data: { tracks: [{ uri: 'track_uri' }] } }) // 2nd artist top track
      .mockResolvedValueOnce({ data: { id: 'user_id' } }); // User id

    axios.post
      .mockResolvedValueOnce({ data: { id: 'playlist_id' } }) // Create playlist
      .mockResolvedValueOnce({ status: 201 }); // Add songs to playlist

    return store.dispatch(createSpotifyPlaylist()).then(res => {
      expect(res.payload).toEqual('playlist_id');
    });
  });
});
