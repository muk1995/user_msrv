const mute = require('immutable');
const async = require('async');
const moment = require('moment');
const bcrypt = require('bcrypt');
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
    
	    let insert = {
		    //account_id: data.account_id,
		    //salt: hash.hash,
        	password :  hash,
            email :data.email,
            name:data.name,
		    photo: data.photo,
		    is_deleted:data.is_deleted,
		    //created_at: timestamp
	    		}
	 
    	create_accountid(data,insert, cb);		
				})	
			}
		}
}	
const create_accountid = async function (data, response, cb) {
	if (!cb) {
		cb = response;	
	}
	if (!response) {
		return cb(
			responseStruct
				.merge({
					signature: data.req.signature,
					action: 'signup_user',
					status: 400,
					success: false,
					message: 'Params missing'
				})
				.toJS()
		);
	}
	/*utilities.generate_account_id(async (err, account_id) => {
		if (err) {
			return cb(
				errMessage(
					'generate_account_id',
					data,
					'Unable to generate account id',
					err
				)
			);
		}
	*/
	    const account_id = Math.floor(Math.random() * (99999999 - 11111111) + 11111111);	
		let timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
		// GENERATE SALT
		let details = {
			account_id: account_id.toString(),
			salt: `temp_salt_${account_id}`,
			password : response.password.hash,
            email :response.email,
            name:response.name,
		    photo: response.photo,
		    is_deleted:response.is_deleted,
		    created_at: timestamp
		};
		try {
			const result = await signup(details);
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
		
}	

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
	const plaintextInput = data.password  
	
	
    if (data.email){
		let where = {
			email: data.email,
		};
		
		try {
        user_data = await users.check_data(where);
			try{
				const hash = user_data.password
				const compare = await bcrypt.compare(plaintextInput, hash).then(function(result) { return result})
				if(compare == false){
					return cb(
						errMessage('login', data, 'please enter correct password', compare)
					);
				}
			} catch (err) {
				return cb(
					errMessage('login', data, 'Unable to compare password', err)
				);
			}
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
    let data_to_encrypt = {
		id: user_data.id,
		account_id: user_data.account_id,
		email: user_data.email,
		name: user_data.name,
		photo: user_data.photo,
	};
	let salt = null;
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
			session_token: cipher,
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
const user_profile = async function (data, response, cb) {
	if (!cb) {
		cb = response;
	}
	if(!data.req.request.cookies.token){
		return cb(
			responseStruct
				.merge({
					signature: data.req.signature,
					action: 'user_profile',
					status: 400,
					success: false,
					message: 'please  login first '
				})
				.toJS()
		);
	}
	let user = data.req.request.cookies.token;
	const decryptedData = user;
	utilities.decryptData(decryptedData, null , function (e, decryptedData) {
		if (e) {
			return cb(
				errMessage(
					'Login decryptData',
					data,
					'Unable to dencrypt data',
					e
				)
			);
		}
	const result = decryptedData
	console.log(result)
		return cb(
			null,
			successMessage(
				'user_profile data',
				'Successfully user_profile data',
				data,
				result
			)
		);
	})	
}
const other_profile = async function (data, response, cb) {
	if (!cb) {
		cb = response;
	}
	let user_data = []
	let where = {
		account_id: data.id,
	};

	try {
		user_data = await users.check_data(where);
		let result = {
			id: user_data.id,
			account_id: user_data.account_id,
			email: user_data.email,
			name: user_data.name,
			photo: user_data.photo,
		};
		return cb(
			null,
			successMessage(
				'other_profile',
				'Successfully other_profile!',
				data,
				result
			)
		);
	} catch (err) {
		return cb(
			errMessage('other_profile', data, 'Unable to fetch other_profile data ', err)
		);
	}
}
		

module.exports = {signup_user ,login ,user_profile,other_profile }
