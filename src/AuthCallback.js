import React, { useEffect } from 'react';
import axios from 'axios';
import qs from 'querystring';
import envConfig from './core/env-config.json';

const environment = process.env.REACT_APP_ENVIRONMENT;
const apiUrl = envConfig[environment]['auth_api'];

function AuthCallback() {
  useEffect(() => {
    const code = (window.location.search.match(/code=([^&]+)/) || [])[1];
    axios
      .post(
        apiUrl,
        qs.stringify({
          grant_type: 'authorization_code',
          code,
          redirect_uri: 'http://localhost:3000/callback/',
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      )
      .then(res => {
        window.opener.postMessage(res, window.location.origin);
        window.close();
      });
  }, []);

  return (
    <div>
      <h1>Loggin successful</h1>
      <p>This windown should close automatically</p>
    </div>
  );
}

export default AuthCallback;
