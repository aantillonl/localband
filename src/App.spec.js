import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import axios from 'axios';
import thunk from 'redux-thunk';
import App from './App';
import store from './store';
import SearchBoxSlice from './searchBoxSlice';

import FetchCitiesThunk from './FetchCities';

jest.mock('axios');
jest.useFakeTimers();

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
    SearchBoxSlice.actions;
    const payload = 'abc';
    const expectedAction = {
      type: 'searchBox/setSearchString',
      payload,
    };
    expect(SearchBoxSlice.actions.setSearchString(payload)).toEqual(expectedAction);
  });
});

describe('Async actions', () => {
  const mockStore = configureMockStore([thunk]);

  afterEach(() => {
    axios.get.mockReset();
  });

  it('should not start fetch cities if the search string is less or equal to 3', () => {
    const store = mockStore({});
    return store.dispatch(FetchCitiesThunk('abc')).then(() => {
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
              name: { value: 'London' },
            },
          ],
        },
      },
    };
    axios.get.mockResolvedValue(resp);
    const store = mockStore({});
    const expectedActions = [
      expect.objectContaining({ type: 'fetchCities/pending' }),
      expect.objectContaining({ type: 'fetchCities/fulfilled' }),
    ];
    const promise = store.dispatch(FetchCitiesThunk('London'));
    jest.runAllTimers();
    return promise.then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('should not request data from dbpedia if the request is aborted', () => {
    const store = mockStore({});
    const expectedActions = [
      expect.objectContaining({ type: 'fetchCities/pending' }),
      expect.objectContaining({ type: 'fetchCities/rejected' }),
    ];
    const promise = store.dispatch(FetchCitiesThunk('London'));
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
      expect.objectContaining({ type: 'fetchCities/rejected' }),
    ];
    const promise = store.dispatch(FetchCitiesThunk('London'));
    jest.runAllTimers();
    return promise.then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
