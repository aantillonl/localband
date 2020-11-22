import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SearchBox from './SearchBox';
import BandsList from './BandsList';
import AuthCallback from './AuthCallback';
import './App.scss';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/callback">
          <AuthCallback />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

function Home() {
  return (
    <div className="content">
      <h1>Local Band Finder</h1>
      <SearchBox />
      <BandsList />
    </div>
  );
}

export default connect()(App);
