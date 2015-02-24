var init = require('./config/init')();
var app = require('./config/http')();
require('./config/passport')();
require('./config/mongoose')();