const Joi = require('joi');

const schemas = {
	signup: Joi.object({
		account_id :Joi.number(),
		password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    	repeat_password: Joi.ref('password'),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
		name: Joi.string().alphanum().min(3).max(30).required(),

	}),
	login: Joi.object({
		phone: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
		cc: Joi.string().required(),
		otp: Joi.required()
	})
};

module.exports = schemas;