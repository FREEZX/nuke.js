'use strict';

module.exports = {
	port: process.env.PORT || 3000,
	redis: '',
	sessionSecret: 'g1i23fg9as68egj',
	cookie: {},
	db: {
		uri: process.env.MONGO_URL || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/remp'
	}
};