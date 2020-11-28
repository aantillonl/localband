import React, { useEffect } from 'react';
import Ajv from 'ajv';
import envConfig from './core/env-config.json';
import { AUTH_SCOPE } from './common/restApiConstants';

const ajv = new Ajv();
const schema = {
  $id: 'http://localbands.alejandroantillon.com/schemas/schema.json',
  type: 'object',
  properties: {
    access_token: { type: 'string' },
    expires_in: { type: 'integer' },
    token_type: { type: 'string', pattern: 'Bearer' },
    scope: { type: 'string', pattern: AUTH_SCOPE },
    refresh_token: { type: 'string' },
  },
};
const validate = ajv.compile(schema);
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
      .then(res => (validate(res) ? res : new Error('invalid schema')))
      .then(res => {
        window.opener.postMessage({ ...res, type: 'spotifyAuthCallback' }, window.location.origin);
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
