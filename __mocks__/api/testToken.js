/* eslint-disable-next-line no-unused-vars */
module.exports = function(req, res) {
  res.json({
    data: {
      access_token: 'test_token',
      token_type: 'Bearer',
      scope: 'user-read-private user-read-email',
      expires_in: 3600,
      refresh_token: 'test_refresh_token'
    }
  });
};
