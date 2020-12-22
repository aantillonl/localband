const { proxy, getSsmParameters } = require('./handler');
const nock = require('nock');

describe('Handler tests', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules(); // most important - it clears the cache
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should proxy the token exchange request', async () => {
    const response = {
      access_token: 'test_access_token',
      refresh_token: 'test_refresh_token',
      expres_in: 3600,
      scope: 'test_scope'
    };
    nock('https://accounts.spotify.com')
      .post('/api/token')
      .reply(200, response);
    return proxy('test_client_id', 'test_client_secret', 'test-data').then(
      res => {
        expect(JSON.parse(res)).toEqual(response);
      }
    );
  });

  it('should parse the response from getParameters', () => {
    process.env.AWS_REGION = 'eu-west-1';
    process.env.AWS_ACCESS_KEY_ID = 'test-access-key-id';
    process.env.AWS_SECRET_ACCESS_KEY = 'test-secret-access-key';

    nock('https://ssm.eu-west-1.amazonaws.com')
      .post('/')
      .reply(200, {
        Parameters: [
          { Name: 'localband-client-id', Value: 'test-id' },
          { Name: 'localband-client-secret', Value: 'test-secret' }
        ]
      });
    return getSsmParameters().then(res => {
      expect(res).toEqual({ clientSecret: 'test-secret', clientId: 'test-id' });
    });
  });
});
