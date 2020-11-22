import React, { useEffect } from 'react';
import envConfig from './core/env-config.json';

const environment = process.env.REACT_APP_ENVIRONMENT;
const apiUrl = envConfig[environment]['auth_api'];

function AuthCallback() {
  useEffect(() => {
    const code = (window.location.search.match(/code=([^&]+)/) || [])[1];
    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=authorization_code&code=${code}&redirect_uri=http://localhost:3000/callback/`,
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        window.opener.postMessage(
          {
            type: 'spotifyAuthCallback',
            auth: res.data,
          },
          window.location.origin
        );
        window.close();
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>Loggin successful</h1>
      <p>This windown should close automatically</p>
    </div>
  );
}

export default AuthCallback;
