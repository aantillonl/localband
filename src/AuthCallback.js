import React, { useEffect } from 'react';

function AuthCallback() {
  useEffect(() => {
    const code = (window.location.search.match(/code=([^&]+)/) || [])[1];
    window.opener.postMessage(code, window.location.origin);
    window.close();
  }, []);

  return (
    <div>
      <h1>Loggin successful</h1>
      <p>This windown should close automatically</p>
    </div>
  );
}

export default AuthCallback;
