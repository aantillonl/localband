import React from 'react';
import { connect } from 'react-redux';
import SearchBox from './SearchBox';
import './App.scss';

function App() {
  return (
    <div>
      <div className="content">
        <SearchBox />
      </div>

      <div className="footer">
        Orchestrated by:{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.linkedin.com/in/hansiemithun/">
          Mithun
        </a>{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.npmjs.com/package/generator-ozone-ui">
          &copy; Copyright 2018 - {new Date().getFullYear()}
        </a>
      </div>
    </div>
  );
}

export default connect()(App);
