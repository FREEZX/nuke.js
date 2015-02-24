'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


/**
 * Occupation Schema
 */
var ArticleSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Occupation name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	ancestors: [{ type: Schema.Types.ObjectId, ref: 'Occupation' }],
	parent: { type: String, default: '#' }
});

mongoose.model('Article', ArticleSchema);