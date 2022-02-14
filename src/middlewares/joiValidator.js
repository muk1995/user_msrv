const joiValidator = (schema, property, type) => {
	return (req, res, next) => {
		const ResponseStruct = require('../helper/responseStruct');
		const { errMessage } = new ResponseStruct(
			type,
			'route',
			type + '.js',
			400
		);
		const data = req[property] ? req[property] : {};
		const { error } = schema.validate(data);
		const valid = error == null;

		if (valid) {
			next();
		} else {
			const { details } = error;
			const message = details.map((i) => i.message).join(',');
			const data = { req: { signature: req.data.signature } };
			const errorMessage = errMessage(null, data, message);
			res.status(400).json(errorMessage);
		}
	};
};
module.exports = joiValidator;
