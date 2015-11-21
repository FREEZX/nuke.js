var nats = require('nats');
var config = require('./config');

module.exports = nats.connect(config.nats);