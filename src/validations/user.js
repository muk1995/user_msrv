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
		type: Joi.number().required().valid(1),
		email: Joi.alternatives().conditional('type', { is: 1, then: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required()}),
		phone: Joi.alternatives().conditional('type', { is: 1, then: Joi.string().length(10).pattern(/^[0-9]+$/).required()}),
		password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
	})
};

module.exports = schemas;