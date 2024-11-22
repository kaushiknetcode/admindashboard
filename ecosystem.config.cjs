module.exports = {
  apps: [{
    name: 'voting-dashboard',
    script: 'server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5001,
      BASE_URL: 'https://dashboard.ersecretballot.in',
      MONGODB_URI: 'mongodb://localhost:27017/voting_dashboard'
    }
  }]
};