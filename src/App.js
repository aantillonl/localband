import React from 'react';
import { connect } from 'react-redux';
import SearchBox from './SearchBox';
import BandsList from './BandsList';
import './App.scss';

function App() {
  return (
    <div className="content">
      <h1>Local Band Finder</h1>
      <SearchBox />
      <BandsList />
    </div>
  );
}

export default connect()(App);
