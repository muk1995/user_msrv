const db = require('./db');
const moment = require('moment');


const signup = function (data) { return db('users').insert(data); }
const check_data = function (data) { return db('users').where(data).first(); }
    
const get_used_account_ids = function (data, done) {
	let query_builder = db.raw(
		` SELECT array_agg(account_id) AS csv_data FROM ` + users + `;`
	);
	query_builder.asCallback(function (err, result) {
		if (err) {
			console.log(err);
			return done(err);
		}
		done(null, result);
	});
};

module.exports = {signup,check_data,get_used_account_ids}
   

