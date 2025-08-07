// Configuration pour les tests et le développement
module.exports = {
  // Configuration de développement
  development: {
    twitch: {
      username: 'test_user',
      oauth_token: 'oauth:test_token',
      channel: 'test_channel'
    },
    server: {
      port: 5173,
      ws_port: 8080
    }
  },
  
  // Configuration de test
  test: {
    twitch: {
      username: 'test_user',
      oauth_token: 'oauth:test_token',
      channel: 'test_channel'
    },
    server: {
      port: 5174,
      ws_port: 8081
    }
  },
  
  // Configuration de production
  production: {
    twitch: {
      username: process.env.TWITCH_USERNAME,
      oauth_token: process.env.TWITCH_OAUTH_TOKEN,
      channel: process.env.TWITCH_CHANNEL
    },
    server: {
      port: parseInt(process.env.PORT) || 5173,
      ws_port: parseInt(process.env.WS_PORT) || 8080
    }
  }
};
