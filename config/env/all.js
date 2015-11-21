'use strict';

module.exports = {
  appName: 'Nuke.js app',
  port: process.env.PORT || 3000,
  redis: process.env.REDIS_URL || process.env.REDIS_PORT ||'',
  nats: {
    url: process.env.NATS_URL || 'nats://127.0.0.1:4222',
    user: process.env.NATS_USER,
    pass: process.env.NATS_PASS
  },
  sessionSecret: 'g1i23fg9as68egj',
  cookie: {},
  cachebox: {
    ttl: 30
  },
  db: {
    uri: process.env.MONGO_URL || 'mongodb://' + (process.env.MONGO_PORT_27017_TCP_ADDR || 'localhost') + '/nukejs-app'
  },
  cdnBase: process.env.CDN_BASE,
  assets: { //All of these must be contained in the public folder
    js: [
      '/primus/primus.js#nomin#nocdn',
      'lib/lodash/lodash.js',
      'lib/q/q.js',
      'lib/jquery/dist/jquery.js',
      'lib/bootstrap/dist/js/bootstrap.js',
      'lib/highcharts-release/highcharts.js',
      'js/bundle.js'
    ],
    css: [
      'css/global.css',
      'lib/fontawesome/css/font-awesome.css',
      'lib/bootstrap/dist/css/bootstrap.css'
    ]
  }
};
