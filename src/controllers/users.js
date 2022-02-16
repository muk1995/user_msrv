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
	let user = []
	if (data.email){
		let where = {
			email: data.email,
		};

		try {
			user = await users.check_data(where);
            if(data.email == user.email){
			return cb(
				errMessage('signup_user', data, ' email is already exist', user.email)
				);
			}
		} catch (err) {
			return cb(
				errMessage('signup_user', data, 'Unable to check email user data', err)
			);
		}
	}			   
utilities.generatePassword(data.password,async(err, hash ) => {
	if (err) {
		return cb(
				errMessage(
				'generatePassword',
				 data,
				'Unable to hashing data',
				 err
			    ));
			} 
    let timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
	    let insert = {
		    account_id: data.account_id,
		    salt: hash.hash,
        	password : data.password,
            email :data.email,
            name:data.name,
		    photo: data.photo,
		    is_deleted:data.is_deleted,
		    created_at: timestamp
	    } 	
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
	}catch (err) {
		return cb(
			errMessage('signup_user', data, 'Unable to signup user data', err)
		);
	}
    })
	
};
const login = async function (data, response, cb) {
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
					message: 'please enter email & phone'
				})
				.toJS()
		);
	} 	
	let user_data = [];	   
    if (data.email){
		let where = {
			email: data.email,
			password: data.password
		};

		try {
			user_data = await users.check_data(where);
		} catch (err) {
			return cb(
				errMessage('login', data, 'Unable to fetch user data', err)
			);
		}
	}
	if (data.phone){
		let where = {
			phone: data.phone,
			password: data.password
		};

		try {
			user_data = await users.check_data(where);
		} catch (err) {
			return cb(
				errMessage('login', data, 'Unable to fetch user data', err)
			);
		}
	}
	console.log(user_data.id,"id")
    let data_to_encrypt = {
		id: user_data.id,
		account_id: user_data.account_id,
		email: user_data.email,
		name: user_data.name,
		photo: user_data.photo,
	};
	let salt = user_data.salt;
	utilities.encryptData(data_to_encrypt, salt, function (err, cipher) {
		if (err) {
			return cb(
				errMessage(
					'Login encryptData',
					data,
					'Unable to encrypt data',
					err
				)
			);
		}
		const result = {
			id: user_data.id,
			account_id: user_data.account_id,
			email: user_data.email,
			name: user_data.name,
			photo: user_data.photo,
			new_user: user_data.name ? false : true,
			session_token: cipher
		};

		return cb(
			null,
			successMessage(
				'user_login',
				'Successfully Logged In!',
				data,
				result
			)
		);
	});
};


module.exports = {signup_user ,login }
