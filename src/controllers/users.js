const mute = require('immutable');
const async = require('async');
const moment = require('moment');
const { signup}  = require("../models/users")
// Models
const users = require('../models/users');

// Helpers
const utilities = require('../helper/security');

const responseStruct = mute.Map({
	signature: null,
	success: null,
	message: '',
	type: 'user',
	action: null,
	id: null,
	data: null,
	metadata: null,
	status: null
});

const log = mute.Map({
	location: 'controllers',
	file: 'auth.js'
});

const ResponseStruct = require('../helper/responseStruct');
const res = require('express/lib/response');
const { errMessage, successMessage } = new ResponseStruct(
	'users',
	'controllers',
	'users.js'
);

const signup_user = async function (data, response, cb) {
	if (!cb) {
		cb = response;
	}
	if (!data.email || !data.password) {
		return cb(
			responseStruct
				.merge({
					signature: data.req.signature,
					action: 'signup',
					status: 400,
					success: false,
					message: 'please enter email & password'
				})
				.toJS()
		);
	}
	/*if(data.password){
		
		utilities.generatePassword(async (err, cb) => {
			if (err) {
				console.log(err);
				
			}
			console.log({cb},"ki");
		})
	
}     */
    let timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
	    let insert = {
		    account_id: data.account_id,
		    salt: data.salt,
            password : data.password,
            email :data.email,
            name:data.name,
		    photo: data.photo,
		    is_deleted:data.is_deleted,
		    created_at: timestamp
	    }; 	
	try {
	    const result = await signup(insert);
        return cb(
			null,
			successMessage(
				'signup',
				'Successfully signup!',
				data,
				result
			))
	} catch (err) {
		return cb(
			errMessage('fetch_user', data, 'Unable to fetch user data', err)
		);
	}
	
};

module.exports = {signup_user}
