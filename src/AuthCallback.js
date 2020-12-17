import React, { useEffect } from 'react';

function AuthCallback() {
  useEffect(() => {
    const code = (window.location.search.match(/code=([^&]+)/) || [])[1];
    window.opener.postMessage(
      { eventType: 'spotifyAuthResoponse', code },
      window.location.origin
    );
    window.close();
  }, []);

  return (
    <div className="content">
      <h1>Loggin successful</h1>
      <p>This windown should close automatically</p>
    </div>
  );
}

export default AuthCallback;
